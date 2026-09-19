
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

/**
 * Заметки к аудиту.
 *
 * Раньше блок назывался «Комментарии к аудиту», открывался с чужим
 * комментарием «Иван Петров» (выдуманный автор, фото с сервиса случайных
 * аватаров) и на каждое действие отвечал «Комментарий добавлен к аудиту».
 * На самом деле ничего не сохранялось: таблицы для комментариев в базе нет,
 * всё пропадало при обновлении страницы. Теперь список пуст, а блок прямо
 * говорит, что заметки живут только до закрытия страницы.
 */
const AuditComments: React.FC<AuditCommentsProps> = ({ auditId }) => {
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const { toast } = useToast();

  const handleSubmitComment = () => {
    if (!newComment.trim()) {
      toast({
        title: "Заметка пуста",
        description: "Введите текст заметки",
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
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.text);
  };

  const handleSaveEdit = (commentId: string) => {
    if (!editingText.trim()) {
      toast({
        title: "Заметка пуста",
        description: "Заметка не может быть пустой",
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
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter(comment => comment.id !== commentId));
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
          Заметки к аудиту
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
          <p className="text-sm text-muted-foreground">
            Заметки не сохраняются: их видите только вы, и они пропадут после
            обновления или закрытия страницы.
          </p>

          {/* Список заметок */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                Заметок пока нет.
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
            <h3 className="text-md font-medium mb-3">Добавить заметку</h3>
            <Textarea
              placeholder="Текст заметки..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-3"
              rows={4}
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmitComment} className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Добавить
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuditComments;
