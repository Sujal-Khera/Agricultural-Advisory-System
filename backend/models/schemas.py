import os
from pydantic import BaseModel, Field
from typing import List, Optional

# --- Crop Models ---
class CropRecommendationRequest(BaseModel):
    N: float = Field(..., ge=0, description="Nitrogen content")
    P: float = Field(..., ge=0, description="Phosphorus content")
    K: float = Field(..., ge=0, description="Potassium content")
    temperature: float = Field(..., description="Temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity in percentage")
    ph: float = Field(..., description="pH value of the soil")
    rainfall: float = Field(..., ge=0, description="Rainfall in mm")
    user_id: Optional[str] = None

class CropRecommendationResponse(BaseModel):
    crop: str
    confidence: float

# --- Disease Models ---
class DiseasePredictionDetail(BaseModel):
    disease: str
    confidence: float

class DiseaseDetectionResponse(BaseModel):
    disease: str
    confidence: float
    top_3: List[DiseasePredictionDetail]

# --- Query Models ---
class QueryRequest(BaseModel):
    query: str
    context: Optional[str] = None
    user_id: Optional[str] = None

class QueryResponse(BaseModel):
    response: str

# --- Weather Models ---
class WeatherResponse(BaseModel):
    temperature: float
    humidity: float
    pressure: float
    wind_speed: float
    description: str
    rain_mm: float
    icon: str
