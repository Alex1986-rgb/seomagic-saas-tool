
import { toast } from "@/hooks/use-toast";
import { saveAs } from 'file-saver';

/**
 * Cleans URL for use in filenames by removing protocol and special characters
 */
export const cleanUrl = (url: string): string => {
  return url.replace(/https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '-');
};

/**
 * Formats date string into YYYY-MM-DD format for filenames
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

/**
 * Shows error toast for export operations
 */
export const showExportError = (message: string = "Нет данных для экспорта") => {
  toast({
    title: "Ошибка",
    description: message,
    variant: "destructive"
  });
};

/**
 * Shows success toast for export operations
 */
export const showExportSuccess = (title: string, description: string) => {
  toast({
    title,
    description,
  });
};
