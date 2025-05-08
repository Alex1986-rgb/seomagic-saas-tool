
import React from "react";
import { motion } from "framer-motion";
import UrlForm from "@/components/url-form";
import AuditHero from "./AuditHero";

interface AuditTimeoutMessageProps {
  url: string;
  onRetry: () => void;
}

const AuditTimeoutMessage: React.FC<AuditTimeoutMessageProps> = ({ url, onRetry }) => (
  <div className="container mx-auto px-4 md:px-6 pt-32 pb-20 relative">
    <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent -z-10" />
    <AuditHero url={url} />
    <div className="p-6 text-center">
      <p className="text-lg text-red-500 mb-4">
        Время ожидания истекло. Возможно, сайт слишком большой или возникли проблемы с соединением.
      </p>
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-white rounded-md"
      >
        Попробовать снова
      </button>
    </div>
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
  </div>
);

export default AuditTimeoutMessage;
