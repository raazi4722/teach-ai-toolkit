
import { Link, useLocation } from "react-router-dom";
import { 
  File, 
  LayoutDashboard,
  Book,
  ListOrdered,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Lesson Creator",
      href: "/generator",
      icon: File,
    },
    {
      title: "My Library",
      href: "/library",
      icon: Book,
    },
    {
      title: "Quiz Bank",
      href: "/quizzes",
      icon: ListOrdered,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="w-64 border-r bg-background h-[calc(100vh-4rem)] flex-shrink-0">
      <div className="py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Main Menu
          </h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  currentPath === item.href
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50 hover:text-accent-foreground"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
        <Separator className="my-4" />
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Recent Subjects
          </h2>
          <div className="space-y-1">
            <button className="w-full flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent/50 hover:text-accent-foreground transition-colors">
              Physics
            </button>
            <button className="w-full flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent/50 hover:text-accent-foreground transition-colors">
              World History
            </button>
            <button className="w-full flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent/50 hover:text-accent-foreground transition-colors">
              Literature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
