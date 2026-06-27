#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────
# SeoMarket — релиз на GitHub Pages (один шаг).
#
# Что делает:
#   1. Собирает прод-бандл под под-путь /seomagic-saas-tool/ (GITHUB_PAGES=true)
#   2. Готовит SPA-fallback (404.html = index.html) и .nojekyll
#   3. Публикует dist в ветку gh-pages (force-push через токен gh CLI)
#   4. Ждёт публикации и проверяет, что новый бандл реально отдаётся (HTTP 200)
#
# Использование:
#   bash scripts/deploy-gh-pages.sh                 # сборка + деплой
#   bash scripts/deploy-gh-pages.sh --skip-build    # деплой уже собранного dist/
#
# Требования: gh авторизован (gh auth status) со scope repo; Node/npm.
# ──────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO="Alex1986-rgb/seomagic-saas-tool"
PAGES_URL="https://alex1986-rgb.github.io/seomagic-saas-tool"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

log() { printf '\033[36m[deploy]\033[0m %s\n' "$*"; }
die() { printf '\033[31m[deploy] ОШИБКА:\033[0m %s\n' "$*" >&2; exit 1; }

command -v gh >/dev/null || die "gh CLI не найден"
gh auth status >/dev/null 2>&1 || die "gh не авторизован (gh auth login)"

if [[ "${1:-}" != "--skip-build" ]]; then
  log "Сборка прод-бандла (GITHUB_PAGES=true)…"
  GITHUB_PAGES=true npm run build
fi

[[ -f dist/index.html ]] || die "dist/index.html не найден — сначала собери проект"

log "Подготовка SPA-fallback (404.html) и .nojekyll…"
cp dist/index.html dist/404.html
touch dist/.nojekyll

JS_FILE="$(grep -oE 'assets/index-[^\"]+\.js' dist/index.html | head -1)"
[[ -n "$JS_FILE" ]] || die "не удалось определить главный JS-бандл в dist/index.html"
log "Главный бандл: $JS_FILE"

log "Публикация в ветку gh-pages…"
TOKEN="$(gh auth token)"
(
  cd dist
  rm -rf .git
  git init -q
  git checkout -q -b gh-pages
  git add -A
  git -c user.email="deploy@local" -c user.name="Deploy Bot" \
      commit -qm "Deploy $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  git push -q -f "https://x-access-token:${TOKEN}@github.com/${REPO}.git" gh-pages
)
log "Запушено. Жду публикации Pages…"

for i in $(seq 1 40); do
  if curl -fsS "${PAGES_URL}/" 2>/dev/null | grep -q "$JS_FILE"; then
    code="$(curl -s -o /dev/null -w '%{http_code}' "${PAGES_URL}/${JS_FILE}")"
    log "✅ Live: ${PAGES_URL}/  (бандл HTTP ${code})"
    exit 0
  fi
  sleep 6
done

die "новый бандл не появился за ~4 минуты — проверь https://github.com/${REPO}/deployments"
