require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Valida e limpa o corpo da requisição
function validar(body) {
  const nome = String(body.nome || "").trim();
  const categoria = String(body.categoria || "").trim();
  const preco = Number(body.preco);
  const quantidade = Number(body.quantidade);

  if (!nome) return { erro: "O nome é obrigatório." };
  if (!Number.isFinite(preco) || preco < 0) return { erro: "Preço inválido." };
  if (!Number.isInteger(quantidade) || quantidade < 0) return { erro: "Quantidade inválida." };

  return { dados: { nome, categoria, preco, quantidade } };
}

// Rota de teste
app.get("/", (req, res) => res.json({ mensagem: "API EstoqueFacil no ar" }));

// READ: listar todos
app.get("/produtos", async (req, res) => {
  const { data, error } = await supabase
    .from("produtos")
    .select("*")
    .order("id", { ascending: true });
  if (error) return res.status(500).json({ erro: error.message });
  res.json(data);
});

// READ: buscar um
app.get("/produtos/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("produtos")
    .select("*")
    .eq("id", req.params.id)
    .maybeSingle();
  if (error) return res.status(500).json({ erro: error.message });
  if (!data) return res.status(404).json({ erro: "Produto não encontrado." });
  res.json(data);
});

// CREATE
app.post("/produtos", async (req, res) => {
  const { dados, erro } = validar(req.body);
  if (erro) return res.status(400).json({ erro });

  const { data, error } = await supabase.from("produtos").insert(dados).select().single();
  if (error) return res.status(500).json({ erro: error.message });
  res.status(201).json(data);
});

// UPDATE
app.put("/produtos/:id", async (req, res) => {
  const { dados, erro } = validar(req.body);
  if (erro) return res.status(400).json({ erro });

  const { data, error } = await supabase
    .from("produtos")
    .update(dados)
    .eq("id", req.params.id)
    .select()
    .maybeSingle();
  if (error) return res.status(500).json({ erro: error.message });
  if (!data) return res.status(404).json({ erro: "Produto não encontrado." });
  res.json(data);
});

// DELETE
app.delete("/produtos/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("produtos")
    .delete()
    .eq("id", req.params.id)
    .select()
    .maybeSingle();
  if (error) return res.status(500).json({ erro: error.message });
  if (!data) return res.status(404).json({ erro: "Produto não encontrado." });
  res.json({ mensagem: "Produto excluído." });
});

// Local: roda com app.listen. Na Vercel: só exporta o app.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Servidor em http://localhost:${PORT}`));
}

module.exports = app;
