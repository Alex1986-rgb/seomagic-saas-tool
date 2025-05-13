
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NAV_ITEMS, CLIENT_ITEMS, RESOURCE_ITEMS, COMPANY_ITEMS, FEATURES_ITEMS, SUPPORT_ITEMS } from '@/components/navbar/navConstants';

// Helper function to flatten nested navigation items
const flattenNavItems = (items) => {
  return items.reduce((acc, item) => {
    acc.push({ label: item.label, href: item.href });
    if (item.children) {
      item.children.forEach(child => {
        acc.push({ label: child.label, href: child.href });
      });
    }
    return acc;
  }, []);
};

const AllPages: React.FC = () => {
  // Get all unique pages across navigation items
  const allNavItems = [
    ...flattenNavItems(NAV_ITEMS),
    ...flattenNavItems(CLIENT_ITEMS),
    ...flattenNavItems(RESOURCE_ITEMS),
    ...flattenNavItems(COMPANY_ITEMS),
    ...flattenNavItems(FEATURES_ITEMS),
    ...flattenNavItems(SUPPORT_ITEMS)
  ];

  // Remove duplicates
  const uniquePages = Array.from(new Set(allNavItems.map(item => item.href)))
    .map(href => {
      return allNavItems.find(item => item.href === href);
    });

  // Group pages by category
  const categories = {
    main: uniquePages.filter(page => !page.href.includes('/')),
    content: uniquePages.filter(page => page.href.includes('/') && !page.href.includes('admin')),
    admin: uniquePages.filter(page => page.href.includes('admin')),
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Все страницы сайта</h1>
          <p className="text-lg text-muted-foreground text-center mb-12">
            Полный список всех страниц и разделов нашего сайта
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card>
              <CardHeader>
                <CardTitle>Основные страницы</CardTitle>
                <CardDescription>Главные разделы сайта</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {categories.main.map((page, index) => (
                    <li key={index}>
                      <Link 
                        to={page.href} 
                        className="block p-2 rounded-md hover:bg-accent transition-colors"
                      >
                        {page.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Контент</CardTitle>
                <CardDescription>Статьи, документация и справка</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {categories.content.map((page, index) => (
                    <li key={index}>
                      <Link 
                        to={page.href} 
                        className="block p-2 rounded-md hover:bg-accent transition-colors"
                      >
                        {page.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Административные</CardTitle>
                <CardDescription>Панель администратора и настройки</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {categories.admin.map((page, index) => (
                    <li key={index}>
                      <Link 
                        to={page.href} 
                        className="block p-2 rounded-md hover:bg-accent transition-colors"
                      >
                        {page.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link 
                      to="/admin" 
                      className="block p-2 rounded-md hover:bg-accent transition-colors font-medium text-primary"
                    >
                      Админ-панель
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllPages;
