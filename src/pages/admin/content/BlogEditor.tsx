
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import BaseContentEditor from '@/components/admin/content/BaseContentEditor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash2, Calendar, Tag, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  publishDate: string;
  tags: string[];
  status: 'draft' | 'published';
}

const BlogEditor: React.FC = () => {
  const { toast } = useToast();
  const [blogSettings, setBlogSettings] = useState({
    title: 'Блог о SEO и оптимизации',
    description: 'Полезные статьи о современных инструментах оптимизации сайтов',
    postsPerPage: 10,
    showAuthor: true,
    showDate: true
  });
  
  const [openNewPostDialog, setOpenNewPostDialog] = useState(false);
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    author: 'Администратор',
    category: 'SEO',
    publishDate: new Date().toISOString().split('T')[0],
    tags: [],
    status: 'draft'
  });
  
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Как улучшить SEO в 2025 году',
      excerpt: 'Новые методы и подходы к оптимизации контента',
      content: '<p>Полная статья о том, как улучшить SEO...</p>',
      author: 'Алексей Иванов',
      category: 'SEO',
      publishDate: '2025-03-15',
      tags: ['SEO', 'контент', 'оптимизация'],
      status: 'published'
    },
    {
      id: '2',
      title: 'Влияние ИИ на поисковую оптимизацию',
      excerpt: 'Как искусственный интеллект меняет подходы к SEO',
      content: '<p>Полная статья о том, как ИИ влияет на SEO...</p>',
      author: 'Мария Смирнова',
      category: 'AI',
      publishDate: '2025-04-02',
      tags: ['AI', 'SEO', 'технологии'],
      status: 'published'
    }
  ]);

  const handleSave = (data: any) => {
    console.log('Saving blog page data:', data);
    toast({
      title: "Изменения сохранены",
      description: "Контент блога обновлен",
    });
  };
  
  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) {
      toast({
        title: "Ошибка",
        description: "Заполните обязательные поля",
        variant: "destructive"
      });
      return;
    }
    
    const post: BlogPost = {
      id: Date.now().toString(),
      title: newPost.title || '',
      excerpt: newPost.excerpt || '',
      content: newPost.content || '',
      author: newPost.author || 'Администратор',
      category: newPost.category || 'SEO',
      publishDate: newPost.publishDate || new Date().toISOString().split('T')[0],
      tags: newPost.tags || [],
      status: newPost.status || 'draft'
    };
    
    setBlogPosts([...blogPosts, post]);
    setOpenNewPostDialog(false);
    setNewPost({
      title: '',
      excerpt: '',
      content: '',
      author: 'Администратор',
      category: 'SEO',
      publishDate: new Date().toISOString().split('T')[0],
      tags: [],
      status: 'draft'
    });
    
    toast({
      title: "Статья создана",
      description: "Новая статья блога успешно добавлена"
    });
  };
  
  const handleDeletePost = (id: string) => {
    setBlogPosts(blogPosts.filter(post => post.id !== id));
    toast({
      title: "Статья удалена",
      description: "Статья блога успешно удалена"
    });
  };

  return (
    <>
      <Helmet>
        <title>Управление блогом | Админ панель</title>
      </Helmet>
      
      <BaseContentEditor
        title="Управление блогом"
        description="Редактирование статей, категорий и настройка страницы блога"
        onSave={handleSave}
      >
        <div className="space-y-6">
          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Настройки страницы блога</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Заголовок страницы</label>
                  <Input 
                    value={blogSettings.title}
                    onChange={(e) => setBlogSettings({...blogSettings, title: e.target.value})}
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Описание</label>
                  <Textarea 
                    value={blogSettings.description}
                    onChange={(e) => setBlogSettings({...blogSettings, description: e.target.value})}
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Статей на странице</label>
                    <Input 
                      type="number"
                      value={blogSettings.postsPerPage}
                      onChange={(e) => setBlogSettings({...blogSettings, postsPerPage: parseInt(e.target.value)})}
                      className="bg-black/20 border-white/10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Категория по умолчанию</label>
                    <Select defaultValue="SEO">
                      <SelectTrigger className="bg-black/20 border-white/10">
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SEO">SEO</SelectItem>
                        <SelectItem value="Оптимизация">Оптимизация</SelectItem>
                        <SelectItem value="Аналитика">Аналитика</SelectItem>
                        <SelectItem value="Технологии">Технологии</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Статьи блога</h3>
                <Dialog open={openNewPostDialog} onOpenChange={setOpenNewPostDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90" size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Добавить статью
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-black/80 border-white/10 text-white">
                    <DialogHeader>
                      <DialogTitle>Новая статья</DialogTitle>
                      <DialogDescription>Создайте новую статью для блога</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Заголовок*</label>
                        <Input 
                          placeholder="Введите заголовок статьи..."
                          value={newPost.title}
                          onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                          className="bg-black/20 border-white/10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Краткое описание</label>
                        <Textarea 
                          placeholder="Введите краткое описание статьи..."
                          value={newPost.excerpt}
                          onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                          className="bg-black/20 border-white/10"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Содержание*</label>
                        <Textarea 
                          placeholder="Введите содержание статьи..."
                          value={newPost.content}
                          onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                          className="bg-black/20 border-white/10"
                          rows={5}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Автор</label>
                          <Input 
                            placeholder="Имя автора"
                            value={newPost.author}
                            onChange={(e) => setNewPost({...newPost, author: e.target.value})}
                            className="bg-black/20 border-white/10"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Категория</label>
                          <Select 
                            value={newPost.category} 
                            onValueChange={(value) => setNewPost({...newPost, category: value})}
                          >
                            <SelectTrigger className="bg-black/20 border-white/10">
                              <SelectValue placeholder="Выберите категорию" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SEO">SEO</SelectItem>
                              <SelectItem value="Оптимизация">Оптимизация</SelectItem>
                              <SelectItem value="Аналитика">Аналитика</SelectItem>
                              <SelectItem value="Технологии">Технологии</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Дата публикации</label>
                          <Input 
                            type="date"
                            value={newPost.publishDate}
                            onChange={(e) => setNewPost({...newPost, publishDate: e.target.value})}
                            className="bg-black/20 border-white/10"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Статус</label>
                          <Select 
                            value={newPost.status} 
                            onValueChange={(value: 'draft' | 'published') => setNewPost({...newPost, status: value})}
                          >
                            <SelectTrigger className="bg-black/20 border-white/10">
                              <SelectValue placeholder="Выберите статус" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Черновик</SelectItem>
                              <SelectItem value="published">Опубликовано</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenNewPostDialog(false)} className="border-white/10">
                        Отмена
                      </Button>
                      <Button onClick={handleCreatePost} className="bg-primary hover:bg-primary/90">
                        Создать статью
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-4 mt-6">
                {blogPosts.map((post) => (
                  <div key={post.id} className="p-4 border border-white/10 rounded-md bg-black/20">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{post.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{post.publishDate}</span>
                          <span className="flex items-center gap-1"><User className="h-3 w-3" />{post.author}</span>
                          <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{post.category}</span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            post.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {post.status === 'published' ? 'Опубликовано' : 'Черновик'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{post.excerpt}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
                          <Edit className="h-3 w-3 mr-1" /> Редактировать
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" /> Удалить
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {blogPosts.length === 0 && (
                  <div className="p-8 text-center border border-dashed border-white/10 rounded-md bg-black/10">
                    <p className="text-gray-400">Статьи не найдены. Создайте новую статью.</p>
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

export default BlogEditor;
