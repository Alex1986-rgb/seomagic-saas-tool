
import React from "react";
import { AlertTriangle, Info, AlertCircle } from "lucide-react";

export interface SystemWarning {
  type: "warning" | "error" | "info";
  message: string;
}
interface Props {
  warnings: SystemWarning[];
}

const COLORS = {
  warning: "from-amber-800/80 to-amber-600/40 text-amber-200 border-amber-500/40",
  error: "from-red-900/80 to-red-700/40 text-red-200 border-red-500/40",
  info: "from-sky-900/80 to-sky-800/40 text-blue-200 border-blue-500/40",
};

const ICONS = {
  error: <AlertCircle className="h-7 w-7 flex-shrink-0 text-red-400" />,
  warning: <AlertTriangle className="h-7 w-7 flex-shrink-0 text-amber-400" />,
  info: <Info className="h-7 w-7 flex-shrink-0 text-blue-400" />,
};

const SystemWarnings: React.FC<Props> = ({ warnings }) => {
  if (!warnings.length) return null;
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {warnings.map((w, i) => (
          <div
            key={i}
            className={`rounded-xl p-5 flex items-center gap-4 border shadow-md glass-morphism bg-gradient-to-br ${COLORS[w.type]} transition-shadow hover:shadow-xl`}
          >
            {ICONS[w.type]}
            <span className="text-base font-medium">{w.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SystemWarnings;
