
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Database, Server, Activity, Monitor, BarChart, Gauge } from "lucide-react";

interface SectionLink {
  label: string;
  description: string;
  to: string;
  icon: string;
}
interface Props {
  sectionLinks: SectionLink[];
}

const SectionLinks: React.FC<Props> = ({ sectionLinks }) => {
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'database': return <Database className="h-6 w-6" />;
      case 'server': return <Server className="h-6 w-6" />;
      case 'activity': return <Activity className="h-6 w-6" />;
      case 'monitor': return <Monitor className="h-6 w-6" />;
      case 'bar-chart': return <BarChart className="h-6 w-6" />;
      case 'gauge': return <Gauge className="h-6 w-6" />;
      default: return <Activity className="h-6 w-6" />;
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-3 bg-gradient-to-r from-[#9b87f5] to-[#0EA5E9] bg-clip-text text-transparent">Быстрый доступ к разделам управления</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sectionLinks.map((section) => (
          <Link key={section.to} to={section.to} className="group">
            <Card className="shadow border-0 bg-gradient-to-br from-[#1A1F2C]/80 via-[#28213a]/80 to-[#403E43]/80 backdrop-blur-sm hover:shadow-lg hover:from-[#1A1F2C]/90 hover:via-[#28213a] hover:to-[#403E43] transition-all duration-300">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="rounded-xl p-3 bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
                  {renderIcon(section.icon)}
                </div>
                <div>
                  <div className="text-lg font-bold group-hover:text-primary transition-colors duration-300">{section.label}</div>
                  <div className="text-xs text-muted-foreground">{section.description}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SectionLinks;
