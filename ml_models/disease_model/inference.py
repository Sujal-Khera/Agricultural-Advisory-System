import os
import json
import torch
from torchvision import transforms
from PIL import Image
import torch.nn.functional as F

class DiseaseModelWrapper:
    def __init__(self, model_dir=None):
        if model_dir is None:
            model_dir = os.path.dirname(os.path.abspath(__file__))
            
        self.model_path = os.path.join(model_dir, 'disease_model.pth')
        self.encoder_path = os.path.join(model_dir, 'class_indices.json')
        
        self.model = None
        self.class_indices = None
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
    def load_model(self):
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model not found at {self.model_path}. Please train and download from Kaggle.")
            
        if not os.path.exists(self.encoder_path):
            raise FileNotFoundError(f"Class indices not found at {self.encoder_path}. Please download from Kaggle.")
            
        from ml_models.disease_model.model import get_disease_model
        
        with open(self.encoder_path, 'r') as f:
            self.class_indices = json.load(f)
            
        num_classes = len(self.class_indices)
        self.model = get_disease_model(num_classes).to(self.device)
        self.model.load_state_dict(torch.load(self.model_path, map_location=self.device, weights_only=True))
        self.model.eval()
            
    def predict(self, image_input):
        """
        Inputs:
        image_input (str/bytes): Path to image file or file-like object
        
        Returns:
        dict: {'disease': str, 'confidence': float, 'top_3': list}
        """
        if self.model is None or self.class_indices is None:
            self.load_model()
            
        # Process image
        if isinstance(image_input, str):
            img = Image.open(image_input).convert('RGB')
        else:
            # Assuming file-like object (e.g. from FastAPI UploadFile)
            img = Image.open(image_input).convert('RGB')
            
        # VERY IMPORTANT: Pretrained ResNet mandates this specific normalization
        preprocess = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
        # Add batch dimension
        img_tensor = preprocess(img).unsqueeze(0).to(self.device)
        
        # Predict probability
        with torch.no_grad():
            outputs = self.model(img_tensor)
            probabilities = F.softmax(outputs, dim=1)[0]
            
        # Get top 3
        top_prob, top_idx = torch.topk(probabilities, 3)
        
        top_prob = top_prob.cpu().numpy()
        top_idx = top_idx.cpu().numpy()
        
        # Format response
        best_idx = str(top_idx[0])
        predicted_disease = self.class_indices.get(best_idx, "Unknown")
        confidence = float(top_prob[0])
        
        top_3 = []
        for i in range(3):
            idx_str = str(top_idx[i])
            name = self.class_indices.get(idx_str, "Unknown")
            prob = float(top_prob[i])
            top_3.append({"disease": name, "confidence": round(prob * 100, 2)})
        
        return {
            "disease": predicted_disease,
            "confidence": round(confidence * 100, 2),
            "top_3": top_3
        }

if __name__ == "__main__":
    print("Run `python -m pytest tests/test_disease_model.py` instead for proper testing.")
