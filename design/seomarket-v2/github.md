repo: alex1986-rgb/seomagic-saas-tool
branch: main

## Last sync
date: 2026-09-16T13:38:00Z

### Updated in this project
- Admin screen rebuilt with four sub-tabs: Сводка, Платежи, Прокси, Система
- Платежи: invoice register with Russian payment methods (Карта МИР, СБП, ЮMoney, расчётный счёт)
- Прокси: proxy pool for position checking — status, response time, source, last ping
- Система: CPU/RAM/disk meters, service uptime, event log, environment info
- Настройки: added Оплата (default method + invoice history) and Безопасность (2FA, API key, sessions)

## Reviewed, deliberately not adopted
- `+N % трафика` metric computed as cost/10000×10 — invented number, removed from the funnel
- 25 % "Премиум" package discount on top of the full sum — volume discount used instead
- Pastel red/amber/green cards, pulsing icons, hover scaling — the "childish" look being replaced
- Subscription plans (basic/pro/agency) — superseded by pay-per-fix estimate

## Known issues in the repo (not fixed upstream)
- robots.txt Host/Sitemap point at seomarket.app while README says seomarket.ru; Host is obsolete
- Duplicate routes without canonical: /dashboard + /client-dashboard, /docs + /documentation, /audits + /audit-history, Cyrillic + Latin /features/* pairs
- DefaultSEO applies one title to every page lacking its own <SEO>
- Ten JSON-LD blocks on the homepage incl. Review, Course, JobPosting, Event
- DetailedFeaturesSection links to /features/security and /features/position-tracking-feature — no such routes
- PricingPlans: to="/audit?plan={plan.name}" is a literal string, not a template literal
- ClientDashboard.tsx is a stub ("функция находится в разработке") while client components exist
- .env committed at repo root; SPA with no SSR

## Screen map
| Screen | Built from |
| --- | --- |
| Обзор | src/components/client/ProfileSidebar.tsx, src/pages/Dashboard.tsx |
| Новый аудит | src/pages/Audit.tsx, src/components/audit/InterruptedAuditBanner.tsx |
| Результаты | src/types/audit/audit-core.ts, src/components/audit/AuditRecommendations.tsx |
| Страница | src/components/audit/deep-crawl/, src/types/audit/optimization-types.ts |
| Оптимизация | src/pages/SeoOptimizationPage.tsx, src/pages/OptimizationDemo.tsx |
| Смета | src/components/admin/settings/PricingSettings.tsx, src/components/audit/monitoring/CostEstimator.tsx, WorkPackagesCard.tsx, ShareEstimateDialog.tsx, src/pages/SharedEstimate.tsx |
| Позиции | src/pages/PositionTracker.tsx, src/components/client/position-tracker/ |
| Конкуренты | src/components/position-tracker/ |
| История | src/components/client/audits/AuditCard.tsx, EmptyAuditState.tsx |
| Отчёты | src/pages/Reports.tsx, src/pages/PdfReportsPage.tsx |
| Уведомления | src/components/client/ClientNotifications.tsx |
| Настройки | src/components/client/settings/, src/components/client/subscription/CurrentSubscription.tsx |
| Онбординг | src/components/admin/website-analyzer/ScanForm.tsx |
| Админ · Платежи | src/components/admin/payments/ (PaymentTableRow.tsx, mockData.ts, PaymentFilters.tsx) |
| Админ · Прокси | src/components/admin/proxies/ (ProxyList.tsx, ProxyManager.tsx, PingService.tsx) |
| Админ · Система | src/components/admin/monitoring/monitoringData.ts, StatCards.tsx, EventLog.tsx, ServerInfo.tsx |
| Админ · Сводка | src/components/admin/AdminSidebar.tsx, src/routes/AdminRoutes.tsx |
