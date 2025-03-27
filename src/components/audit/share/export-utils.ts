
import { useToast } from "@/hooks/use-toast";

// Clean URL for use in filenames
export const cleanUrl = (url: string): string => {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
    .replace(/[^a-zA-Z0-9]/g, '-');
};

// Format date for use in filenames
export const formatDate = (date: string): string => {
  return new Date(date).toISOString().split('T')[0];
};

// Show export error toast
export const showExportError = (message: string = "Не удалось выполнить экспорт") => {
  const { toast } = useToast();
  toast({
    title: "Ошибка экспорта",
    description: message,
    variant: "destructive",
  });
};

// Show export success toast
export const showExportSuccess = (title: string, message: string) => {
  const { toast } = useToast();
  toast({
    title,
    description: message,
  });
};
