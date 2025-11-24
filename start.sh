#!/bin/bash

# Script para iniciar os 3 serviços do projeto Vida+Ativa
# Uso: bash start.sh

set -e

echo "🚀 Iniciando projeto Vida+Ativa..."
echo ""

# 1. Matando processos antigos (opcional, para garantir que estamos começando do zero)
echo "🛑 Parando serviços antigos (se estiverem rodando)..."
pkill -f "uvicorn ai_service" || true
pkill -f "node index.js" || true
pkill -f "react-scripts start" || true
sleep 1
echo "✅ Feito."
echo ""

# 2. Inicia o Serviço de IA (FastAPI + Gemini)
echo "🤖 Iniciando Serviço de IA (porta 8001)..."
cd /workspaces/vida-2/ai
. .venv/bin/activate
nohup uvicorn ai_service:app --host 0.0.0.0 --port 8001 --reload > ai.log 2>&1 &
AI_PID=$!
echo "✅ Serviço de IA iniciado (PID: $AI_PID). Log: ai.log"
sleep 2
echo ""

# 3. Inicia o Backend (Node.js + Express)
echo "🔧 Iniciando Backend (porta 3001)..."
cd /workspaces/vida-2/backend
nohup npm start > backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend iniciado (PID: $BACKEND_PID). Log: backend.log"
sleep 2
echo ""

# 4. Inicia o Frontend (React)
echo "🎨 Iniciando Frontend (porta 3000/3002)..."
cd /workspaces/vida-2/frontend
nohup npm start > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend iniciado (PID: $FRONTEND_PID). Log: frontend.log"
sleep 3
echo ""

# 5. Verificar que os serviços estão respondendo
echo "🔍 Verificando serviços..."
echo ""

# Testa AI
if curl -sS http://127.0.0.1:8001/health > /dev/null 2>&1; then
  echo "✅ AI (porta 8001): OK"
else
  echo "❌ AI (porta 8001): ERRO - Verifique ai.log"
fi

# Testa Backend
if curl -sS http://127.0.0.1:3001/ > /dev/null 2>&1; then
  echo "✅ Backend (porta 3001): OK"
else
  echo "❌ Backend (porta 3001): ERRO - Verifique backend.log"
fi

# Testa Frontend (pode estar em 3000 ou 3002)
if curl -sS http://127.0.0.1:3000/ > /dev/null 2>&1 || curl -sS http://127.0.0.1:3002/ > /dev/null 2>&1; then
  echo "✅ Frontend (porta 3000/3002): OK"
else
  echo "❌ Frontend: ERRO - Verifique frontend.log"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Projeto Vida+Ativa pronto!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 URLs e Logs:"
echo "  • Frontend:   http://localhost:3000 (ou 3002)"
echo "  • Backend:    http://localhost:3001"
echo "  • AI (API):   http://localhost:8001/health"
echo ""
echo "  • Logs:"
echo "    - /workspaces/vida-2/ai/ai.log"
echo "    - /workspaces/vida-2/backend/backend.log"
echo "    - /workspaces/vida-2/frontend/frontend.log"
echo ""
echo "💡 Para parar os serviços:"
echo "  pkill -f 'uvicorn ai_service'"
echo "  pkill -f 'node index.js'"
echo "  pkill -f 'react-scripts start'"
echo ""
echo "📖 Para ver logs em tempo real:"
echo "  tail -f /workspaces/vida-2/ai/ai.log"
echo "  tail -f /workspaces/vida-2/backend/backend.log"
echo "  tail -f /workspaces/vida-2/frontend/frontend.log"
echo ""
