
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';

interface CreateProjectButtonProps {
  onProjectCreated?: () => void;
}

const CreateProjectButton: React.FC<CreateProjectButtonProps> = ({ onProjectCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCreateProject = async () => {
    if (!projectName || !projectUrl) {
      toast({
        title: "Ошибка",
        description: "Заполните название и URL проекта",
        variant: "destructive",
      });
      return;
    }

    // Проверка и форматирование URL
    let formattedUrl = projectUrl;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    try {
      // Проверка валидности URL
      new URL(formattedUrl);
    } catch (e) {
      toast({
        title: "Некорректный URL",
        description: "Пожалуйста, введите корректный URL сайта",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: projectName,
          url: formattedUrl,
          user_id: user?.id,
          settings: {}
        })
        .select();

      if (error) throw error;

      toast({
        title: "Проект создан",
        description: `Проект "${projectName}" успешно создан`,
      });

      setIsOpen(false);
      setProjectName('');
      setProjectUrl('');
      
      if (onProjectCreated) {
        onProjectCreated();
      }
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: "Ошибка создания проекта",
        description: error.message || "Произошла ошибка при создании проекта",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>Новый проект</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать новый проект</DialogTitle>
          <DialogDescription>
            Введите название и URL сайта для создания нового проекта
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="project-name">Название проекта</Label>
            <Input
              id="project-name"
              placeholder="Мой новый проект"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-url">URL сайта</Label>
            <Input
              id="project-url"
              placeholder="example.com"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateProject} disabled={isLoading}>
            {isLoading ? 'Создание...' : 'Создать проект'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectButton;
