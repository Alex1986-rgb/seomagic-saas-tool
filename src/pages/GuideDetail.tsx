
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';

const GuideDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <Card>
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold mb-6">Руководство #{id}</h1>
            <p className="text-muted-foreground">
              Подробная информация о руководстве будет добавлена позже.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default GuideDetail;
