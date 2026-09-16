#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────
# SeoMarket — публикация готового сайта на поддомен по SSH.
#
# Заливает папку с оптимизированным клоном на хостинг партиями.
# Партиями — потому что разовый rsync на несколько гигабайт хостеры
# принимают за флуд и банят IP (проверено).
#
# Использование:
#   scripts/publish-subdomain.sh <папка> <ssh-хост> <путь-на-сервере> [опции]
#
# Примеры:
#   scripts/publish-subdomain.sh out/site beget-myarredo public_html
#   scripts/publish-subdomain.sh out/site user@host.ru /var/www/demo --batch 500 --pause 5
#
# Опции:
#   --batch N     файлов в одной партии (по умолчанию 800)
#   --pause SEC   пауза между партиями (по умолчанию 3)
#   --delete      удалять на сервере то, чего нет локально (ОСТОРОЖНО)
#   --dry         показать что будет сделано, ничего не заливать
# ──────────────────────────────────────────────────────────────────────────
set -euo pipefail

SRC="${1:-}"; HOST="${2:-}"; DEST="${3:-}"
shift 3 2>/dev/null || true

BATCH=800; PAUSE=3; DELETE=""; DRY=""
while [ $# -gt 0 ]; do
  case "$1" in
    --batch) BATCH="$2"; shift 2;;
    --pause) PAUSE="$2"; shift 2;;
    --delete) DELETE="--delete"; shift;;
    --dry) DRY="--dry-run"; shift;;
    *) echo "неизвестная опция: $1" >&2; exit 1;;
  esac
done

log()  { printf '\033[36m[publish]\033[0m %s\n' "$*"; }
die()  { printf '\033[31m[publish] ОШИБКА:\033[0m %s\n' "$*" >&2; exit 1; }

[ -n "$SRC" ] && [ -d "$SRC" ] || die "укажи существующую папку с сайтом"
[ -n "$HOST" ] || die "укажи ssh-хост (алиас из ~/.ssh/config или user@host)"
[ -n "$DEST" ] || die "укажи путь на сервере"

command -v rsync >/dev/null || die "rsync не установлен"

log "проверяю доступ к $HOST"
ssh -o ConnectTimeout=15 -o BatchMode=yes "$HOST" "mkdir -p '$DEST'" \
  || die "нет доступа по SSH к $HOST (проверь ключ в ~/.ssh/config)"

TOTAL=$(find "$SRC" -type f | wc -l | tr -d ' ')
SIZE=$(du -sh "$SRC" | awk '{print $1}')
log "к заливке: $TOTAL файлов, $SIZE → $HOST:$DEST"
[ -n "$DRY" ] && log "СУХОЙ ПРОГОН — ничего не изменится"

# Список файлов относительно SRC, режем на партии
LIST=$(mktemp); trap 'rm -f "$LIST" "$LIST".*' EXIT
(cd "$SRC" && find . -type f | sed 's|^\./||' | sort) > "$LIST"
split -l "$BATCH" "$LIST" "$LIST."

PARTS=$(ls "$LIST".* | wc -l | tr -d ' ')
log "партий: $PARTS по $BATCH файлов, пауза $PAUSE сек"

n=0
for part in "$LIST".*; do
  n=$((n+1))
  cnt=$(wc -l < "$part" | tr -d ' ')
  printf '\033[36m[publish]\033[0m партия %s/%s (%s файлов)... ' "$n" "$PARTS" "$cnt"

  if rsync -az --partial $DRY --files-from="$part" "$SRC/" "$HOST:$DEST/" 2>/tmp/publish-err.$$; then
    echo "ок"
  else
    echo "СБОЙ"
    cat /tmp/publish-err.$$ >&2
    rm -f /tmp/publish-err.$$
    die "партия $n не залилась — прогон остановлен, залитое осталось на месте"
  fi
  rm -f /tmp/publish-err.$$

  [ "$n" -lt "$PARTS" ] && sleep "$PAUSE"
done

# --delete отдельным проходом: массовое удаление на боевом требует
# осознанного решения, поэтому оно не смешано с заливкой.
if [ -n "$DELETE" ]; then
  log "удаляю на сервере лишнее (--delete)"
  rsync -az $DRY --delete --existing --ignore-existing "$SRC/" "$HOST:$DEST/" || die "проход удаления не прошёл"
fi

log "готово: $TOTAL файлов на $HOST:$DEST"
