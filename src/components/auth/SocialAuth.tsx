
import React from 'react';
import { Button } from "@/components/ui/button";
import { Google, Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SocialAuth: React.FC = () => {
  const { toast } = useToast();
  
  const handleSocialLogin = (provider: string) => {
    toast({
      title: `${provider} авторизация`,
      description: "Эта функциональность еще в разработке",
    });
  };

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Или войдите через
          </span>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => handleSocialLogin('Google')}
        >
          <Google className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => handleSocialLogin('GitHub')}
        >
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>
    </div>
  );
};

export default SocialAuth;
