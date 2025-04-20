
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface SectionLink {
  label: string;
  description: string;
  to: string;
  icon: React.ReactNode;
}
interface Props {
  sectionLinks: SectionLink[];
}
const SectionLinks: React.FC<Props> = ({ sectionLinks }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-3">Быстрый доступ к разделам управления</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {sectionLinks.map((section) => (
        <Link key={section.to} to={section.to} className="group">
          <Card className="shadow hover:shadow-lg hover:bg-primary/5 transition-all">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="rounded-xl p-3 bg-secondary/80 group-hover:bg-primary/10">{section.icon}</div>
              <div>
                <div className="text-lg font-bold">{section.label}</div>
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
