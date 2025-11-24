# Projeto Vida+Ativa 💚

Sistema de monitoramento de saúde e bem-estar mental de idosos com uso de Inteligência Artificial (IA) e dados de smartwatch.

## 🚀 Arquitetura e Tecnologia

O projeto utiliza uma arquitetura de microsserviços para separar as responsabilidades:

| Componente | Tecnologia Principal | Porta Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| **Frontend** | React + Tailwind | 3000 | Interface do usuário para visualização dos dados e análise da IA. |
| **Backend** | Node.js + Express | 3001 | Orquestrador principal. Recebe dados (simulados/reais) e se comunica com o serviço de IA. |
| **Serviço de IA** | Python + FastAPI + LLM (Gemini 2.5 Flash) + RAG | 8001 | Analisa os dados vitais e gera recomendações e alertas SOS com base em uma base de conhecimento especializada. |
| **Banco de Dados** | SQLite | N/A | Utilizado para prototipagem. |

## 🧠 O Uso da Inteligência Artificial (LLM + RAG)

O coração do projeto é o serviço de IA, que utiliza a arquitetura **RAG (Retrieval-Augmented Generation)**:

1.  **Dados Vitais:** O Backend envia dados de saúde (Frequência Cardíaca, Sono, Passos) para o Serviço de IA.
2.  **RAG:** O Serviço de IA utiliza o **Gemini 2.5 Flash** como LLM e uma base de conhecimento interna (RAG) sobre saúde mental de idosos para contextualizar os dados.
3.  **Análise:** A IA gera uma análise empática e uma recomendação, além de acionar um **ALERTA SOS** se a Frequência Cardíaca estiver acima de 120 bpm.

## 🛠️ Como Rodar o Sistema (Passo a Passo)

O sistema é composto por três partes que devem ser iniciadas em ordem: **Serviço de IA**, **Backend** e **Frontend**.

### Pré-requisitos

*   Node.js (v18+)
*   Python (v3.10+)
*   npm

### 1. Configurar e Iniciar o Serviço de IA (Python)

O serviço de IA é o primeiro a ser iniciado, pois o Backend depende dele.

```bash
# 1. Navegue até a pasta do serviço de IA
cd vida-2/ai

# 2. Instale as dependências Python
sudo pip3 install -r requirements.txt

# 3. Inicie o servidor FastAPI (porta 8001)
# O serviço usará o modelo Gemini 2.5 Flash, que já está configurado no ambiente.
uvicorn ai_service:app --host 0.0.0.0 --port 8001
```

### 2. Configurar e Iniciar o Backend (Node.js)

O Backend se comunica com o Frontend (porta 3000) e com o Serviço de IA (porta 8001).

```bash
# 1. Abra um novo terminal e navegue até a pasta do Backend
cd vida-2/backend

# 2. Instale as dependências Node.js
npm install

# 3. Inicie o servidor Node.js (porta 3001)
npm start
```

### 3. Configurar e Iniciar o Frontend (React)

O Frontend consome os dados processados do Backend.

```bash
# 1. Abra um terceiro terminal e navegue até a pasta do Frontend
cd vida-2/frontend

# 2. Instale as dependências Node.js
npm install

# 3. Inicie a aplicação React (porta 3000)
npm start
```

Após seguir estes passos, o sistema estará totalmente funcional e acessível em `http://localhost:3000`. O Frontend exibirá os dados vitais (simulados no `monitoramentoController.js`) e a análise gerada em tempo real pelo Serviço de IA.
