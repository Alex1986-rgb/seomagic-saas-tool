import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import { formatDateTime, isErrorStatus, type ApiLogRow } from "@/lib/admin-stats";

interface Props {
  rows: ApiLogRow[];
}

/**
 * Журнал вызовов edge-функций.
 *
 * Раньше здесь был придуманный список системных событий («резервное
 * копирование», «вход администратора admin»). Ничего подобного платформа не
 * логирует — показываем то, что реально пишется в `api_logs`.
 *
 * Журнал неполный: пишут его не все функции, а функции оптимизации ставят
 * в duration_ms заглушку 0 — такую «длительность» не выводим.
 */
const EventLog: React.FC<Props> = ({ rows }) => (
  <Card className="shadow lg:col-span-2 border-0 bg-gradient-to-br from-[#191b2a]/80 via-[#23263b]/80 to-[#403E43]/80 glass-morphism">
    <CardHeader className="pb-2 flex flex-row items-center gap-3">
      <Activity className="text-[#14CC8C] rounded-lg p-2 h-8 w-8 bg-emerald-900/20 mr-1" />
      <div>
        <CardTitle className="text-lg font-medium font-playfair">Журнал вызовов</CardTitle>
        <CardDescription>Последние записи api_logs — только от функций, которые ведут журнал</CardDescription>
      </div>
    </CardHeader>
    <CardContent>
      {rows.length === 0 ? (
        <p className="py-6 text-sm text-muted-foreground">
          За последние сутки в журнал ничего не записано.
        </p>
      ) : (
        <div className="divide-y divide-border/30">
          {rows.map((row, idx) => {
            const failed = isErrorStatus(row.status_code);
            return (
              <div key={`${row.function_name}-${row.created_at}-${idx}`} className="py-3 flex items-center gap-4">
                <div
                  className={`rounded-full p-2 shadow ${
                    failed ? "bg-red-950/70 text-red-400" : "bg-emerald-950/70 text-emerald-300"
                  }`}
                >
                  {failed ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium truncate">{row.function_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDateTime(row.created_at)}
                    {row.status_code !== null && ` · код ${row.status_code}`}
                    {typeof row.duration_ms === "number" && row.duration_ms > 0 && ` · ${row.duration_ms} мс`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </CardContent>
  </Card>
);

export default EventLog;
