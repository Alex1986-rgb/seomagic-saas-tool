
import React from 'react';
import { Calendar, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PaymentTable from './payments/PaymentTable';
import PaymentFilters from './payments/PaymentFilters';
import { usePayments } from './payments/usePayments';
import { AdminFormContainer, AdminFormTitle } from './AdminFormStyles';

const AdminPayments: React.FC = () => {
  const {
    searchTerm,
    statusFilter,
    handleSearchChange,
    handleStatusChange,
    filteredPayments
  } = usePayments();

  return (
    <AdminFormContainer>
      <AdminFormTitle>Управление платежами</AdminFormTitle>
      
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end justify-between">
          <PaymentFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
          />
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <Calendar className="h-4 w-4" />
              <span className="whitespace-nowrap">Фильтр по дате</span>
            </Button>

            <Button className="gap-2 w-full sm:w-auto">
              <FileText className="h-4 w-4" />
              <span>Экспорт</span>
            </Button>
          </div>
        </div>
        
        <PaymentTable payments={filteredPayments} />
      </div>
    </AdminFormContainer>
  );
};

export default AdminPayments;
