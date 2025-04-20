
import React from 'react';
import { Search, FileSpreadsheet, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormFields } from './form/FormFields';
import { KeywordTabs } from './form/KeywordTabs';
import { KeywordsList } from './form/KeywordsList';
import { usePositionTrackerForm } from './form/usePositionTrackerForm';

interface PositionTrackerFormProps {
  onSearchComplete?: Function;
}

export const PositionTrackerForm: React.FC<PositionTrackerFormProps> = ({ onSearchComplete }) => {
  const {
    form,
    keywords,
    inputKeyword,
    isLoading,
    setInputKeyword,
    addKeyword,
    removeKeyword,
    handleBulkKeywords,
    handleFileUpload,
    onSubmit
  } = usePositionTrackerForm(onSearchComplete);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormFields form={form} />
            </div>
            
            <div>
              <KeywordTabs
                inputKeyword={inputKeyword}
                setInputKeyword={setInputKeyword}
                addKeyword={addKeyword}
                handleBulkKeywords={handleBulkKeywords}
                handleFileUpload={handleFileUpload}
              />
              
              <KeywordsList
                keywords={keywords}
                removeKeyword={removeKeyword}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Импорт из Excel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Проверка...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Проверить позиции
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
