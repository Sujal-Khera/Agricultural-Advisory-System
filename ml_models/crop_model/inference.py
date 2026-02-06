import os
import pickle
import numpy as np
import pandas as pd

class CropModelWrapper:
    def __init__(self, model_dir=None):
        if model_dir is None:
            model_dir = os.path.dirname(os.path.abspath(__file__))
            
        self.model_path = os.path.join(model_dir, 'crop_model.pkl')
        self.encoder_path = os.path.join(model_dir, 'label_encoder.pkl')
        
        self.model = None
        self.label_encoder = None
        # Accurate feature names matching training data to avoid Sklearn warnings
        self.feature_names = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        
    def load_model(self):
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model not found at {self.model_path}. Please run train.py first.")
            
        if not os.path.exists(self.encoder_path):
            raise FileNotFoundError(f"Label encoder not found at {self.encoder_path}. Please run train.py first.")
            
        with open(self.model_path, 'rb') as f:
            self.model = pickle.load(f)
            
        with open(self.encoder_path, 'rb') as f:
            self.label_encoder = pickle.load(f)
            
    def predict(self, n, p, k, temperature, humidity, ph, rainfall):
        """
        Inputs:
        n (int/float): Nitrogen [0-140]
        p (int/float): Phosphorus [5-145]
        k (int/float): Potassium [5-205]
        temperature (float): [8.8-43.7]
        humidity (float): [14.0-100.0]
        ph (float): [3.5-10.0]
        rainfall (float): [20.0-299.0]
        
        Returns:
        dict: {'crop': str, 'confidence': float}
        """
        if self.model is None or self.label_encoder is None:
            self.load_model()
            
        # Create input DataFrame with feature names to suppress UserWarning
        input_df = pd.DataFrame(
            [[n, p, k, temperature, humidity, ph, rainfall]],
            columns=self.feature_names
        )
        
        # Predict probability
        proba = self.model.predict_proba(input_df)[0]
        
        # Get best class
        best_idx = np.argmax(proba)
        confidence = float(proba[best_idx])
        pred_label_encoded = [best_idx]
        
        # Decode label
        predicted_crop = self.label_encoder.inverse_transform(pred_label_encoded)[0]
        
        return {
            "crop": predicted_crop.lower(),
            "confidence": round(confidence * 100, 2)
        }

if __name__ == "__main__":
    # Simple test
    wrapper = CropModelWrapper()
    print("Testing inference...")
    result = wrapper.predict(n=90, p=42, k=43, temperature=20.8, humidity=82.0, ph=6.5, rainfall=202.9)
    print(f"Predicted Crop: {result['crop']}")
    print(f"Confidence: {result['confidence']}%")
