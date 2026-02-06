import json
import matplotlib.pyplot as plt
import os

def plot_history():
    dir_path = os.path.dirname(os.path.abspath(__file__))
    history_path = os.path.join(dir_path, 'training_history.json')
    
    with open(history_path, 'r') as f:
        history = json.load(f)
        
    epochs = range(1, len(history['train_loss']) + 1)
    
    # We will save these to the central artifacts directory for display
    target_dir = r"C:\Users\hp\.gemini\antigravity\brain\c0b85fd3-1a69-4200-8b12-054a24a8dce2"
    
    # Plot Loss
    plt.figure(figsize=(10, 5))
    plt.plot(epochs, history['train_loss'], 'bo-', label='Training Loss')
    plt.plot(epochs, history['val_loss'], 'ro-', label='Validation Loss')
    plt.title('Plant Doctor CNN - Loss Curve')
    plt.xlabel('Epochs')
    plt.ylabel('Contextual Cross Entropy Loss')
    plt.legend()
    plt.grid(alpha=0.3)
    loss_path = os.path.join(target_dir, 'loss_curve.png')
    plt.savefig(loss_path, dpi=150, bbox_inches='tight')
    plt.close()
    
    # Plot Accuracy
    plt.figure(figsize=(10, 5))
    plt.plot(epochs, history['train_acc'], 'bo-', label='Training Accuracy (%)')
    plt.plot(epochs, history['val_acc'], 'ro-', label='Validation Accuracy (%)')
    plt.title('Plant Doctor CNN - Accuracy Curve')
    plt.xlabel('Epochs')
    plt.ylabel('Accuracy (%)')
    plt.legend()
    plt.grid(alpha=0.3)
    acc_path = os.path.join(target_dir, 'accuracy_curve.png')
    plt.savefig(acc_path, dpi=150, bbox_inches='tight')
    plt.close()
    
    print(f"Metrics plotted successfully to {target_dir}")

if __name__ == "__main__":
    plot_history()
