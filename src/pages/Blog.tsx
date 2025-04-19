import React from 'react';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

const Blog: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Блог</h1>
              <p className="text-lg text-muted-foreground">
                Последние новости, руководства и советы по SEO оптимизации
              </p>
            </div>
            
            <div className="w-full md:w-auto flex gap-2">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск статей..."
                  className="pl-8"
                />
              </div>
              <Button>
                Категории
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for blog posts - to be implemented */}
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Блог находится в разработке...
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
