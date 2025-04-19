
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const GuideCallToAction: React.FC = () => {
  return (
    <div className="mt-12 pt-8 border-t">
      <h3 className="text-xl font-semibold mb-4">Готовы применить это руководство?</h3>
      <p className="mb-6">Используйте полученные знания для улучшения вашего SEO-продвижения и отслеживайте результаты.</p>
      
      <div className="flex flex-wrap gap-4">
        <Button asChild>
          <Link to="/audit">Запустить аудит сайта</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/guides">Другие руководства</Link>
        </Button>
      </div>
    </div>
  );
};

export default GuideCallToAction;
