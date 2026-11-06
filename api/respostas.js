import { neon } from "@neondatabase/serverless";
import { timingSafeEqual } from "node:crypto";

const TIPOS_PERMITIDOS = new Set(["mensagem", "quiz", "dia", "passeio", "encontro"]);
const TAMANHO_MAXIMO = 200;

const sql = neon(process.env.DATABASE_URL);

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

function senhaValida(recebida) {
  const esperada = process.env.ADMIN_PASSWORD;
  if (!esperada || !recebida) return false;
  const a = Buffer.from(String(recebida));
  const b = Buffer.from(esperada);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request) {
  let dados;
  try {
    dados = await request.json();
  } catch {
    return json({ erro: "JSON inválido" }, 400);
  }

  const tipo = typeof dados?.tipo === "string" ? dados.tipo : "";
  const resposta = typeof dados?.resposta === "string" ? dados.resposta.trim() : "";

  if (!TIPOS_PERMITIDOS.has(tipo) || !resposta || resposta.length > TAMANHO_MAXIMO) {
    return json({ erro: "Dados inválidos" }, 400);
  }

  await sql`INSERT INTO respostas (tipo, resposta) VALUES (${tipo}, ${resposta})`;
  return json({ ok: true }, 201);
}

export async function GET(request) {
  if (!senhaValida(request.headers.get("x-admin-password"))) {
    return json({ erro: "Não autorizado" }, 401);
  }

  const linhas = await sql`
    SELECT id, tipo, resposta, criado_em
    FROM respostas
    ORDER BY criado_em DESC
    LIMIT 500
  `;
  return json({ respostas: linhas });
}
