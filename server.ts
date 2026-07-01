import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Gemini Translation with MyMemory fallback
  app.post("/api/translate", async (req, res) => {
    const { text, wordsInfo } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Nenhum texto fornecido" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    // First, try Gemini if the key is available
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });

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

        const translation = response.text?.trim();
        if (translation) {
          return res.json({ translation, provider: "gemini" });
        }
      } catch (geminiError: any) {
        console.error("Erro na tradução com Gemini, tentando fallback MyMemory:", geminiError);
      }
    } else {
      console.warn("GEMINI_API_KEY não configurada. Usando fallback de tradução MyMemory.");
    }

    // Fallback: Translate using the free MyMemory Translation API
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=zh-CN|pt-BR`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`MyMemory API error: ${response.statusText}`);
      }
      const data = await response.json();
      const translation = data?.responseData?.translatedText;
      
      if (translation) {
        // Clean up translation if it has HTML entities or remains unchanged
        const decodedTranslation = translation
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&amp;/g, "&")
          .trim();

        return res.json({ translation: decodedTranslation, provider: "mymemory" });
      }
      throw new Error("Resposta de tradução vazia do MyMemory");
    } catch (fallbackError: any) {
      console.error("Erro no fallback de tradução MyMemory:", fallbackError);
      return res.status(500).json({ 
        error: "Não foi possível obter a tradução automática por nenhum serviço.", 
        literalTranslation: wordsInfo.map((w: any) => w.translationLiteral).join(' ')
      });
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
