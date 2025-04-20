
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
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {warnings.map((w, i) => (
          <div
            key={i}
            className={
              "rounded-lg p-4 flex items-center gap-3 " +
              (w.type === "warning"
                ? "bg-amber-50 text-amber-800 border border-amber-200"
                : w.type === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-blue-50 text-blue-800 border border-blue-200"
              )
            }
          >
            {w.type === "error" ? <AlertTriangle className="h-5 w-5 flex-shrink-0" /> :
             w.type === "warning" ? <AlertTriangle className="h-5 w-5 flex-shrink-0" /> :
             <Info className="h-5 w-5 flex-shrink-0" />}
            <span className="text-sm">{w.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SystemWarnings;
