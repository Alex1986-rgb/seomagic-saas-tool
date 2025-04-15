
import { useToast } from "@/hooks/use-toast";

// Get toast function
let toastFn: ReturnType<typeof useToast> | null = null;

export const setToastFunction = (toast: ReturnType<typeof useToast>) => {
  toastFn = toast;
};

// Helper functions for export actions
export const cleanUrl = (url: string): string => {
  return url.replace(/^https?:\/\//, '').replace(/[^a-z0-9]/gi, '-');
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

export const showExportError = (message = "Недостаточно данных для экспорта") => {
  if (toastFn) {
    toastFn.toast({
      title: "Ошибка экспорта",
      description: message,
      variant: "destructive"
    });
  } else {
    console.error("Toast function not set: " + message);
    alert("Ошибка: " + message);
  }
};

export const showExportSuccess = (title: string, description: string) => {
  if (toastFn) {
    toastFn.toast({
      title,
      description
    });
  } else {
    console.log(`${title}: ${description}`);
    alert(`${title}: ${description}`);
  }
};
