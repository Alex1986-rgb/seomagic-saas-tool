
import React from 'react';
import { Form } from "@/components/ui/form";
import { usePositionTrackerForm } from './form/usePositionTrackerForm';
import { DomainAndSearchSection } from './form/DomainAndSearchSection';
import { TrackingOptionsSection } from './form/TrackingOptionsSection';
import { ProxyStatusAlert } from './form/ProxyStatusAlert';
import { KeywordsCard } from './form/KeywordsCard';
import { SubmitButton } from './form/SubmitButton';

interface PositionTrackerFormProps {
  onSearchComplete?: (results: any) => void;
}

export function PositionTrackerForm({ onSearchComplete }: PositionTrackerFormProps) {
  const {
    form,
    keywords,
    inputKeyword,
    isLoading,
    setInputKeyword,
    addKeyword,
    addMultipleKeywords,
    removeKeyword,
    handleBulkKeywords,
    handleFileUpload,
    onSubmit
  } = usePositionTrackerForm(onSearchComplete);

  const handleFormSubmit = form.handleSubmit(onSubmit);

  // Mock value for now, in a real app would come from a hook or context
  const hasActiveProxies = true; 

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="flex flex-col gap-4">
          <DomainAndSearchSection form={form} isLoading={isLoading} />
          
          <TrackingOptionsSection form={form} isLoading={isLoading} />
          
          <ProxyStatusAlert hasActiveProxies={hasActiveProxies} />
          
          <KeywordsCard
            inputKeyword={inputKeyword}
            setInputKeyword={setInputKeyword}
            addKeyword={addKeyword}
            addMultipleKeywords={addMultipleKeywords}
            removeKeyword={removeKeyword}
            keywords={keywords}
            handleBulkKeywords={handleBulkKeywords}
            handleFileUpload={handleFileUpload}
            isLoading={isLoading}
          />
          
          <SubmitButton 
            isLoading={isLoading} 
            hasKeywords={keywords.length > 0} 
          />
        </div>
      </form>
    </Form>
  );
}
