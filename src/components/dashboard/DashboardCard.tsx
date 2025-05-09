
import { ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DashboardCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  footer?: ReactNode;
  className?: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  children?: ReactNode;
  onClick?: () => void;
}

const DashboardCard = ({
  title,
  description,
  icon,
  footer,
  className,
  badge,
  badgeVariant = "secondary",
  children,
  onClick,
}: DashboardCardProps) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all hover:shadow-md",
        onClick ? "cursor-pointer" : "",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-muted-foreground">{icon}</div>}
          <CardTitle className="text-md font-semibold">{title}</CardTitle>
        </div>
        {badge && (
          <Badge variant={badgeVariant}>{badge}</Badge>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter className="border-t pt-3">{footer}</CardFooter>}
    </Card>
  );
};

export default DashboardCard;

// Helper function from utils.ts to avoid circular dependencies
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
