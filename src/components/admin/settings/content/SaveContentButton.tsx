
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface SaveContentButtonProps {
  onSave?: () => void;
}

const SaveContentButton: React.FC<SaveContentButtonProps> = ({ onSave }) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = () => {
    setIsSaving(true);
    
    // Call the optional onSave callback if provided
    if (onSave) onSave();
    
    // Simulate saving to server
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Настройки сохранены",
        description: "Изменения содержимого сайта успешно сохранены",
        variant: "default",
      });
    }, 800);
  };
  
  return (
    <Button onClick={handleSave} className="gap-2" disabled={isSaving}>
      {isSaving ? (
        <>
          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
          <span>Сохранение...</span>
        </>
      ) : (
        <>
          <Save className="h-4 w-4" />
          <span>Сохранить настройки контента</span>
        </>
      )}
    </Button>
  );
};

export default SaveContentButton;
