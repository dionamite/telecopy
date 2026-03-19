// Servidor HTTP
import express from "express";
const app = express();

import { clean, createHashId } from "./services/cryptoService.js";
import { redisClient } from "./database/redis.js";

// Usar variáveis de ambiente - contêm configurações e/ou passwords
import { configDotenv } from "dotenv";
configDotenv();
const PORT = process.env.PORT || 3000;

// Utilização do Helmet para algumas medidas de segurança
import helmet from "helmet";
app.use(helmet());

// Aceitar texto para a rota /copy
app.use(express.text());

app.get("/", (req, res) => {
  res.send("Página Home.");
});

app.get("/get-all-contents", (req, res) => {
  res.json(content);
});

app.post("/copy", async (req, res) => {
  // Se o jwt existir e houver body, substituir o content
  if (!req.body) {
    res.status(400).send("No content in body.");
  } else {
    const newId = createHashId();

    const value = {
      createdAt: new Date(),
      value: req.body,
    };

    // Salva o content no Redis
    await redisClient.saveContent(newId, JSON.stringify(value));

    // Retorna o ID
    res.send(newId);
  }
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;

  // Obtem o content com o ID
  const content = await redisClient.getContent(id);

  if (!content) {
    res.status(404).send("404");
  } else {
    const contentDict = JSON.parse(content);
    const result = clean(contentDict.value);
    res.send(result);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
