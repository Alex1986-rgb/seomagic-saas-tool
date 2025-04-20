
import React from "react";
import { motion } from "framer-motion";
import UrlForm from "@/components/url-form";
import AuditHero from "@/components/audit/AuditHero";
import AuditErrorAlert from "@/components/audit/AuditErrorAlert";
import SeoAuditResults from "@/components/SeoAuditResults";
import AuditAdvancedTools from "@/components/audit/AuditAdvancedTools";
import AuditErrorFallback from "./AuditErrorFallback";
import { ErrorBoundary } from "react-error-boundary";

interface AuditLoaderSectionProps {
  url: string;
  error: string | null;
  isLoading: boolean;
  showAdvancedTools: boolean;
  scannedUrls: string[];
  handleClearError: () => void;
  handleUrlsScanned: (urls: string[]) => void;
  setShowAdvancedTools: (b: boolean) => void;
  extractedUrl: React.MutableRefObject<boolean>;
  setTimeoutOccurred: (v: boolean) => void;
  extractUrlParam: () => void;
}

const AuditLoaderSection: React.FC<AuditLoaderSectionProps> = ({
  url,
  error,
  isLoading,
  showAdvancedTools,
  scannedUrls,
  handleClearError,
  handleUrlsScanned,
  setShowAdvancedTools,
  extractedUrl,
  setTimeoutOccurred,
  extractUrlParam
}) => {
  const handleResetErrors = () => {
    extractedUrl.current = false;
    setTimeoutOccurred(false);
    extractUrlParam();
  };

  return (
    <div className="container mx-auto px-4 md:px-6 pt-32 pb-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent -z-10" />
      <AuditHero url={url} />
      <AuditErrorAlert error={error} onClearError={handleClearError} />

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {!url && (
            <motion.div 
              className="max-w-2xl mx-auto mb-16 elegant-card p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <UrlForm />
            </motion.div>
          )}
          {url && (
            <>
              <div className="mb-8">
                <div className="elegant-divider-alt" />
              </div>
              <ErrorBoundary
                FallbackComponent={({ error, resetErrorBoundary }) => (
                  <AuditErrorFallback 
                    error={error} 
                    resetErrorBoundary={resetErrorBoundary}
                    extractedUrlRef={extractedUrl}
                    setTimeoutOccurred={setTimeoutOccurred}
                  />
                )}
                onReset={handleResetErrors}
                resetKeys={[url]}
              >
                <SeoAuditResults url={url} />
              </ErrorBoundary>
            </>
          )}
          {url && (
            <AuditAdvancedTools 
              url={url}
              showAdvancedTools={showAdvancedTools}
              scannedUrls={scannedUrls}
              onUrlsScanned={handleUrlsScanned}
              onToggleTools={() => setShowAdvancedTools(!showAdvancedTools)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AuditLoaderSection;
