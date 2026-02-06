import os
import json
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
from sklearn.metrics import precision_score, recall_score
import copy

from model import get_disease_model

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    train_dir = os.path.join(base_dir, 'dataset', 'Disease', 'Train')
    val_dir = os.path.join(base_dir, 'dataset', 'Disease', 'Validation')
    
    if not os.path.exists(train_dir):
        print(f"Error: Training dataset not found at {train_dir}")
        return

    # Check CUDA availability
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")

    # Define transforms with Data Augmentation and ResNet Normalization
    train_transforms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(10),
        transforms.ColorJitter(brightness=0.1, contrast=0.1),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    val_transforms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    print("Loading datasets...")
    train_dataset = datasets.ImageFolder(train_dir, transform=train_transforms)
    
    # Check if we have validation dataset
    has_val = os.path.exists(val_dir) and len(os.listdir(val_dir)) > 0
    if has_val:
        val_dataset = datasets.ImageFolder(val_dir, transform=val_transforms)

    batch_size = 32
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, pin_memory=True, num_workers=4)
    if has_val:
        val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, pin_memory=True, num_workers=4)

    # Save class indices
    model_dir = os.path.dirname(os.path.abspath(__file__))
    class_indices_path = os.path.join(model_dir, 'class_indices.json')
    class_indices = {str(v): k for k, v in train_dataset.class_to_idx.items()}
    with open(class_indices_path, 'w') as f:
        json.dump(class_indices, f)
    print(f"Saved class mapping to {class_indices_path} ({len(class_indices)} classes)")

    # Setup Model
    num_classes = len(train_dataset.classes)
    model = get_disease_model(num_classes=num_classes).to(device)
    
    # Freeze the base layers of ResNet
    for param in model.parameters():
        param.requires_grad = False
        
    # Unfreeze the specific final classification head for training
    for param in model.fc.parameters():
        param.requires_grad = True
    
    # Setup Loss
    criterion = nn.CrossEntropyLoss()
    
    # ONLY pass the unfrozen parameters to the optimizer!
    optimizer = optim.Adam(model.fc.parameters(), lr=0.001)
    
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', patience=2, factor=0.5)

    epochs = 10 # Only 10 epochs needed for Transfer Learning
    best_loss = float('inf')
    best_model_wts = copy.deepcopy(model.state_dict())
    patience = 4
    patience_counter = 0
    
    model_save_path = os.path.join(model_dir, 'disease_model.pth')
    history = {'train_loss': [], 'train_acc': [], 'val_loss': [], 'val_acc': []}

    print("Starting training with Transfer Learning...")
    for epoch in range(epochs):
        # 1. Training Phase
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        all_preds = []
        all_labels = []
        
        for i, (inputs, labels) in enumerate(train_loader):
            inputs, labels = inputs.to(device), labels.to(device)
            
            optimizer.zero_grad()
            
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item() * inputs.size(0)
            
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
            
            all_preds.extend(predicted.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
            
            if (i+1) % 50 == 0:
                print(f"Epoch [{epoch+1}/{epochs}], Step [{i+1}/{len(train_loader)}], Loss: {loss.item():.4f}")
                
        epoch_loss = running_loss / len(train_dataset)
        epoch_acc = 100 * correct / total
        
        prec = precision_score(all_labels, all_preds, average='macro', zero_division=0)
        rec = recall_score(all_labels, all_preds, average='macro', zero_division=0)
        
        print(f"--- Epoch {epoch+1} Train Loss: {epoch_loss:.4f}, Train Acc: {epoch_acc:.2f}%, Prec: {prec:.4f}, Rec: {rec:.4f}")
        
        history['train_loss'].append(epoch_loss)
        history['train_acc'].append(epoch_acc)
        
        # 2. Validation Phase
        if has_val:
            model.eval()
            val_loss = 0.0
            val_correct = 0
            val_total = 0
            val_preds = []
            val_targets = []
            
            with torch.no_grad():
                for inputs, labels in val_loader:
                    inputs, labels = inputs.to(device), labels.to(device)
                    outputs = model(inputs)
                    loss = criterion(outputs, labels)
                    val_loss += loss.item() * inputs.size(0)
                    _, predicted = torch.max(outputs.data, 1)
                    val_total += labels.size(0)
                    val_correct += (predicted == labels).sum().item()
                    
                    val_preds.extend(predicted.cpu().numpy())
                    val_targets.extend(labels.cpu().numpy())
                    
            val_epoch_loss = val_loss / len(val_dataset)
            val_epoch_acc = 100 * val_correct / val_total
            
            val_prec = precision_score(val_targets, val_preds, average='macro', zero_division=0)
            val_rec = recall_score(val_targets, val_preds, average='macro', zero_division=0)
            
            print(f"--- Epoch {epoch+1} Val Loss:   {val_epoch_loss:.4f}, Val Acc:   {val_epoch_acc:.2f}%, Val Prec: {val_prec:.4f}, Val Rec: {val_rec:.4f}")
            
            history['val_loss'].append(val_epoch_loss)
            history['val_acc'].append(val_epoch_acc)
            
            # Reduce LR on Plateau
            scheduler.step(val_epoch_loss)
            
            # Early Stopping and Checkpointing
            if val_epoch_loss < best_loss:
                best_loss = val_epoch_loss
                best_model_wts = copy.deepcopy(model.state_dict())
                patience_counter = 0
                print(f"Validation loss improved to {best_loss:.4f}. Model weights saved.")
            else:
                patience_counter += 1
                print(f"No improvement in validation loss. Early stopping counter: {patience_counter}/{patience}")
                if patience_counter >= patience:
                    print("Early stopping triggered due to plateau.")
                    break
        else:
            # If no validation set, just save the latest
            torch.save(model.state_dict(), model_save_path)
            
    # Restore best weights and save
    if has_val:
        v_acc_best = max(history['val_acc'])
        print(f"Training complete! Best val_acc: {v_acc_best:.2f}% (val_loss: {best_loss:.4f})")
        model.load_state_dict(best_model_wts)
        torch.save(model.state_dict(), model_save_path)
        print(f"Saved best model to {model_save_path}")

    # Save history
    history_path = os.path.join(model_dir, 'training_history.json')
    with open(history_path, 'w') as f:
        json.dump(history, f, indent=4)
        
if __name__ == "__main__":
    main()
