
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search } from 'lucide-react';

const formSchema = z.object({
  url: z.string().min(1, {
    message: "URL сайта обязателен",
  }).refine((value) => {
    try {
      const url = value.startsWith('http') ? value : `https://${value}`;
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }, {
    message: "Введите корректный URL сайта",
  }),
});

const UrlForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      
      // Форматируем URL для обеспечения корректного формата
      let formattedUrl = values.url;
      if (!formattedUrl.startsWith('http')) {
        formattedUrl = `https://${formattedUrl}`;
      }
      
      // Очищаем URL от лишних слешей в конце
      formattedUrl = formattedUrl.replace(/\/+$/, '');
      
      // Убедимся, что URL действительно валиден
      new URL(formattedUrl);
      
      // Переадресуем пользователя на страницу аудита с параметром URL
      const encodedUrl = encodeURIComponent(formattedUrl);
      navigate(`/site-audit?url=${encodedUrl}`);
      
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обработать URL. Пожалуйста, проверьте введенный адрес.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="Введите URL вашего сайта" 
                    className="pl-12 py-6 text-lg" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full py-6 text-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Обработка..." : "Проверить SEO"}
        </Button>
      </form>
    </Form>
  );
};

export default UrlForm;
