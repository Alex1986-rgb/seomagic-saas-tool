
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, MessageSquare, Send, User, Trash2, Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  date: string;
  text: string;
  isCurrentUser: boolean;
}

interface AuditCommentsProps {
  auditId: string;
}

// Демонстрационные данные для примера
const demoComments: Comment[] = [
  {
    id: '1',
    author: 'Иван Петров',
    authorAvatar: 'https://i.pravatar.cc/150?img=1',
    date: '2023-05-20T14:32:00',
    text: 'Согласно аудиту, основные проблемы связаны с SEO оптимизацией. Рекомендую обратить внимание на мета-теги и оптимизацию заголовков.',
    isCurrentUser: false
  },
  {
    id: '2',
    author: 'Вы',
    date: '2023-05-21T09:15:00',
    text: 'Исправил проблемы с мета-тегами и добавил альтернативные тексты для изображений. Теперь нужно поработать над скоростью загрузки страниц.',
    isCurrentUser: true
  }
];

const AuditComments: React.FC<AuditCommentsProps> = ({ auditId }) => {
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>(demoComments);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const { toast } = useToast();

  const handleSubmitComment = () => {
    if (!newComment.trim()) {
      toast({
        title: "Комментарий пуст",
        description: "Пожалуйста, введите текст комментария",
        variant: "destructive"
      });
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'Вы',
      date: new Date().toISOString(),
      text: newComment.trim(),
      isCurrentUser: true
    };

    setComments([...comments, comment]);
    setNewComment('');
    
    toast({
      title: "Комментарий добавлен",
      description: "Ваш комментарий успешно добавлен к аудиту"
    });
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.text);
  };

  const handleSaveEdit = (commentId: string) => {
    if (!editingText.trim()) {
      toast({
        title: "Комментарий пуст",
        description: "Комментарий не может быть пустым",
        variant: "destructive"
      });
      return;
    }

    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, text: editingText } 
        : comment
    ));
    
    setEditingCommentId(null);
    setEditingText('');
    
    toast({
      title: "Комментарий изменен",
      description: "Ваш комментарий успешно отредактирован"
    });
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter(comment => comment.id !== commentId));
    
    toast({
      title: "Комментарий удален",
      description: "Комментарий был успешно удален"
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="neo-card p-6 mb-8">
      <div 
        className="flex justify-between items-center mb-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Комментарии к аудиту
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
            {comments.length}
          </span>
          {expanded ? 
            <ChevronUp className="h-5 w-5 text-muted-foreground" /> : 
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          }
        </h2>
      </div>

      <motion.div
        className="overflow-hidden"
        initial={{ height: 0 }}
        animate={{ height: expanded ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-6">
          {/* Список комментариев */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                Комментариев пока нет. Будьте первым, кто прокомментирует результаты аудита.
              </p>
            ) : (
              comments.map(comment => (
                <motion.div
                  key={comment.id}
                  className={`p-4 rounded-lg ${
                    comment.isCurrentUser ? 'bg-primary/5 ml-6' : 'bg-muted/30 mr-6'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      {comment.authorAvatar ? (
                        <AvatarImage src={comment.authorAvatar} alt={comment.author} />
                      ) : (
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{comment.author}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(comment.date)}</p>
                        </div>
                        
                        {comment.isCurrentUser && (
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleEditComment(comment)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:text-destructive/90"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      {editingCommentId === comment.id ? (
                        <div className="mt-2">
                          <Textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="mb-2"
                            rows={3}
                          />
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingCommentId(null)}
                            >
                              Отмена
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleSaveEdit(comment.id)}
                            >
                              Сохранить
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-2">{comment.text}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Форма добавления комментария */}
          <div className="pt-4 border-t">
            <h3 className="text-md font-medium mb-3">Добавить комментарий</h3>
            <Textarea
              placeholder="Введите ваш комментарий здесь..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-3"
              rows={4}
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmitComment} className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Отправить
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuditComments;
