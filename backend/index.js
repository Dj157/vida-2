const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const healthMockRoutes = require("./routes/healthMock");
const monitoramentoRoutes = require("./routes/monitoramento");


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve frontend estático (se compilado)
const path = require("path");
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Rota inicial de teste
app.get("/", (req, res) => {
  res.send("API Vida+Ativa funcionando!");
});

// Simulação de recebimento de dados do smartwatch
app.post("/api/dados", (req, res) => {
  const dados = req.body;
  console.log("Dados recebidos:", dados);
  res.json({ message: "Dados recebidos com sucesso!" });
});

// Proxy para o serviço de IA (health check)
app.get("/api/ai-health", async (req, res) => {
  try {
    const aiResponse = await axios.get("http://localhost:8001/health");
    res.json(aiResponse.data);
  } catch (error) {
    res.status(500).json({ error: "Serviço de IA indisponível" });
  }
});

// ➜ Aqui devemos registrar as rotas ANTES do listen
app.use("/", healthMockRoutes);

//nova rota de monitoramento
app.use("/api/monitoramento", monitoramentoRoutes);

// Catch-all: servir index.html para rotas não encontradas (React Router)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
