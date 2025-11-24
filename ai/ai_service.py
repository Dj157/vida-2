import os
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables (for GOOGLE_API_KEY)
load_dotenv()

# Configure Gemini (Google) Generative AI client using environment variable
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Choose the Gemini model
MODEL_NAME = "gemini-2.5-flash"
# Create a model handle
model = genai.GenerativeModel(MODEL_NAME)

# --- RAG Setup ---
# The AI service will be a simple FastAPI application
app = FastAPI()

# Placeholder for the knowledge base content
KNOWLEDGE_BASE_CONTENT = """
# Base de Conhecimento: Saúde Mental e Bem-Estar de Idosos

## Sinais de Estresse e Ansiedade em Idosos
- Aumento súbito da frequência cardíaca (acima de 100 bpm em repouso) sem esforço físico.
- Padrões de sono interrompidos ou insônia por mais de 3 dias seguidos.
- Redução drástica na contagem de passos diários (abaixo de 1000).
- Alterações de humor, irritabilidade ou isolamento social.

## Recomendações para Frequência Cardíaca Elevada
- Se a frequência cardíaca estiver acima de 120 bpm em repouso, acionar o alerta SOS.
- Entre 100-120 bpm, sugerir técnicas de respiração e relaxamento.
- Recomendar contato com o cuidador para verificação do estado emocional.

## Recomendações para Distúrbios do Sono
- Sugerir rotina de sono regular e evitar telas antes de dormir.
- Se a insônia persistir, recomendar atividade física leve durante o dia.

## Recomendações para Baixa Atividade Física
- Incentivar caminhadas leves e exercícios de alongamento.
- Se a contagem de passos for consistentemente baixa, verificar se há dor ou desconforto.

## Tom de Comunicação
- A comunicação deve ser empática, clara e não alarmista.
- Sempre sugerir a consulta a um profissional de saúde em caso de persistência dos sintomas.
"""

# Initialize FAISS Vector Store (Simplified for demonstration)
def initialize_vector_store():
    # For this demonstration, we will use a simplified RAG where the entire knowledge base is passed
    # as context in the prompt. The original code used LangChain's text splitter and Document classes,
    # but to avoid dependency/version issues we implement a tiny local splitter and Document wrapper.

    def split_text(text, chunk_size=1000, overlap=0):
        if chunk_size <= 0:
            return [text]
        chunks = []
        start = 0
        step = chunk_size - overlap if chunk_size - overlap > 0 else chunk_size
        while start < len(text):
            chunks.append(text[start:start+chunk_size])
            start += step
        return chunks

    class Document:
        def __init__(self, page_content):
            self.page_content = page_content

    texts = split_text(KNOWLEDGE_BASE_CONTENT, chunk_size=1000, overlap=0)
    docs = [Document(page_content=t) for t in texts]

    return docs

KNOWLEDGE_DOCS = initialize_vector_store()

# --- Data Model for API Request ---
class VitalData(BaseModel):
    heart_rate: int
    sleep_duration_hours: float
    steps_count: int
    user_id: str

# --- Core RAG Function ---
def analyze_vitals_with_rag(data: VitalData):
    # 1. Retrieval (Simplified): Select the entire knowledge base as context
    context = "\n---\n".join([doc.page_content for doc in KNOWLEDGE_DOCS])
    
    # 2. Augmented Generation: Create the prompt
    prompt = f"""
    Você é um assistente de saúde mental empático e especializado em idosos.
    Sua tarefa é analisar os dados vitais de um idoso e, com base na Base de Conhecimento fornecida, gerar uma análise e uma recomendação.

    **Base de Conhecimento:**
    {context}

    **Dados Vitais do Idoso (ID: {data.user_id}):**
    - Frequência Cardíaca em Repouso: {data.heart_rate} bpm
    - Duração do Sono (última noite): {data.sleep_duration_hours} horas
    - Contagem de Passos (últimas 24h): {data.steps_count} passos

    **Instruções para a Resposta:**
    1. **Análise:** Identifique o sintoma mais preocupante (se houver) e o relacione com a Base de Conhecimento.
    2. **Recomendação:** Forneça uma recomendação clara, empática e não alarmista.
    3. **Alerta SOS:** Se a Frequência Cardíaca for superior a 120 bpm, inclua a frase "ALERTA SOS NECESSÁRIO" no início da análise.

    Formato da Resposta (apenas o texto):
    [Análise e Recomendação]
    """
    
    try:
        # Use the Gemini model to generate content. The simple `generate_content` wrapper
        # accepts a prompt (string) and returns an object with textual output.
        response = model.generate_content(prompt)

        # Try common response fields (best-effort compatibility across client versions)
        analysis_text = None
        if hasattr(response, "text") and response.text:
            analysis_text = response.text
        else:
            try:
                analysis_text = response.candidates[0].content
            except Exception:
                analysis_text = str(response)

        analysis_text = analysis_text.strip()

        # Check for SOS alert
        sos_alert = "ALERTA SOS NECESSÁRIO" in analysis_text

        return {
            "analysis": analysis_text,
            "sos_alert": sos_alert
        }

    except Exception as e:
        print(f"Error during LLM call: {e}")
        return {
            "analysis": "Erro ao processar a análise de IA.",
            "sos_alert": False
        }

# --- API Endpoint ---
@app.post("/analyze_vitals")
async def analyze_vitals(data: VitalData):
    """
    Endpoint para receber dados vitais e retornar a análise de IA.
    """
    if not all([data.heart_rate, data.sleep_duration_hours, data.steps_count]):
        raise HTTPException(status_code=400, detail="Dados vitais incompletos.")
    
    result = analyze_vitals_with_rag(data)
    return result

# --- Health Check Endpoint ---
@app.get("/health")
async def health_check():
    return {"status": "ok", "model": MODEL_NAME}

# To run the service: uvicorn ai_service:app --host 0.0.0.0 --port 8001
