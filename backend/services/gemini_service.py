import requests
import json
from utils.config import settings

# Define the system instruction to give it an agricultural context
AGRICULTURAL_PROMPT = """
You are an expert Agronomist and Agricultural AI Assistant created for an Intelligent Multimodal Agri-Advisory System. 
Your goal is to help farmers and agriculture enthusiasts by answering their questions related to crop cultivation, soil health, farming best practices, and disease management.
Do not answer questions that are completely unrelated to agriculture, farming, crops, or weather.
If asked about topics outside your domain, politely decline and steer the conversation back to agriculture.
Always format your responses clearly using Markdown with bullet points or numbered lists where appropriate for readability.
"""

def get_gemini_response(query: str, context: str = None) -> str:
    """
    Sends query and optional context to OpenRouter and returns the markdown response.
    We are keeping the function name get_gemini_response to prevent routing errors.
    """
    if not settings.OPENROUTER_API_KEY:
        return "I'm sorry, my AI backend is not configured correctly (Missing OPENROUTER_API_KEY). Please contact support."

    context_string = f"\n\nHere is the recent context from the model diagnosis or recommendation:\n{context}\nPlease ensure your response directly addresses this context." if context else ""
    prompt = f"{context_string}\n\nUser Question: {query}"
    
    messages = [
        {"role": "system", "content": AGRICULTURAL_PROMPT},
        {"role": "user", "content": prompt}
    ]

    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            data=json.dumps({
                "model": "qwen/qwen3.6-plus:free",
                "messages": messages,
                "reasoning": {"enabled": True}
            }),
            timeout=45
        )
        response.raise_for_status()
        data = response.json()
        
        # OpenRouter returns standard OpenAI schema
        content = data['choices'][0]['message']['content']
        return content
        
    except Exception as e:
        print(f"OpenRouter API Error: {e}")
        return "Sorry, I am having trouble connecting to my agricultural database right now (OpenRouter API Error)."
