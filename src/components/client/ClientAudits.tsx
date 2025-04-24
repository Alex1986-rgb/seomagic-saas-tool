import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { AuditCard } from './audits/AuditCard';
import { AuditFilters } from './audits/AuditFilters';
import { EmptyAuditState } from './audits/EmptyAuditState';

// Мок-данные аудитов пользователя
const mockUserAudits = [
  {
    id: '1',
    url: 'https://example.com',
    score: 78,
    date: '2023-06-08T14:30:00Z',
    status: 'completed',
    issues: { critical: 3, important: 8, opportunities: 12 },
    optimized: true,
  },
  {
    id: '2',
    url: 'https://mywebsite.ru',
    score: 45,
    date: '2023-06-07T09:15:00Z',
    status: 'completed',
    issues: { critical: 12, important: 15, opportunities: 7 },
    optimized: false,
  },
  {
    id: '3',
    url: 'https://shop.example.com',
    score: 92,
    date: '2023-06-06T10:20:00Z',
    status: 'completed',
    issues: { critical: 0, important: 4, opportunities: 8 },
    optimized: true,
  },
  {
    id: '4',
    url: 'https://blog.mywebsite.ru',
    score: null,
    date: '2023-06-08T16:45:00Z',
    status: 'processing',
    issues: null,
    optimized: false,
  },
];

interface ClientAuditsProps {
  onStartNewAudit?: () => void;
}

const ClientAudits: React.FC<ClientAuditsProps> = ({ onStartNewAudit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const filteredAudits = mockUserAudits.filter(audit => 
    audit.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewAudit = () => {
    if (onStartNewAudit) {
      onStartNewAudit();
    } else {
      navigate('/audit');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Ваши SEO аудиты</h2>
        <Button className="gap-2" onClick={handleNewAudit}>
          <FileText className="h-4 w-4" />
          <span>Новый аудит</span>
        </Button>
      </div>
      
      <AuditFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <div className="space-y-4">
        {filteredAudits.length === 0 ? (
          <EmptyAuditState onStartNewAudit={handleNewAudit} />
        ) : (
          filteredAudits.map(audit => (
            <AuditCard key={audit.id} audit={audit} />
          ))
        )}
      </div>
    </div>
  );
};

export default ClientAudits;
