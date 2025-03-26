
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, AlertCircle, Lightbulb, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { RecommendationData } from '@/types/audit';

interface AuditRecommendationsProps {
  recommendations: RecommendationData;
}

const AuditRecommendations: React.FC<AuditRecommendationsProps> = ({ recommendations }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>("critical");
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(text);
    toast({
      title: "Скопировано",
      description: "Рекомендация скопирована в буфер обмена",
    });
    
    setTimeout(() => {
      setCopiedItem(null);
    }, 2000);
  };

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const sections = [
    { 
      id: "critical", 
      title: "Критические ошибки", 
      icon: AlertTriangle, 
      items: recommendations.critical,
      borderColor: "border-red-500",
      bgColor: "bg-red-900/20",
      hoverBgColor: "hover:bg-red-900/30",
      textColor: "text-red-400",
      description: "Эти проблемы серьезно влияют на ваш SEO рейтинг и требуют немедленного внимания."
    },
    { 
      id: "important", 
      title: "Важные улучшения", 
      icon: AlertCircle, 
      items: recommendations.important,
      borderColor: "border-amber-500",
      bgColor: "bg-amber-900/20",
      hoverBgColor: "hover:bg-amber-900/30",
      textColor: "text-amber-400",
      description: "Исправление этих проблем значительно улучшит производительность вашего сайта."
    },
    { 
      id: "opportunities", 
      title: "Возможности для улучшения", 
      icon: Lightbulb, 
      items: recommendations.opportunities,
      borderColor: "border-green-500",
      bgColor: "bg-green-900/20",
      hoverBgColor: "hover:bg-green-900/30",
      textColor: "text-green-400",
      description: "Эти изменения помогут оптимизировать сайт и улучшить пользовательский опыт."
    },
  ];

  return (
    <div className="neo-card p-6 mb-8">
      <h2 className="text-xl font-semibold mb-6">Рекомендации по оптимизации</h2>
      
      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.id;
          
          return (
            <motion.div 
              key={section.id}
              className={`border-l-4 ${section.borderColor} ${section.bgColor} rounded overflow-hidden`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div 
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-opacity-80 transition-all"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${section.textColor}`} />
                  <h3 className="font-medium text-foreground">{section.title}</h3>
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full bg-background/40 text-foreground`}>
                    {section.items.length}
                  </span>
                </div>
                
                <div>
                  {isExpanded ? 
                    <ChevronUp className="h-5 w-5 text-muted-foreground" /> : 
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  }
                </div>
              </div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`px-4 pb-4 ${section.bgColor}`}
                  >
                    <p className="text-sm text-foreground/80 mb-3">{section.description}</p>
                    <ul className="mt-2 space-y-2 reveal-list">
                      {section.items.map((item, index) => (
                        <motion.li 
                          key={`${section.id}-${index}`}
                          className={`flex justify-between py-2 px-3 rounded-md ${section.bgColor} ${section.hoverBgColor} transition-colors text-foreground`}
                          whileHover={{ x: 3 }}
                        >
                          <span>{item}</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(item);
                            }}
                            className="p-1 rounded-md hover:bg-background/20 transition-colors"
                            title="Скопировать"
                          >
                            {copiedItem === item ? 
                              <Check className="h-4 w-4 text-green-400" /> : 
                              <Copy className="h-4 w-4 text-muted-foreground" />
                            }
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AuditRecommendations;
