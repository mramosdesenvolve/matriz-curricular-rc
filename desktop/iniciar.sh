#!/bin/bash
# Inicia o servidor local da Matriz Curricular (se ainda não estiver rodando) e abre no navegador.
# Chamado pelo app "Matriz Curricular.app" na área de trabalho — não precisa rodar isso na mão.

# Quando aberto por clique duplo (Finder/AppleScript), o PATH não inclui a pasta
# do Node — sem isso, o próprio binário do Next falha ao tentar achar "node".
export PATH="/Users/macmr/local/node/bin:$PATH"

PROJECT_DIR="/Users/macmr/Desktop/Claude_Matriz_template"
PORT=4479
URL="http://localhost:$PORT"
LOG_FILE="$PROJECT_DIR/desktop/.servidor.log"
PID_FILE="$PROJECT_DIR/desktop/.servidor.pid"
NPM_BIN="/Users/macmr/local/node/bin/npm"
NEXT_BIN="$PROJECT_DIR/node_modules/.bin/next"

cd "$PROJECT_DIR" || exit 1

# Se já existe um processo vivo respondendo nessa porta, só reabre o navegador.
if curl -s -o /dev/null "$URL"; then
  open "$URL"
  exit 0
fi

# Limpeza defensiva: o Next.js (Turbopack) mantém um daemon persistente que às
# vezes sobrevive a um fechamento abrupto (Mac dormiu, app forçado a fechar etc.),
# deixando um lock/trava que impede um novo servidor de subir nessa porta.
# Como ninguém respondeu na porta acima, qualquer processo assim é lixo — mata.
pkill -f "$PROJECT_DIR/node_modules/.bin/next" 2>/dev/null
pkill -f "$PROJECT_DIR/.next" 2>/dev/null
rm -f "$PROJECT_DIR/.next/dev/lock"
sleep 1

# Primeira vez após restaurar de um backup: instala dependências se faltarem.
if [ ! -d node_modules ]; then
  "$NPM_BIN" install >> "$LOG_FILE" 2>&1
fi

# Sobe o servidor direto pelo binário do Next (evita a camada extra do npm),
# desacoplado deste script para continuar rodando depois que ele terminar.
nohup "$NEXT_BIN" dev -p "$PORT" >> "$LOG_FILE" 2>&1 &
SERVER_PID=$!
echo "$SERVER_PID" > "$PID_FILE"

# Espera o servidor responder antes de abrir o navegador (até ~40s),
# mas para de esperar na hora se o processo morrer antes disso.
for _ in $(seq 1 40); do
  if curl -s -o /dev/null "$URL"; then
    break
  fi
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    break
  fi
  sleep 1
done

open "$URL"
