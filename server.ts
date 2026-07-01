import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Gemini Translation
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, wordsInfo } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Nenhum texto fornecido" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error("GEMINI_API_KEY is not defined in process.env");
        return res.status(500).json({ error: "Chave API do Gemini não configurada." });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Instruct Gemini to translate the generated Chinese sentence into accurate, natural Portuguese
      const prompt = `Você é um tradutor especialista de Mandarim para Português Brasileiro.
Traduza a seguinte frase em chinês (Mandarim) para o português de forma muito natural, precisa e fluida.

Frase em Hanzi: ${text}

Informações gramaticais e traduções literais de cada palavra selecionada na sequência (use como contexto para entender a estrutura):
${JSON.stringify(wordsInfo, null, 2)}

Por favor, retorne APENAS a tradução direta em português (sem repetições, sem explicações, sem aspas e sem o texto original).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      const translation = response.text?.trim() || "";
      res.json({ translation });
    } catch (error: any) {
      console.error("Erro na tradução do Gemini:", error);
      res.status(500).json({ error: error.message || "Falha ao traduzir frase" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
