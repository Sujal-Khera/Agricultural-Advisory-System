import torch
import torch.nn as nn
import torchvision.models as models

def get_disease_model(num_classes=42):
    """
    Returns a ResNet34 model modified for high-accuracy crop disease detection.
    Pretrained on ImageNet.
    """
    model = models.resnet34(weights=models.ResNet34_Weights.DEFAULT)
    
    num_ftrs = model.fc.in_features
    model.fc = nn.Sequential(
        nn.Linear(num_ftrs, 512),
        nn.BatchNorm1d(512),
        nn.ReLU(),
        nn.Dropout(0.4),
        nn.Linear(512, num_classes)
    )
    
    return model

# Main block for testing local instantiation
if __name__ == "__main__":
    net = get_disease_model(42)
    print("ResNet34 Architecture Generated.")
