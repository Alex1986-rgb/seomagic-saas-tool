
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface UrlInputProps {
  url: string;
  isValid: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ url, isValid, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="url">URL сайта</Label>
      <div className="flex space-x-2">
        <Input 
          id="url" 
          placeholder="example.com" 
          value={url} 
          onChange={onChange}
        />
        {isValid && url && (
          <Button variant="outline" asChild>
            <a 
              href={url.startsWith('http') ? url : `https://${url}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
      {url && !isValid && (
        <p className="text-sm text-destructive">Пожалуйста, введите корректный URL</p>
      )}
    </div>
  );
};

export default UrlInput;
