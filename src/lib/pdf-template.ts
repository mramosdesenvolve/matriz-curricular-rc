import fs from "node:fs";
import path from "node:path";
import { ANOS, BIMESTRES, HABILITACOES, areaOf, getComponente, nomeFase, type ComponenteDef } from "@/lib/domain";
import { getDetalhamento, type CardVM, type PlanejamentoVM, type SaberVM, type SemanaVM, type DetalhamentoVM } from "@/lib/cards-data";

const LOGO_PATH = path.join(process.cwd(), "public", "logo-rede-cruzada.png");
const LOGO_BASE64 = fs.existsSync(LOGO_PATH) ? fs.readFileSync(LOGO_PATH).toString("base64") : null;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type MetaValidacao = { validado: boolean; validadoEm: string | null; validadoPor: string | null };

function blocoPlanejamento(planejamento?: PlanejamentoVM) {
  if (!planejamento) return "";
  const linhas: string[] = [];
  if (planejamento.temposAula !== null) linhas.push(`<b>Tempos de aula:</b> ${planejamento.temposAula}`);
  if (planejamento.atividades) linhas.push(`<b>Atividades/metodologia:</b> ${escapeHtml(planejamento.atividades)}`);
  if (planejamento.projetos) linhas.push(`<b>Projetos previstos:</b> ${escapeHtml(planejamento.projetos)}`);
  if (planejamento.avaliacao) linhas.push(`<b>Avaliação:</b> ${escapeHtml(planejamento.avaliacao)}`);
  if (linhas.length === 0) return "";
  return `<div class="planejamento-box">${linhas.map((l) => `<div class="meta-line">${l}</div>`).join("")}</div>`;
}

function blocoComponente(
  componente: ComponenteDef,
  ano: number,
  cards: CardVM[],
  meta: MetaValidacao,
  planejamentos?: Map<string, PlanejamentoVM>,
  mostrarTitulo = true,
  mostrarArea = true
) {
  const areaNome = areaOf(componente.id)?.nome;
  const statusTag = meta.validado
    ? `<span class="status-tag">Validado${meta.validadoEm ? " em " + meta.validadoEm : ""}${meta.validadoPor ? " · " + escapeHtml(meta.validadoPor) : ""}</span>`
    : "";
  const subLinha = mostrarArea ? `${escapeHtml(areaNome ?? "")} · ${ANOS[ano]}` : ANOS[ano];
  let html = `<div class="componente-block">
    ${mostrarTitulo ? `<h2>${escapeHtml(componente.nome)} ${statusTag}</h2>` : `<div class="doc-sub" style="margin-bottom:2px;">${statusTag}</div>`}
    <div class="doc-sub">${subLinha}</div>`;

  for (const b of BIMESTRES) {
    const doBimestre = cards.filter((c) => c.bimestre === b).sort((a, c) => a.ordem - c.ordem);
    html += `<div class="bimestre-block"><h3>Fase ${b} · ${nomeFase(b)}</h3>`;
    html += blocoPlanejamento(planejamentos?.get(`${componente.id}:${b}`));
    if (doBimestre.length === 0) {
      html += `<div class="item" style="color:#8B8E9A;">Nenhum conteúdo cadastrado.</div>`;
    } else {
      for (const c of doBimestre) {
        const prereq = c.prerequisitos.map((p) => `${p.titulo} (${getComponente(p.componenteId)?.nome})`).join("; ");
        const integ = c.integracoes.map((p) => `${p.titulo} (${getComponente(p.componenteId)?.nome})`).join("; ");
        const competencias = c.competencias.map((comp) => `${comp.id}: ${comp.descricao}`).join(" | ");
        const habilidades = c.habilidades.map((h) => `${h.id}: ${h.descricao}`).join(" | ");
        html += `<div class="item">
          <div class="t">${escapeHtml(c.titulo)}</div>
          ${c.descricao ? `<div class="d">${escapeHtml(c.descricao)}</div>` : ""}
          ${competencias ? `<div class="meta-line"><b>Competências:</b> ${escapeHtml(competencias)}</div>` : ""}
          ${habilidades ? `<div class="meta-line"><b>Habilidades:</b> ${escapeHtml(habilidades)}</div>` : ""}
          ${prereq ? `<div class="meta-line"><b>Pré-requisitos:</b> ${escapeHtml(prereq)}</div>` : ""}
          ${integ ? `<div class="meta-line"><b>Integrações:</b> ${escapeHtml(integ)}</div>` : ""}
        </div>`;
      }
    }
    html += `</div>`;
  }
  html += `</div>`;
  return html;
}

function blocoSaber(saber: SaberVM) {
  const prereq = saber.prerequisitos.map((p) => `${p.titulo} (${getComponente(p.componenteId)?.nome})`).join("; ");
  const integ = saber.integracoes.map((p) => `${p.titulo} (${getComponente(p.componenteId)?.nome})`).join("; ");
  const competencias = saber.competencias.map((c) => `${c.id}: ${c.descricao}`).join(" | ");
  const habilidades = saber.habilidades.map((h) => `${h.id}: ${h.descricao}`).join(" | ");
  const temas = saber.temas.join(", ");
  const habilitacaoNome = saber.habilitacao ? HABILITACOES.find((h) => h.id === saber.habilitacao)?.nome : null;

  return `<div class="item">
    <div class="t">${escapeHtml(saber.titulo)}</div>
    ${saber.descricao ? `<div class="d">${escapeHtml(saber.descricao)}</div>` : ""}
    ${competencias ? `<div class="meta-line"><b>Competências:</b> ${escapeHtml(competencias)}</div>` : ""}
    ${habilidades ? `<div class="meta-line"><b>Habilidades:</b> ${escapeHtml(habilidades)}</div>` : ""}
    ${temas ? `<div class="meta-line"><b>Temas:</b> ${escapeHtml(temas)}</div>` : ""}
    ${habilitacaoNome ? `<div class="meta-line"><b>Habilitação vinculada:</b> ${escapeHtml(habilitacaoNome)}</div>` : ""}
    ${prereq ? `<div class="meta-line"><b>Pré-requisitos:</b> ${escapeHtml(prereq)}</div>` : ""}
    ${integ ? `<div class="meta-line"><b>Integrações:</b> ${escapeHtml(integ)}</div>` : ""}
  </div>`;
}

function cabecalho(tituloDoc: string) {
  const marca = LOGO_BASE64
    ? `<img class="mark" src="data:image/png;base64,${LOGO_BASE64}" alt="Logo">`
    : `<div class="mark-text">Matriz Curricular</div>`;
  return `<div class="doc-head">
    <div>${marca}</div>
    <div class="meta">Gerado em ${new Date().toLocaleDateString("pt-BR")}</div>
  </div>
  <h1 class="doc-title">${escapeHtml(tituloDoc)}</h1>`;
}

const ESTILO = `
  @page{ margin:16mm; }
  *{box-sizing:border-box;}
  body{font-family:'Inter',Arial,sans-serif;color:#1E2130;font-size:12.5px;line-height:1.5;margin:0;padding:0;}
  h1,h2,h3{font-family:'Poppins',sans-serif;margin:0;}
  .doc-head{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #1B2E73;padding-bottom:12px;margin-bottom:20px;}
  .doc-head .mark{height:26px;width:auto;display:block;}
  .doc-head .mark-text{font-family:'Poppins',sans-serif;font-weight:700;font-size:15px;color:#1B2E73;}
  .doc-head .meta{text-align:right;font-size:11px;color:#5B5F6E;}
  h1.doc-title{font-size:20px;margin-bottom:2px;}
  .doc-sub{color:#5B5F6E;font-size:12px;margin-bottom:18px;}
  .bimestre-block{margin-bottom:18px;page-break-inside:avoid;}
  .bimestre-block h3{font-size:14px;background:#EEECE5;padding:6px 10px;border-radius:6px;margin-bottom:8px;}
  .item{padding:8px 4px 10px 4px;border-bottom:1px solid #DBD8CE;}
  .item:last-child{border-bottom:none;}
  .item .t{font-weight:700;font-size:13px;}
  .item .d{color:#333;margin-top:2px;}
  .item .meta-line{color:#5B5F6E;font-size:11px;margin-top:4px;}
  .componente-block{margin-bottom:30px;page-break-before:auto;}
  .componente-block + .componente-block{page-break-before:always;}
  .status-tag{display:inline-block;font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:100px;background:#E1F0E9;color:#3F8F6B;margin-left:8px;}
  .planejamento-box{background:#F7F6F2;border:1px solid #DBD8CE;border-radius:6px;padding:8px 10px;margin-bottom:10px;}
  .planejamento-box .meta-line{color:#333;font-size:11px;margin-top:3px;}
  .planejamento-box .meta-line:first-child{margin-top:0;}
  .area-block{margin-bottom:24px;page-break-before:auto;}
  .area-block.quebra{page-break-before:always;}
  .area-block h2{font-size:18px;color:#1B2E73;border-bottom:2px solid #1B2E73;padding-bottom:6px;margin-bottom:14px;}
  .componente-sub-block{margin-bottom:20px;page-break-inside:avoid;}
  .componente-heading{font-size:14px;background:#EEECE5;padding:6px 10px;border-radius:6px;margin-bottom:8px;}
  .fase-semanal-block{margin-bottom:26px;page-break-inside:avoid;}
  .fase-semanal-block h2{font-size:16px;color:#1B2E73;border-bottom:2px solid #1B2E73;padding-bottom:6px;margin-bottom:10px;}
  .fase-semanal-block + .fase-semanal-block{page-break-before:always;}
  table.grade-semanal{width:100%;border-collapse:collapse;table-layout:fixed;}
  table.grade-semanal th,table.grade-semanal td{border:1px solid #DBD8CE;padding:6px 8px;vertical-align:top;text-align:left;}
  table.grade-semanal th{background:#EEECE5;font-size:10.5px;text-transform:uppercase;letter-spacing:.02em;color:#5B5F6E;}
  table.grade-semanal .sem-label{font-weight:700;font-size:11.5px;white-space:nowrap;width:70px;}
  table.grade-semanal .saber-chip{font-size:11px;font-weight:600;padding:3px 0;border-bottom:1px dashed #DBD8CE;}
  table.grade-semanal .saber-chip:last-of-type{border-bottom:none;}
  table.grade-semanal .vazio{font-size:10.5px;color:#8B8E9A;}
  table.grade-semanal .detalhamento-txt{margin-top:5px;font-size:10px;color:#5B5F6E;white-space:pre-wrap;}
`;

function documento(titulo: string, corpo: string) {
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>${escapeHtml(titulo)}</title>
    <style>${ESTILO}</style>
    </head><body>${corpo}</body></html>`;
}

export function htmlComponente(
  componente: ComponenteDef,
  ano: number,
  cards: CardVM[],
  meta: MetaValidacao,
  planejamentos?: Map<string, PlanejamentoVM>
) {
  const corpo =
    cabecalho(`Mapa por Fases — ${componente.nome}`) +
    blocoComponente(componente, ano, cards, meta, planejamentos, false);
  return documento(`Matriz Curricular — ${componente.nome}`, corpo);
}

export function htmlArea(
  areaNome: string,
  componentes: ComponenteDef[],
  ano: number,
  cardsPorComponente: Map<string, CardVM[]>,
  metaPorComponente: Map<string, MetaValidacao>,
  planejamentos?: Map<string, PlanejamentoVM>
) {
  const corpo =
    cabecalho(`Mapa por Fases — ${areaNome}`) +
    componentes
      .map((c) =>
        blocoComponente(
          c,
          ano,
          cardsPorComponente.get(c.id) ?? [],
          metaPorComponente.get(c.id) ?? { validado: false, validadoEm: null, validadoPor: null },
          planejamentos,
          true,
          false
        )
      )
      .join("");
  return documento(`Matriz Curricular — ${areaNome}`, corpo);
}

export function htmlMatrizCurricular(
  ano: number,
  areas: { id: string; nome: string; componentes: ComponenteDef[] }[],
  saberesPorComponente: Map<string, SaberVM[]>
) {
  const corpo =
    cabecalho(`Matriz Curricular — ${ANOS[ano]}`) +
    areas
      .map(
        (area, i) => `<div class="area-block${i > 0 ? " quebra" : ""}">
          <h2>${escapeHtml(area.nome)}</h2>
          ${area.componentes
            .map((componente) => {
              const saberes = saberesPorComponente.get(componente.id) ?? [];
              return `<div class="componente-sub-block">
                <div class="componente-heading">${escapeHtml(componente.nome)}</div>
                ${
                  saberes.length === 0
                    ? `<div class="item" style="color:#8B8E9A;">Nenhum saber cadastrado.</div>`
                    : saberes.map(blocoSaber).join("")
                }
              </div>`;
            })
            .join("")}
        </div>`
      )
      .join("");
  return documento(`Matriz Curricular ${ANOS[ano]}`, corpo);
}

function linhaSemana(
  semana: SemanaVM,
  componentes: ComponenteDef[],
  cardsPorComponente: Map<string, CardVM[]>,
  detalhamentos: Map<string, DetalhamentoVM>
) {
  const celulas = componentes
    .map((c) => {
      const cards = (cardsPorComponente.get(c.id) ?? [])
        .filter((card) => card.semanaId === semana.id)
        .sort((a, b) => a.ordem - b.ordem);
      const det = getDetalhamento(detalhamentos, c.id, semana.id);
      const chips =
        cards.length === 0
          ? `<div class="vazio">Nenhum saber posicionado.</div>`
          : cards.map((card) => `<div class="saber-chip">${escapeHtml(card.titulo)}</div>`).join("");
      const detalhamento = det.texto
        ? `<div class="detalhamento-txt"><b>Detalhamento:</b> ${escapeHtml(det.texto)}</div>`
        : "";
      return `<td>${chips}${detalhamento}</td>`;
    })
    .join("");
  return `<tr><td class="sem-label">Semana ${semana.ordem}</td>${celulas}</tr>`;
}

function tabelaSemanas(
  semanas: SemanaVM[],
  componentes: ComponenteDef[],
  cardsPorComponente: Map<string, CardVM[]>,
  detalhamentos: Map<string, DetalhamentoVM>
) {
  if (semanas.length === 0) {
    return `<div class="item" style="color:#8B8E9A;">Nenhuma semana criada nesta fase.</div>`;
  }
  return `<table class="grade-semanal">
    <thead><tr><th>Semana</th>${componentes.map((c) => `<th>${escapeHtml(c.nome)}</th>`).join("")}</tr></thead>
    <tbody>${semanas.map((s) => linhaSemana(s, componentes, cardsPorComponente, detalhamentos)).join("")}</tbody>
  </table>`;
}

export function htmlGradeSemanalSemana(
  areaNome: string,
  faseNumero: number,
  semana: SemanaVM,
  componentes: ComponenteDef[],
  cardsPorComponente: Map<string, CardVM[]>,
  detalhamentos: Map<string, DetalhamentoVM>
) {
  const corpo =
    cabecalho(`Grade Semanal — ${areaNome}`) +
    `<div class="doc-sub">Fase ${faseNumero} · ${nomeFase(faseNumero)} · Semana ${semana.ordem}</div>` +
    tabelaSemanas([semana], componentes, cardsPorComponente, detalhamentos);
  return documento(`Grade Semanal — Semana ${semana.ordem} — ${areaNome}`, corpo);
}

export function htmlGradeSemanalFase(
  areaNome: string,
  faseNumero: number,
  semanas: SemanaVM[],
  componentes: ComponenteDef[],
  cardsPorComponente: Map<string, CardVM[]>,
  detalhamentos: Map<string, DetalhamentoVM>
) {
  const corpo =
    cabecalho(`Grade Semanal — ${areaNome}`) +
    `<div class="doc-sub">Fase ${faseNumero} · ${nomeFase(faseNumero)}</div>` +
    tabelaSemanas(semanas, componentes, cardsPorComponente, detalhamentos);
  return documento(`Grade Semanal — Fase ${faseNumero} — ${areaNome}`, corpo);
}

export function htmlGradeSemanalCompleta(
  areaNome: string,
  fases: { numero: number; nome: string; semanas: SemanaVM[] }[],
  componentes: ComponenteDef[],
  cardsPorComponente: Map<string, CardVM[]>,
  detalhamentos: Map<string, DetalhamentoVM>
) {
  const corpo =
    cabecalho(`Grade Semanal — ${areaNome}`) +
    fases
      .map(
        (fase) => `<div class="fase-semanal-block">
          <h2>Fase ${fase.numero} · ${escapeHtml(fase.nome)}</h2>
          ${tabelaSemanas(fase.semanas, componentes, cardsPorComponente, detalhamentos)}
        </div>`
      )
      .join("");
  return documento(`Grade Semanal — ${areaNome}`, corpo);
}
