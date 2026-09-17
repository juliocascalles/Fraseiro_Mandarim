import express from "express";
import http from "http";
import path from "path";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

interface ServerChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  avatar: string;
  roomId: string;
  timestamp: string;
  phrase: {
    hanzi: string;
    pinyin: string;
    portuguese: string;
    words?: any[];
    isValidGrammar: boolean;
    grammarNotes?: string;
  };
  textMessage?: string;
  likes?: number;
}

// In-memory store for chat messages
const chatMessages: ServerChatMessage[] = [
  {
    id: 'seed-1',
    senderId: 'user-liwei',
    senderName: 'Li Wei (李伟)',
    avatar: '🐼',
    roomId: 'global',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    phrase: {
      hanzi: '你好！欢迎来到中文交流群！',
      pinyin: 'Nǐ hǎo! Huānyíng lái dào zhōngwén jiāoliú qún!',
      portuguese: 'Olá! Bem-vindos ao grupo de conversa em chinês!',
      isValidGrammar: true,
      grammarNotes: 'Saudação clássica e acolhimento em comunidade.'
    },
    textMessage: 'Que frase você construiu hoje no app? Mande aqui para praticarmos juntos!',
    likes: 4
  },
  {
    id: 'seed-2',
    senderId: 'user-julio',
    senderName: 'Julio (胡里奥)',
    avatar: '🐉',
    roomId: 'global',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    phrase: {
      hanzi: '我是巴西人，我很喜欢喝中国茶。',
      pinyin: 'wǒ shì bāxī rén, wǒ hěn xǐhuan hē zhōngguó chá.',
      portuguese: 'Eu sou brasileiro, gosto muito de tomar chá chinês.',
      isValidGrammar: true,
      grammarNotes: 'Sujeito + Verbo Ser + Objeto; depois Sujeito + Advérbio (hěn) + Verbo + Objeto.'
    },
    likes: 6
  },
  {
    id: 'seed-3',
    senderId: 'user-meiling',
    senderName: 'Mei Ling (美玲)',
    avatar: '🦩',
    roomId: 'global',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    phrase: {
      hanzi: '今天天气很好，你想去超市吗？',
      pinyin: 'jīntiān tiānqì hěn hǎo, nǐ xiǎng qù chāoshì ma?',
      portuguese: 'Hoje o tempo está muito bom, você quer ir ao supermercado?',
      isValidGrammar: true,
      grammarNotes: 'Tempo no início + Pergunta interrogativa sim/não com ma (吗).'
    },
    likes: 2
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;
  const server = http.createServer(app);

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // WebSocket Server for Real-Time Bate-papo
  const wss = new WebSocketServer({ server, path: "/ws/chat" });

  const broadcastMessage = (data: any) => {
    const payload = JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(payload);
        } catch (err) {
          console.error("Erro ao enviar payload WebSocket:", err);
        }
      }
    });
  };

  wss.on("connection", (ws: WebSocket) => {
    // Send initial history and online count
    ws.send(JSON.stringify({
      type: "init",
      messages: chatMessages,
      onlineCount: wss.clients.size
    }));

    // Broadcast updated online count
    broadcastMessage({
      type: "presence",
      onlineCount: wss.clients.size
    });

    ws.on("message", (raw) => {
      try {
        const data = JSON.parse(raw.toString());

        if (data.type === "send_message") {
          const newMsg: ServerChatMessage = {
            id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            senderId: data.senderId || 'anon',
            senderName: data.senderName || 'Estudante',
            avatar: data.avatar || '🐼',
            roomId: data.roomId || 'global',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            phrase: data.phrase,
            textMessage: data.textMessage || '',
            likes: 0
          };

          chatMessages.push(newMsg);
          if (chatMessages.length > 200) {
            chatMessages.shift();
          }

          broadcastMessage({
            type: "new_message",
            message: newMsg
          });
        } else if (data.type === "like_message") {
          const msg = chatMessages.find(m => m.id === data.messageId);
          if (msg) {
            msg.likes = (msg.likes || 0) + 1;
            broadcastMessage({
              type: "message_liked",
              messageId: msg.id,
              likes: msg.likes
            });
          }
        }
      } catch (err) {
        console.error("Erro ao processar mensagem do WebSocket:", err);
      }
    });

    ws.on("close", () => {
      broadcastMessage({
        type: "presence",
        onlineCount: wss.clients.size
      });
    });
  });

  // REST API Endpoints for Chat (Fallback and state retrieval)
  app.get("/api/chat/messages", (req, res) => {
    const roomId = (req.query.roomId as string) || "global";
    const filtered = chatMessages.filter(m => m.roomId === roomId || roomId === 'global');
    res.json({
      messages: filtered,
      onlineCount: Math.max(1, wss.clients.size)
    });
  });

  app.post("/api/chat/send", (req, res) => {
    const { senderId, senderName, avatar, roomId, phrase, textMessage } = req.body;

    if (!phrase || !phrase.hanzi) {
      return res.status(400).json({ error: "Frase inválida para envio" });
    }

    const newMsg: ServerChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      senderId: senderId || 'anon',
      senderName: senderName || 'Estudante',
      avatar: avatar || '🐼',
      roomId: roomId || 'global',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      phrase,
      textMessage: textMessage || '',
      likes: 0
    };

    chatMessages.push(newMsg);
    if (chatMessages.length > 200) {
      chatMessages.shift();
    }

    // Broadcast to WebSocket clients
    broadcastMessage({
      type: "new_message",
      message: newMsg
    });

    res.json({ success: true, message: newMsg });
  });

  app.post("/api/chat/like", (req, res) => {
    const { messageId } = req.body;
    const msg = chatMessages.find(m => m.id === messageId);
    if (!msg) {
      return res.status(404).json({ error: "Mensagem não encontrada" });
    }

    msg.likes = (msg.likes || 0) + 1;
    broadcastMessage({
      type: "message_liked",
      messageId: msg.id,
      likes: msg.likes
    });

    res.json({ success: true, likes: msg.likes });
  });

  // API Route for Mandarin Audio Speech-to-Text & Pronunciation Analysis with Gemini
  app.post("/api/transcribe-audio", async (req, res) => {
    const { audioBase64, mimeType, targetPhrase } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: "Nenhum dado de áudio fornecido" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ 
        error: "GEMINI_API_KEY não configurada no servidor. Por favor, forneça a chave de API nas configurações." 
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Strip any data:audio/...;base64, prefix if present
      const cleanBase64 = audioBase64.replace(/^data:audio\/[^;]+;base64,/, '');

      const prompt = `Você é um avaliador de pronúncia e transcritor profissional de Mandarim (Standard Mandarin Chinese / 普通话).
Ouça atentamente este áudio gravado por um estudante de chinês.
${targetPhrase ? `A frase alvo que o estudante estava tentando pronunciar é: "${targetPhrase}".` : 'O estudante está falando livremente em mandarim.'}

Tarefas:
1. Transcreva com fidelidade o que foi falado em caracteres chineses (Hanzi simplificado).
2. Forneça o pinyin completo com marcações tonais corretas (ex: mā, má, mǎ, mà).
3. Traduza a fala em português do Brasil de forma natural.
4. Avalie a precisão da pronúncia (0 a 100), levando em consideração clareza, sandhi tonal e articulação.
5. Escreva um feedback curto (1 a 2 frases) em português, encorajador e específico sobre os tons ou fonética percebidos.

Retorne EXCLUSIVAMENTE um objeto JSON válido no formato abaixo, sem formatação Markdown e sem blocos de código:
{
  "transcript": "caracteres chineses reconhecidos",
  "pinyin": "pinyin com acentos tonais",
  "portuguese": "tradução em português",
  "confidence": 0.95,
  "accuracyScore": 90,
  "feedback": "Excelente articulação de nǐ hǎo com o terceiro tom suavizado."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || 'audio/webm',
                  data: cleanBase64
                }
              },
              {
                text: prompt
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text?.trim();
      if (!responseText) {
        throw new Error("Resposta vazia recebida do modelo de IA");
      }

      let parsedResult;
      try {
        parsedResult = JSON.parse(responseText);
      } catch (jsonErr) {
        // Fallback cleanup if the model included formatting
        const cleaned = responseText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
        parsedResult = JSON.parse(cleaned);
      }

      return res.json({
        success: true,
        transcript: parsedResult.transcript || "",
        pinyin: parsedResult.pinyin || "",
        portuguese: parsedResult.portuguese || "",
        accuracyScore: typeof parsedResult.accuracyScore === 'number' ? parsedResult.accuracyScore : 85,
        confidence: parsedResult.confidence || 0.9,
        feedback: parsedResult.feedback || "Pronúncia processada com sucesso!"
      });

    } catch (err: any) {
      console.error("Erro ao transcrever áudio com Gemini:", err);
      return res.status(500).json({ 
        error: "Falha ao processar o áudio com o serviço de reconhecimento.",
        details: err?.message || String(err)
      });
    }
  });

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
          model: "gemini-3.8-flash",
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

  // API Route for AI Dialogue simulation
  app.post("/api/dialogue", async (req, res) => {
    const { 
      scenarioTitle, 
      characterName, 
      characterRole, 
      history, 
      userMessageHanzi,
      userMessagePinyin,
      stepGoal 
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
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

        const prompt = `Você é um interlocutor chinês nativo simulando uma conversa educativa para um estudante brasileiro aprendendo Mandarim (nível HSK 1 a HSK 2).
Personagem: ${characterName || 'Amigo Chinês'} (${characterRole || 'Interlocutor'})
Cenário atual: ${scenarioTitle || 'Conversa do dia a dia'}
Missão/Objetivo da etapa atual: ${stepGoal || 'Conversar naturalmente'}

Histórico da conversa até agora:
${JSON.stringify(history || [], null, 2)}

Mensagem dita pelo aluno:
Hanzi: ${userMessageHanzi}
Pinyin: ${userMessagePinyin || ''}

Instruções:
1. Responda em Mandarim como seu personagem de forma amigável, natural e adequada ao nível HSK 1-2.
2. Forneça o texto da resposta em Hanzi (chinês simplificado).
3. Forneça o Pinyin completo com marcas de tom.
4. Forneça a tradução da sua resposta para o Português do Brasil.
5. Dê um breve feedback gramatical ou elogio educado em português (1 frase) sobre a frase do aluno (se o mandarim dele foi bem estruturado, ou se tem alguma pequena sugestão).
6. Avalie se o objetivo da etapa atual foi atendido ("isGoalAchieved": true/false).

Retorne EXCLUSIVAMENTE um objeto JSON válido (sem tags markdown, sem crases extras), com as chaves:
{
  "replyHanzi": "...",
  "replyPinyin": "...",
  "replyPortuguese": "...",
  "feedback": "...",
  "isGoalAchieved": true
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
        });

        let responseText = response.text?.trim() || "";
        if (responseText.startsWith("```json")) {
          responseText = responseText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        } else if (responseText.startsWith("```")) {
          responseText = responseText.replace(/^```\s*/, "").replace(/\s*```$/, "");
        }

        try {
          const parsed = JSON.parse(responseText);
          return res.json({
            provider: "gemini",
            replyHanzi: parsed.replyHanzi,
            replyPinyin: parsed.replyPinyin,
            replyPortuguese: parsed.replyPortuguese,
            feedback: parsed.feedback,
            isGoalAchieved: parsed.isGoalAchieved ?? true
          });
        } catch (parseErr) {
          console.error("Falha ao analisar JSON do Gemini:", responseText);
        }
      } catch (err: any) {
        console.error("Erro na chamada do Gemini Dialogue:", err);
      }
    }

    // Fallback: Structured response if API key is not configured or fails
    return res.json({
      provider: "local",
      replyHanzi: "很好！我明白了，我们继续聊吧！",
      replyPinyin: "Hěn hǎo! Wǒ míngbai le, wǒmen jìxù liáo ba!",
      replyPortuguese: "Muito bem! Eu entendi, vamos continuar conversando!",
      feedback: "Frase compreensível e bem comunicada!",
      isGoalAchieved: true
    });
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

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
