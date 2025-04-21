
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
              "rounded-lg p-4 flex items-center gap-3 border shadow-sm hover:shadow-md transition-shadow " +
              (w.type === "warning"
                ? "bg-amber-50 text-amber-800 border-amber-200"
                : w.type === "error"
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-blue-50 text-blue-800 border-blue-200"
              )
            }
          >
            {w.type === "error" ? 
              <AlertCircle className="h-6 w-6 flex-shrink-0 text-red-500" /> :
             w.type === "warning" ? 
              <AlertTriangle className="h-6 w-6 flex-shrink-0 text-amber-500" /> :
              <Info className="h-6 w-6 flex-shrink-0 text-blue-500" />
            }
            <span className="text-sm font-medium">{w.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SystemWarnings;
