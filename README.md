# Vida+Ativa 💚  
Sistema inteligente de monitoramento de saúde e bem-estar mental para idosos, orientado por IA avançada.  
Precisão clínica. Empatia algorítmica. Vigilância cuidadora.

---

## 🚀 Arquitetura & Tecnologias  

Arquitetura em microsserviços — modular, clara, facilmente expansível:

| Componente     | Tecnologia Principal                        | Porta | Função |
|---------------|---------------------------------------------|-------|--------|
| Frontend      | React + Tailwind                            | 3000  | Interface visual com dados + respostas da IA |
| Backend       | Node.js + Express                           | 3001  | Orquestra requisições e conecta com o serviço de IA |
| Serviço de IA | Python + FastAPI + :contentReference[oaicite:0]{index=0} + RAG | 8001  | Processa dados vitais e gera análises inteligentes |
| Banco (protótipo) | SQLite                                 | —     | Persistência local simples |

Fluxo de dados:  
Frontend → Backend → Serviço de IA → Backend → Frontend

---

## 🧠 Núcleo Inteligente: LLM + RAG em Profundidade  

Aqui mora o cérebro do sistema — interpretação real, cuidado humano via código.

### 🔹 LLM – Large Language Model  
Usa Gemini 2.5 Flash (Google) para:  
- interpretar sinais vitais brutos (frequência cardíaca, sono, passos)  
- traduzir números em significado clínico e emocional  
- gerar linguagem empática, adaptada ao contexto do idoso  
- adaptar resposta conforme histórico/contexto  

Não é apenas um “responde a prompt”. É um diálogo médico-digital.

### 🔹 RAG – Retrieval-Augmented Generation  
Sistema consulta uma base especializada antes de pedir interpretação ao LLM — para garantir precisão médica/contextual:

Pipeline:

1. Recebe dados vitais do backend  
2. Busca na base especializada sobre saúde mental e bem-estar de idosos  
3. Injeta contexto + dados ao prompt  
4. Envia para o Gemini 2.5 Flash  
5. Recebe resposta fundamentada  

Base de conhecimento inclui:  
- parâmetros cardiológicos seguros para idosos  
- padrões de sono saudável  
- sinais clínicos de estresse, ansiedade, depressão  
- diretrizes de atividade física e bem-estar  
- tom de comunicação empática  

IA ancorada em ciência. Não em sorte.

---

## 📊 Fluxo de Processamento da IA  

Dados enviados (exemplo):

```json
{
  "heart_rate": 105,
  "sleep_duration_hours": 5.5,
  "steps_count": 800,
  "user_id": "idoso_001"
}
````

Processamento:

* Normalização e validação dos valores
* Comparação com ranges seguros/predefinidos
* Consulta à base RAG
* Geração de análise interpretativa

Saída:

* Diagnóstico contextualizado
* Recomendações práticas (sono, exercício, descanso, alerta, etc.)
* Linguagem empática e acessível
* **ALERTA SOS se frequência cardíaca > 120 bpm**

---

## ⚠️ Estado Atual: Dados Simulados

Dados provisórios vêm de `backend/controllers/monitoramentoController.js`, com valores fixos:

* 105 bpm
* 5.5 h de sono
* 800 passos

Consequências:

* Input constante → respostas semelhantes da IA
* Status geralmente “atenção moderada”

Serve para demonstração e testes.

---

## 🔄 Caminhos para Dados Reais

Para transformar demonstração em produto:

* Integração com APIs de smartwatches (Fitbit, Garmin, Apple Watch)
* Conexão Bluetooth para dados em tempo real
* Uso de banco de dados robusto (PostgreSQL ou similar)
* Armazenamento histórico e persistente para análise longitudinal

Objetivo: adicionar rastreamento contínuo, histórico real, predição de risco e alertas reais.

---

## ✅ O que Já Funciona

* Microsserviços comunicando corretamente
* Pipeline completo: Frontend ↔ Backend ↔ IA
* Lógica RAG + LLM ativa e funcional
* Respostas da IA geradas com coerência
* Sistema de alerta implementado
* Interface de usuário operacional

---

## 🛠️ Como Rodar (modo simples)

Pré-requisitos:

* Node.js v18+
* Python 3.10+
* npm

Comando único para reiniciar tudo:

```bash
pkill -f "uvicorn\|node index.js\|react-scripts" || true \
&& sleep 1 \
&& cd /workspaces/vida-2 \
&& rm -f ai/ai.log backend/backend.log frontend/frontend.log \
&& bash start-simple.sh
```

Acesse:
[http://localhost:3000](http://localhost:3000)

link para apresentação: https://gamma.app/docs/PROJETO-VIDAATIVA-vxb07igjv72jo4d?mode=present#card-ykltne9om6b1oz5



