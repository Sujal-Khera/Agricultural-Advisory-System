import os
from supabase import create_client, Client
from utils.config import settings

_supabase: Client = None

def get_supabase() -> Client:
    global _supabase
    if _supabase is None:
        if settings.SUPABASE_URL and settings.SUPABASE_KEY:
            _supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    return _supabase

def save_weather(lat, lon, temp, humidity, pressure, wind_speed, description, rain_mm=0):
    client = get_supabase()
    if not client: return
    try:
        lat_rounded = round(lat, 1)
        lon_rounded = round(lon, 1)
        data = {
            "lat": lat,
            "lon": lon,
            "lat_rounded": lat_rounded,
            "lon_rounded": lon_rounded,
            "temperature": temp,
            "humidity": humidity,
            "pressure": pressure,
            "wind_speed": wind_speed,
            "description": description,
            "rain_mm": rain_mm
        }
        # Or simple insert if we didn't add unique constraint properly. Let's just insert for history.
        try:
            client.table("weather_cache").insert(data).execute()
        except Exception as insert_e:
            # If it already exists natively based on rounding, we safely ignore to maintain our cache
            if "duplicate key value" in str(insert_e).lower() or "23505" in str(insert_e):
                pass
            else:
                print(f"Failed to save weather to Supabase: {insert_e}")
    except Exception as e:
        print(f"General Supabase Error: {e}")

def save_recommendation(user_id, input_features, recommended_crop, confidence):
    client = get_supabase()
    if not client: return
    try:
        data = {
            "input_features": input_features,
            "recommended_crop": recommended_crop,
            "confidence": confidence
        }
        if user_id:
            data["user_id"] = user_id
        client.table("recommendation_history").insert(data).execute()
    except Exception as e:
        print(f"Failed to save recommendation to Supabase: {e}")

def save_diagnosis(user_id, disease_name, confidence, top_predictions):
    client = get_supabase()
    if not client: return
    try:
        data = {
            "disease_name": disease_name,
            "confidence": confidence,
            "top_predictions": top_predictions
        }
        if user_id:
            data["user_id"] = user_id
        client.table("diagnosis_history").insert(data).execute()
    except Exception as e:
        print(f"Failed to save diagnosis to Supabase: {e}")

def save_query(user_id, query_text, response_text, context=""):
    client = get_supabase()
    if not client: return
    try:
        data = {
            "query_text": query_text,
            "response_text": response_text,
            "context": context
        }
        if user_id:
            data["user_id"] = user_id
        client.table("query_history").insert(data).execute()
    except Exception as e:
        print(f"Failed to save query to Supabase: {e}")
