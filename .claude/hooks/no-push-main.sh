#!/usr/bin/env bash
# PreToolUse (Bash): bloquea cualquier push a main o master.
# Claude Code envía la llamada en JSON por stdin; salir con código 2 la bloquea
# y le devuelve a Claude el mensaje de stderr.
input=$(cat)
if printf '%s' "$input" | grep -Eq 'git[^"]*push[^"]*\b(main|master)\b'; then
  echo "No se hace push a main. Abre un PR desde una rama." >&2
  exit 2
fi
exit 0
