// Servidor HTTP
import express from "express";
const app = express();

// Redis client
import { createClient } from "redis";
const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

// Usar variáveis de ambiente - contêm configurações e/ou passwords
import { configDotenv } from "dotenv";
configDotenv();
const PORT = process.env.PORT || 3000;

// Utilização do Helmet para algumas medidas de segurança
import helmet from "helmet";
app.use(helmet());

// Aceitar texto para a rota /copy
app.use(express.text());

const clean = (raw) => {
  // Step 1: Strip wrapping quotes
  let cleaned = raw.trim().replace(/^"|"$/g, "");

  // Step 2: Unescape the escaped quotes
  cleaned = cleaned.replace(/\\"/g, '"');

  // Step 3: Remove literal \n and extra whitespace
  cleaned = cleaned.replace(/\\n/g, " ").replace(/\s+/g, " ").trim();

  return cleaned;
};

let content = {
  a3175b39145aabc: {
    createdAt: new Date("2026-03-17 21:14"),
    value: "Este é o valor do diogo",
  },
};

app.get("/", (req, res) => {
  res.send("Página Home.");
});

app.get("/get-all-contents", (req, res) => {
  res.json(content);
});

app.post("/copy", (req, res) => {
  // Se o jwt existir e houver body, substituir o content
  if (!req.body) {
    res.status(400).send("No content in body.");
  } else {
    const newId = crypto.randomUUID();

    content[newId] = {
      createdAt: new Date(),
      value: req.body,
    };
    res.send(newId);
  }
});

app.get("/:id", (req, res) => {
  const id = req.params.id;

  if (!content[id]) {
    res.status(404).send("404");
  } else {
    const result = clean(content[id].value);
    res.send(result);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
