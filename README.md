# Vida+ 💚
Sistema inteligente de monitoramento de saúde e bem-estar mental para idosos, orientado por IA avançada. Precisão clínica. Empatia algorítmica. Vigilância cuidadora.

---

## 🚀 Arquitetura & Tecnologias

Arquitetura em microsserviços — modular, clara, facilmente expansível, agora com foco em **integração real de smartwatches** e **aplicativo mobile cross-platform**:

| Componente | Tecnologia Principal | Porta | Função |
|---------------|---------------------------------------------|-------|--------|
| **Frontend Web** | React + Tailwind | 3000 | Interface visual com dados + respostas da IA |
| **Aplicativo Mobile** | React Native + Expo | (N/A) | Coleta dados de saúde (Apple Health/Google Fit), exibe análises, dispara SOS |
| **Backend** | Node.js + Express | 3001 | Orquestra requisições, conecta com o serviço de IA, gerencia alertas e notificações |
| **Serviço de IA** | Python + FastAPI + Gemini 2.5 Flash + RAG | 8001 | Processa dados vitais e gera análises inteligentes |
| **Banco de Dados** | PostgreSQL (Produção) / SQLite (Desenvolvimento) | — | Persistência segura de dados de saúde |

**Fluxo de dados:**
Smartwatch → Apple Health/Google Fit → Aplicativo Mobile → Backend → Serviço de IA → Backend → Aplicativo Mobile (Notificações)

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

**Pipeline:**

1. Recebe dados vitais do backend
2. Busca na base especializada sobre saúde mental e bem-estar de idosos
3. Injeta contexto + dados ao prompt
4. Envia para o Gemini 2.5 Flash
5. Recebe resposta fundamentada

**Base de conhecimento inclui:**
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

**Processamento:**

* Normalização e validação dos valores
* Comparação com ranges seguros/predefinidos
* Consulta à base RAG
* Geração de análise interpretativa

**Saída:**

* Diagnóstico contextualizado
* Recomendações práticas (sono, exercício, descanso, alerta, etc.)
* Linguagem empática e acessível
* **ALERTA SOS se frequência cardíaca > 120 bpm**

---

## ⌚ Integração com Smartwatches (Dados Reais)

O projeto agora integra dados reais de smartwatches através das APIs de saúde dos sistemas operacionais móveis:

*   **Apple HealthKit (iOS):** Utiliza `react-native-health` para acessar dados de saúde do Apple Watch e outros dispositivos conectados ao iPhone.
*   **Google Fit / Health Connect (Android/Wear OS):** Utiliza `react-native-google-fit` para acessar dados de saúde de smartwatches Android e outros dispositivos conectados ao Google Fit.

**Fluxo:** O aplicativo mobile solicita permissão ao usuário, coleta os dados periodicamente (mesmo em segundo plano) e os envia para o Backend para análise da IA.

---

## 🚨 Sistema de Alerta Event-Driven (Webhooks, Push, WhatsApp/Email)

O sistema de alerta foi aprimorado para ser proativo e multicanal:

1.  **Detecção de Anomalias:** A IA no Serviço de IA detecta padrões anormais nos dados de saúde.
2.  **Disparo de Webhook:** O Serviço de IA envia um webhook para o Backend (`/webhooks/ai-analysis`) com os detalhes da anomalia e o status `sos_alert`.
3.  **Notificações Multicanal:** O Backend, ao receber o webhook com `sos_alert: true`, utiliza:
    *   **Push Notifications:** Via Firebase Cloud Messaging (FCM) para o aplicativo mobile do cuidador.
    *   **E-mail:** Via Nodemailer para o endereço de e-mail do cuidador.
    *   **WhatsApp/SMS:** Via Twilio para o número de telefone do cuidador.

---

## 🔒 Segurança e Privacidade (LGPD)

*   **Criptografia de Dados:** Dados sensíveis de saúde são criptografados no Backend (em repouso) e em trânsito (HTTPS).
*   **Armazenamento Local Seguro:** No aplicativo mobile, dados sensíveis são armazenados usando `AsyncStorage` com criptografia e `expo-secure-store` para chaves e tokens.
*   **Anonimização:** Funções para anonimizar informações pessoais (e-mail, telefone) antes de armazenamento ou uso em logs.
*   **Consentimento:** O aplicativo mobile solicita consentimento explícito do usuário para acesso e compartilhamento de dados de saúde.

---

## ✅ O que Já Funciona

*   Microsserviços comunicando corretamente (Frontend Web, Backend, Serviço de IA).
*   Pipeline completo: Frontend ↔ Backend ↔ IA.
*   Lógica RAG + LLM ativa e funcional com Gemini 2.5 Flash.
*   Respostas da IA geradas com coerência.
*   Sistema de alerta implementado no Backend com suporte a múltiplos canais.
*   Interface de usuário web operacional.
*   **Estrutura do Aplicativo Mobile React Native com serviços de integração de saúde e background tasks.**
*   **Serviços de criptografia e armazenamento seguro de dados.**

---

## 🛠️ Como Rodar (Desenvolvimento Local)

**Pré-requisitos:**

*   Node.js v18+
*   Python 3.10+
*   npm / yarn
*   Expo CLI (`npm install -g expo-cli`)

**Passo a Passo:**

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/Dj157/vida-2.git
    cd vida-2
    ```

2.  **Configurar Variáveis de Ambiente:**
    *   Crie um arquivo `.env` na pasta `backend` e `ai` com base nos arquivos `.env.example` fornecidos.
    *   No `backend/.env`, defina `AI_SERVICE_URL` (se estiver rodando localmente, será `http://localhost:8001/analyze_vitals`).
    *   No `backend/.env`, defina `DATABASE_URL` (para desenvolvimento, pode ser um SQLite local ou um PostgreSQL).
    *   No `backend/.env`, configure as credenciais para `EMAIL_USER`, `EMAIL_PASSWORD` (para Nodemailer) e `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` (para Twilio).
    *   No `ai/.env`, defina `ENCRYPTION_KEY` (uma chave secreta forte).

3.  **Instalar Dependências e Iniciar Serviços (3 Terminais):**

    **Terminal 1: Serviço de IA (Python/FastAPI)**
    ```bash
    cd ai
    pip install -r requirements.txt
    uvicorn ai_service:app --host 0.0.0.0 --port 8001
    ```

    **Terminal 2: Backend (Node.js/Express)**
    ```bash
    cd backend
    npm install
    npm start
    ```

    **Terminal 3: Frontend Web (React)**
    ```bash
    cd frontend
    npm install
    npm start
    ```

    **Terminal 4: Aplicativo Mobile (React Native/Expo)**
    ```bash
    cd mobile
    npm install
    npx expo start --tunnel # Use --tunnel se estiver testando em dispositivo físico na mesma rede
    ```
    *   **Para o App Mobile:** Instale o aplicativo **Expo Go** no seu celular Android/iOS e escaneie o QR Code que aparecerá no Terminal 4.

4.  **Acessar a Aplicação:**
    *   **Web:** Abra seu navegador e acesse `http://localhost:3000`.
    *   **Mobile:** Abra o app no seu celular via Expo Go.

---

## ☁️ Como Rodar (Deploy Permanente - Vercel/Render)

Para um deploy permanente e acessível globalmente, siga o guia detalhado fornecido anteriormente, utilizando **Render** para o Backend e Serviço de IA, e **Vercel** para o Frontend Web. O aplicativo mobile será construído e publicado nas lojas de aplicativos (Google Play Store, Apple App Store) via **EAS Build (Expo Application Services)**.

**Passos Essenciais para Deploy:**

1.  **Banco de Dados PostgreSQL:** Crie um no Render ou Supabase e atualize `DATABASE_URL` no `.env` do Backend.
2.  **Variáveis de Ambiente:** Configure todas as variáveis de ambiente (`AI_SERVICE_URL`, `DATABASE_URL`, `EMAIL_USER`, `EMAIL_PASSWORD`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`, `ENCRYPTION_KEY`, `REACT_APP_API_URL`) diretamente nas configurações de ambiente das plataformas (Render e Vercel), **NUNCA** no código.
3.  **Deploy do Serviço de IA (Render):** Aponte para a pasta `ai` do seu repositório.
4.  **Deploy do Backend (Render):** Aponte para a pasta `backend` do seu repositório.
5.  **Deploy do Frontend Web (Vercel):** Aponte para a pasta `frontend` do seu repositório.
6.  **Build e Publicação do App Mobile (EAS Build):**
    *   Instale `eas-cli`: `npm install -g eas-cli`
    *   Faça login: `eas login`
    *   Configure o projeto: `eas build:configure`
    *   Crie o build para Android: `eas build -p android --profile production`
    *   Crie o build para iOS: `eas build -p ios --profile production`
    *   Publique nas lojas: `eas submit -p android` e `eas submit -p ios`

---

## 🎨 Logo "Vida+"

![Vida+ Logo](vida_plus_logo.png)

---

## 🔗 Referências

*   [React Native Health](https://github.com/react-native-health/react-native-health)
*   [React Native Google Fit](https://github.com/StasDosSantos/react-native-google-fit)
*   [Expo Background Fetch](https://docs.expo.dev/versions/latest/sdk/background-fetch/)
*   [Nodemailer](https://nodemailer.com/)
*   [Twilio](https://www.twilio.com/)
*   [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
*   [Render](https://render.com/)
*   [Vercel](https://vercel.com/)
*   [Expo Application Services (EAS)](https://docs.expo.dev/build/introduction/)
