#!/bin/bash

# Script para iniciar o projeto Vida+Ativa (versão simplificada - tudo numa porta)
# Uso: bash start-simple.sh

set -e

echo "🚀 Iniciando projeto Vida+Ativa (tudo na porta 3000)..."
echo ""

# 1. Matando processos antigos
echo "🛑 Parando serviços antigos..."
pkill -f "uvicorn ai_service" || true
pkill -f "node index.js" || true
sleep 1
echo "✅ Feito."
echo ""

# 2. Inicia o Serviço de IA (FastAPI + Gemini)
echo "🤖 Iniciando Serviço de IA (porta 8001 - interno)..."
cd /workspaces/vida-2/ai
. .venv/bin/activate
nohup uvicorn ai_service:app --host 127.0.0.1 --port 8001 > ai.log 2>&1 &
AI_PID=$!
echo "✅ AI iniciado (PID: $AI_PID)"
sleep 2
echo ""

# 3. Inicia o Backend + Frontend (Express serve React build)
echo "🔧 Iniciando Backend + Frontend (porta 3000)..."
cd /workspaces/vida-2/backend
nohup npm start > backend.log 2>&1 &
SERVER_PID=$!
echo "✅ Backend + Frontend iniciados (PID: $SERVER_PID)"
sleep 2
echo ""

# 4. Verificar que os serviços estão respondendo
echo "🔍 Verificando serviços..."
echo ""

if curl -sS http://127.0.0.1:8001/health > /dev/null 2>&1; then
  echo "✅ AI (porta 8001): OK"
else
  echo "❌ AI (porta 8001): ERRO - Verifique ai.log"
fi

if curl -sS http://127.0.0.1:3000/api/monitoramento > /dev/null 2>&1; then
  echo "✅ Backend (porta 3000): OK"
else
  echo "❌ Backend (porta 3000): ERRO - Verifique backend.log"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Projeto Vida+Ativa pronto!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 Acesse:"
echo "  • Frontend + Backend: http://localhost:3000"
echo "  • Frontend (Codespaces): https://legendary-space-goggoses-97qjq4669rr4h65x-3000.app.github.dev"
echo "  • AI (API): http://localhost:8001/health"
echo ""
echo "📖 Para ver logs em tempo real:"
echo "  tail -f /workspaces/vida-2/ai/ai.log"
echo "  tail -f /workspaces/vida-2/backend/backend.log"
echo ""
