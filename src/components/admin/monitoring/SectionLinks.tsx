
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

const iconMap = {
  database: <Database className="h-8 w-8 text-[#3B82F6] drop-shadow-xl" />,
  server: <Server className="h-8 w-8 text-[#8B5CF6] drop-shadow-xl" />,
  activity: <Activity className="h-8 w-8 text-[#14CC8C] drop-shadow-xl" />,
  monitor: <Monitor className="h-8 w-8 text-[#F6C778] drop-shadow-xl" />,
  "bar-chart": <BarChart className="h-8 w-8 text-[#F97316] drop-shadow-xl" />,
  gauge: <Gauge className="h-8 w-8 text-[#36CFFF] drop-shadow-xl" />,
};

const SectionLinks: React.FC<Props> = ({ sectionLinks }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold font-playfair mb-3 bg-gradient-to-r from-[#9b87f5] to-[#0EA5E9] bg-clip-text text-transparent">Быстрый доступ к разделам управления</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
      {sectionLinks.map((section) => (
        <Link key={section.to} to={section.to} className="group">
          <Card className="shadow border-0 bg-gradient-to-br from-[#1A1F2C]/85 via-[#28213a]/80 to-[#403E43]/80 glass-morphism hover:shadow-lg hover:scale-[1.03] transition-all duration-300">
            <CardContent className="flex items-center gap-5 py-6">
              <div className="rounded-xl p-3 bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
                {iconMap[section.icon] ?? <Activity className="h-8 w-8 text-primary" />}
              </div>
              <div>
                <div className="text-base font-bold font-playfair group-hover:text-primary transition-colors duration-300">{section.label}</div>
                <div className="text-xs text-muted-foreground">{section.description}</div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  </div>
);

export default SectionLinks;
