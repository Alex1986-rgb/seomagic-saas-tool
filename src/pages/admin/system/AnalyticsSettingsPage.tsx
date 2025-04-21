import React from "react";
import AnalyticsSettings from "@/components/admin/system/AnalyticsSettings";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Activity } from "lucide-react";
import AnalyticsMiniDashboard from "@/components/admin/system/AnalyticsMiniDashboard";
import AnalyticsStatsCards from "@/components/admin/system/AnalyticsStatsCards";
import AnalyticsTabs from "@/components/admin/system/AnalyticsTabs";

const AnalyticsSettingsPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-6xl">
    <h2 className="text-2xl font-bold mb-3">Аналитика</h2>
    <p className="mb-4 text-muted-foreground">Настройки сбора и анализа данных системы, подключение интеграций.</p>
    <AnalyticsMiniDashboard />
    <AnalyticsStatsCards />
    <AnalyticsTabs />

    <div className="mt-8 text-sm text-muted-foreground space-y-2">
      <div><b>Возможности:</b> Google Analytics, собственная аналитика, хранение данных.</div>
      <ul className="list-disc pl-5">
        <li>Гибкая настройка интеграций</li>
        <li>Сбор важнейшей статистики</li>
        <li>Дашборд текущих показателей</li>
      </ul>
      <div>Обратите внимание: аналитика соответствует требованиям GDPR.</div>
    </div>
  </div>
);

export default AnalyticsSettingsPage;
