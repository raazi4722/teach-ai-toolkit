
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ResourceCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  bgColor: string;
  onClick?: () => void;
}

const ResourceCard = ({ title, description, icon, bgColor, onClick }: ResourceCardProps) => {
  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer",
        bgColor
      )}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="mb-4 text-white">{icon}</div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-white/80">{description}</p>
      </div>
    </Card>
  );
};

export default ResourceCard;
