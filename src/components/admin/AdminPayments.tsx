
import React from 'react';
import { Calendar, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PaymentTable from './payments/PaymentTable';
import PaymentFilters from './payments/PaymentFilters';
import { usePayments } from './payments/usePayments';

const AdminPayments: React.FC = () => {
  const {
    searchTerm,
    statusFilter,
    handleSearchChange,
    handleStatusChange,
    filteredPayments
  } = usePayments();

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end justify-between">
        <PaymentFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
        />
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span>Фильтр по дате</span>
          </Button>

          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            <span>Экспорт</span>
          </Button>
        </div>
      </div>
      
      <PaymentTable payments={filteredPayments} />
    </div>
  );
};

export default AdminPayments;
