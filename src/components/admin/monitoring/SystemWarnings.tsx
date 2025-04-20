
import React from "react";
import { AlertTriangle, Info } from "lucide-react";

export interface SystemWarning {
  type: "warning" | "error" | "info";
  message: string;
}
interface Props {
  warnings: SystemWarning[];
}

const SystemWarnings: React.FC<Props> = ({ warnings }) => {
  if (!warnings.length) return null;
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {warnings.map((w, i) => (
          <div
            key={i}
            className={
              "flex-1 rounded-2xl p-5 flex items-center gap-4 shadow-lg border-2 " +
              (w.type === "warning"
                ? "bg-yellow-50/70 border-yellow-300 text-yellow-900"
                : w.type === "error"
                ? "bg-red-50/70 border-red-400 text-red-700"
                : "bg-blue-50/70 border-blue-300 text-blue-900"
              )
            }
          >
            <div className={
              "flex items-center justify-center rounded-full p-3 shrink-0 " + 
              (w.type === "warning"
                ? "bg-yellow-200/80"
                : w.type === "error"
                ? "bg-red-200/80"
                : "bg-blue-200/80"
              )}
            >
              {w.type === "error" ? <AlertTriangle className="h-7 w-7" /> :
                w.type === "warning" ? <AlertTriangle className="h-7 w-7" /> :
                <Info className="h-7 w-7" />}
            </div>
            <span className="text-base md:text-lg font-semibold">{w.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SystemWarnings;
