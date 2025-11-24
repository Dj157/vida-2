import os
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.docstore import InMemoryDocstore
from langchain.schema import Document

# Load environment variables (for OPENAI_API_KEY which is pre-configured)
load_dotenv()

# Use the pre-configured OpenAI client for Gemini 2.5 Flash
client = OpenAI()
MODEL_NAME = "gemini-2.5-flash"

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
    # as context in the prompt, as the full FAISS setup requires a proper embedding model and
    # the pre-configured client does not expose the embedding model name.
    
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    texts = text_splitter.split_text(KNOWLEDGE_BASE_CONTENT)
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
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "Você é um assistente de saúde mental empático e especializado em idosos."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )
        
        analysis_text = response.choices[0].message.content.strip()
        
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
