import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminRouteGuard from '@/components/admin/AdminRouteGuard';
import CabinetLayout from './CabinetLayout';
import { CabinetProjectProvider } from './project';
import { Loading } from './ui';

/**
 * Маршруты кабинета SeoMarket 2.0 (/app/*).
 *
 * Новый кабинет живёт рядом со старым (/dashboard, /site-audit…), пока не принят: переадресации
 * со старых адресов добавляются после приёмки, а не сейчас — иначе рабочие сценарии клиентов
 * пропадут до того, как новые экраны проверены на настоящих данных.
 *
 * Экраны без сайдбара (вход, сброс пароля, первый вход, оплата, смета по ссылке) — вне оболочки:
 * на оплате ничего не должно отвлекать, а смету заказчик открывает без входа в наш кабинет.
 */

const Overview = React.lazy(() => import('./screens/Overview'));
const Welcome = React.lazy(() => import('./screens/Welcome'));
const Audit = React.lazy(() => import('./screens/Audit'));
const Results = React.lazy(() => import('./screens/Results'));
const PageDetail = React.lazy(() => import('./screens/PageDetail'));
const Optimize = React.lazy(() => import('./screens/Optimize'));
const Estimate = React.lazy(() => import('./screens/Estimate'));
const Order = React.lazy(() => import('./screens/Order'));
const Pay = React.lazy(() => import('./screens/Pay'));
const SharedEstimate = React.lazy(() => import('./screens/SharedEstimate'));
const Positions = React.lazy(() => import('./screens/Positions'));
const Rivals = React.lazy(() => import('./screens/Rivals'));
const History = React.lazy(() => import('./screens/History'));
const Reports = React.lazy(() => import('./screens/Reports'));
const Alerts = React.lazy(() => import('./screens/Alerts'));
const Settings = React.lazy(() => import('./screens/Settings'));
const Onboarding = React.lazy(() => import('./screens/Onboarding'));
const Login = React.lazy(() => import('./screens/Login'));
const Register = React.lazy(() => import('./screens/Register'));
const Reset = React.lazy(() => import('./screens/Reset'));
const Admin = React.lazy(() => import('./screens/Admin'));

const Fallback = () => (
  <div style={{ padding: 'var(--space-8) var(--space-6)' }}>
    <Loading />
  </div>
);

const s = (el: React.ReactNode) => <Suspense fallback={<Fallback />}>{el}</Suspense>;

/** Экраны в оболочке. Функция, а не массив: тот же набор монтируется в dev-просмотре. */
function shellScreens() {
  return (
    <>
          <Route index element={s(<Overview />)} />
          <Route path="audit" element={s(<Audit />)} />
          <Route path="results" element={s(<Results />)} />
          <Route path="page" element={s(<PageDetail />)} />
          <Route path="optimize" element={s(<Optimize />)} />
          <Route path="estimate" element={s(<Estimate />)} />
          <Route path="order" element={s(<Order />)} />
          <Route path="positions" element={s(<Positions />)} />
          <Route path="rivals" element={s(<Rivals />)} />
          <Route path="history" element={s(<History />)} />
          <Route path="reports" element={s(<Reports />)} />
          <Route path="alerts" element={s(<Alerts />)} />
          <Route path="settings" element={s(<Settings />)} />
          <Route path="onboarding" element={s(<Onboarding />)} />
          <Route path="admin" element={<AdminRouteGuard>{s(<Admin />)}</AdminRouteGuard>} />
          <Route path="admin/:tab" element={<AdminRouteGuard>{s(<Admin />)}</AdminRouteGuard>} />
    </>
  );
}

const CabinetRoutes: React.FC = () => (
  <CabinetProjectProvider>
    <Routes>
      {/* Без входа */}
      <Route path="login" element={s(<Login />)} />
      <Route path="register" element={s(<Register />)} />
      <Route path="reset" element={s(<Reset />)} />
      <Route path="s/:token" element={s(<SharedEstimate />)} />

      {/* Под входом, без оболочки */}
      <Route path="welcome" element={<ProtectedRoute>{s(<Welcome />)}</ProtectedRoute>} />
      <Route path="pay" element={<ProtectedRoute>{s(<Pay />)}</ProtectedRoute>} />

      {/* Под входом, в оболочке */}
      <Route
        element={
          <ProtectedRoute>
            <CabinetLayout />
          </ProtectedRoute>
        }
      >
        {shellScreens()}
      </Route>
      {/* Только в разработке: оболочка без входа, чтобы проверять вёрстку экранов в браузере.
          Данных нет (нет сессии) — экраны показывают пустые состояния. В сборку не попадает:
          import.meta.env.DEV на этапе сборки заменяется на false и ветка вырезается. */}
      {import.meta.env.DEV && (
        <Route path="dev" element={<CabinetLayout />}>
          {shellScreens()}
        </Route>
      )}
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  </CabinetProjectProvider>
);

export default CabinetRoutes;
