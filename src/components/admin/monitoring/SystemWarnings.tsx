
import React from "react";
import { AlertTriangle, Info, AlertCircle } from "lucide-react";

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
              "rounded-lg p-4 flex items-center gap-3 border shadow-md transition-shadow hover:shadow-lg " +
              (w.type === "warning"
                ? "bg-amber-950/40 text-amber-200 border-amber-800/50"
                : w.type === "error"
                ? "bg-red-950/40 text-red-200 border-red-800/50"
                : "bg-blue-950/40 text-blue-200 border-blue-800/50"
              )
            }
          >
            {w.type === "error" ? 
              <AlertCircle className="h-6 w-6 flex-shrink-0 text-red-400" /> :
             w.type === "warning" ? 
              <AlertTriangle className="h-6 w-6 flex-shrink-0 text-amber-400" /> :
              <Info className="h-6 w-6 flex-shrink-0 text-blue-400" />
            }
            <span className="text-sm font-medium">{w.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SystemWarnings;
