
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CrawlProgressView from "../../components/CrawlProgressView";

interface ProgressTabProps {
  progress: number;
  pagesScanned: number;
  estimatedPages: number;
  currentUrl: string;
  error: string | null;
  info: string;
}

const ProgressTab: React.FC<ProgressTabProps> = ({
  progress,
  pagesScanned,
  estimatedPages,
  currentUrl,
  error,
  info
}) => {
  return (
    <motion.div
      className="mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <CrawlProgressView
        progress={progress}
        pagesScanned={pagesScanned}
        estimatedPages={estimatedPages}
        currentUrl={currentUrl}
        error={error}
        info={info}
      />
    </motion.div>
  );
};

export default ProgressTab;
