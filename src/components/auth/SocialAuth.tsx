
import React from 'react';
import { Button } from "@/components/ui/button";

const SocialAuth: React.FC = () => {
  return (
    <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
      <p>Также войти через:</p>
      <div className="flex justify-center gap-4 mt-4">
        <Button variant="outline" size="sm">Google</Button>
        <Button variant="outline" size="sm">Facebook</Button>
      </div>
    </div>
  );
};

export default SocialAuth;
