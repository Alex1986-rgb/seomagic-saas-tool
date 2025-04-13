
import React from 'react';
import { motion } from 'framer-motion';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Mail, MapPin, Phone } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Имя должно содержать не менее 2 символов",
  }),
  email: z.string().email({
    message: "Пожалуйста, введите корректный email",
  }),
  subject: z.string().min(5, {
    message: "Тема должна содержать не менее 5 символов",
  }),
  message: z.string().min(10, {
    message: "Сообщение должно содержать не менее 10 символов",
  }),
});

const Contact: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Сообщение отправлено",
      description: "Мы свяжемся с вами в ближайшее время.",
      duration: 5000,
    });
    form.reset();
  }

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Связаться с нами</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            У вас есть вопросы или предложения? Заполните форму ниже, и наша команда свяжется с вами в ближайшее время
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <motion.div 
            className="lg:col-span-2 order-2 lg:order-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="neo-card">
              <CardContent className="p-6 md:p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Имя</FormLabel>
                            <FormControl>
                              <Input placeholder="Ваше имя" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Ваш email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Тема</FormLabel>
                          <FormControl>
                            <Input placeholder="Тема сообщения" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Сообщение</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Введите ваше сообщение" 
                              rows={6}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" size="lg" className="w-full md:w-auto">
                      Отправить сообщение
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-8">
              <Card className="neo-card">
                <CardContent className="p-6 flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Телефон</h3>
                    <p className="text-muted-foreground text-sm mb-2">Пн-Пт с 9:00 до 18:00 (МСК)</p>
                    <a href="tel:+78001234567" className="font-medium text-lg hover:text-primary transition-colors">
                      +7 (800) 123-45-67
                    </a>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="neo-card">
                <CardContent className="p-6 flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <p className="text-muted-foreground text-sm mb-2">Мы отвечаем в течение 24 часов</p>
                    <a href="mailto:info@seomarket.ru" className="font-medium hover:text-primary transition-colors">
                      info@seomarket.ru
                    </a>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="neo-card">
                <CardContent className="p-6 flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Адрес</h3>
                    <p className="text-muted-foreground text-sm mb-2">Центральный офис</p>
                    <address className="not-italic">
                      Москва, ул. Примерная, д. 123,<br />
                      БЦ "Технополис", офис 456
                    </address>
                  </div>
                </CardContent>
              </Card>
              
              <div className="rounded-lg overflow-hidden h-48 neo-card">
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground">Карта загружается...</p>
                    <p className="text-sm text-primary mt-2">Интерактивная карта проезда</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold mb-6">Следите за нами в социальных сетях</h2>
          <div className="flex justify-center space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <a 
                key={i}
                href="#" 
                className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <span className="sr-only">Социальная сеть {i}</span>
                <div className="w-5 h-5 rounded-full bg-primary/50"></div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
