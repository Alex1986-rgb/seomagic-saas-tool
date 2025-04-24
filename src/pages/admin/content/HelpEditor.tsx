
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import BaseContentEditor from '@/components/admin/content/BaseContentEditor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from '@/hooks/use-toast';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface HelpCategory {
  id: string;
  name: string;
  description: string;
  articles: string[];
}

const HelpEditor: React.FC = () => {
  const { toast } = useToast();
  
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: 'Как запустить первый аудит?',
      answer: 'Для запуска аудита введите URL вашего сайта в форму на главной странице и нажмите кнопку "Запустить аудит".'
    },
    {
      id: '2',
      question: 'Что включает в себя отчет?',
      answer: 'Отчет включает в себя технический анализ сайта, проверку SEO-параметров, анализ контента и рекомендации по оптимизации.'
    }
  ]);
  
  const [categories, setCategories] = useState<HelpCategory[]>([
    {
      id: '1',
      name: 'Начало работы',
      description: 'Основные шаги для начала работы с платформой',
      articles: ['Регистрация', 'Первый аудит', 'Интерпретация результатов']
    },
    {
      id: '2',
      name: 'Оптимизация',
      description: 'Инструкции по оптимизации вашего сайта',
      articles: ['SEO оптимизация', 'Производительность', 'Безопасность']
    }
  ]);
  
  const handleSave = (data: any) => {
    console.log('Saving help data:', data);
    toast({
      title: "Изменения сохранены",
      description: "Справочные материалы успешно обновлены"
    });
  };
  
  const addFaq = () => {
    const newFaq: FAQ = {
      id: Date.now().toString(),
      question: 'Новый вопрос',
      answer: 'Ответ на вопрос'
    };
    
    setFaqs([...faqs, newFaq]);
    
    toast({
      title: "FAQ добавлен",
      description: "Новый вопрос успешно добавлен"
    });
  };
  
  const removeFaq = (id: string) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
    
    toast({
      title: "FAQ удален",
      description: "Вопрос успешно удален"
    });
  };
  
  const updateFaq = (id: string, field: string, value: string) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, [field]: value } : faq
    ));
  };
  
  const addCategory = () => {
    const newCategory: HelpCategory = {
      id: Date.now().toString(),
      name: 'Новая категория',
      description: 'Описание категории',
      articles: ['Статья 1']
    };
    
    setCategories([...categories, newCategory]);
    
    toast({
      title: "Категория добавлена",
      description: "Новая категория справки создана"
    });
  };
  
  const removeCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
    
    toast({
      title: "Категория удалена",
      description: "Категория справки успешно удалена"
    });
  };

  return (
    <>
      <Helmet>
        <title>Редактирование справки | Админ панель</title>
      </Helmet>
      
      <BaseContentEditor
        title="Редактирование справки"
        description="Управление справочными материалами, FAQ и инструкциями"
        onSave={handleSave}
      >
        <div className="space-y-6">
          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Настройки страницы справки</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Заголовок страницы</label>
                  <Input 
                    defaultValue="Центр помощи" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Описание</label>
                  <Textarea 
                    defaultValue="Ответы на часто задаваемые вопросы и руководства по использованию платформы" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Часто задаваемые вопросы</h3>
                <Button onClick={addFaq} className="bg-primary hover:bg-primary/90" size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Добавить вопрос
                </Button>
              </div>
              
              <Accordion type="multiple" className="w-full">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border-white/10">
                    <AccordionTrigger className="hover:bg-white/5 px-4 rounded-t-md">
                      <div className="flex items-center justify-between w-full pr-4">
                        <Input 
                          value={faq.question}
                          onChange={(e) => updateFaq(faq.id, 'question', e.target.value)}
                          className="bg-transparent border-none hover:bg-white/5 focus:bg-black/20"
                          placeholder="Введите вопрос"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFaq(faq.id);
                          }}
                          variant="ghost" 
                          size="sm" 
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pt-2 pb-4">
                      <Textarea 
                        value={faq.answer}
                        onChange={(e) => updateFaq(faq.id, 'answer', e.target.value)}
                        className="bg-black/20 border-white/10"
                        placeholder="Введите ответ на вопрос"
                        rows={3}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              {faqs.length === 0 && (
                <div className="p-8 text-center border border-dashed border-white/10 rounded-md bg-black/10">
                  <p className="text-gray-400">Вопросы не найдены. Добавьте новый вопрос.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Категории справки</h3>
                <Button onClick={addCategory} className="bg-primary hover:bg-primary/90" size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Добавить категорию
                </Button>
              </div>
              
              <div className="space-y-4">
                {categories.map((category) => (
                  <Card key={category.id} className="border-white/10 bg-black/30">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-grow">
                          <label className="block text-xs font-medium mb-1">Название категории</label>
                          <Input 
                            value={category.name}
                            onChange={(e) => {
                              const updatedCategories = categories.map(c => 
                                c.id === category.id ? {...c, name: e.target.value} : c
                              );
                              setCategories(updatedCategories);
                            }}
                            className="bg-black/20 border-white/10"
                          />
                        </div>
                        <Button 
                          onClick={() => removeCategory(category.id)}
                          variant="ghost" 
                          size="sm" 
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mb-3">
                        <label className="block text-xs font-medium mb-1">Описание</label>
                        <Textarea 
                          value={category.description}
                          onChange={(e) => {
                            const updatedCategories = categories.map(c => 
                              c.id === category.id ? {...c, description: e.target.value} : c
                            );
                            setCategories(updatedCategories);
                          }}
                          className="bg-black/20 border-white/10"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Статьи в категории</label>
                        <div className="space-y-2 mt-2">
                          {category.articles.map((article, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input 
                                value={article}
                                onChange={(e) => {
                                  const updatedArticles = [...category.articles];
                                  updatedArticles[index] = e.target.value;
                                  const updatedCategories = categories.map(c => 
                                    c.id === category.id ? {...c, articles: updatedArticles} : c
                                  );
                                  setCategories(updatedCategories);
                                }}
                                className="bg-black/20 border-white/10"
                              />
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  const updatedArticles = category.articles.filter((_, i) => i !== index);
                                  const updatedCategories = categories.map(c => 
                                    c.id === category.id ? {...c, articles: updatedArticles} : c
                                  );
                                  setCategories(updatedCategories);
                                }}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              const updatedArticles = [...category.articles, 'Новая статья'];
                              const updatedCategories = categories.map(c => 
                                c.id === category.id ? {...c, articles: updatedArticles} : c
                              );
                              setCategories(updatedCategories);
                            }}
                            className="border-white/10 hover:bg-white/5 w-full"
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Добавить статью
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {categories.length === 0 && (
                  <div className="p-8 text-center border border-dashed border-white/10 rounded-md bg-black/10">
                    <p className="text-gray-400">Категории не найдены. Добавьте новую категорию.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </BaseContentEditor>
    </>
  );
};

export default HelpEditor;
