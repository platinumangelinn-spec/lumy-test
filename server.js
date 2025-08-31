import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Verificar que la API Key exista
if (!process.env.GEMINI_API_KEY) {
  console.error("No se encontró GEMINI_API_KEY en las variables de entorno.");
  process.exit(1);
}

// Inicializar cliente de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Endpoint de prueba
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Servidor LUMY Orchestrator funcionando" });
});

// Endpoint principal
app.post("/orchestrator", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ status: "error", message: "Falta el campo 'prompt' en el body" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ status: "ok", reply: text });
  } catch (error) {
    console.error("Error en /orchestrator:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Configurar puerto para Render
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(Orchestrator corriendo en http://localhost:${PORT});
});