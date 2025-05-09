
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleLogout = () => {
    // In a real app, this would log out with Supabase
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <nav className="bg-card border-b px-4 py-3 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/dashboard" className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-education-indigo to-education-purple flex items-center justify-center text-white font-bold">
              T
            </div>
            <span className="ml-2 font-bold text-lg hidden md:block">Teacher Toolkit</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link 
            to="/dashboard" 
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            to="/generator" 
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Create
          </Link>
          <Link 
            to="/library" 
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Library
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-9 w-9"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-2 pb-4 px-4 border-t animate-fade-in">
          <div className="flex flex-col space-y-3">
            <Link 
              to="/dashboard"
              className="px-2 py-1 hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/generator"
              className="px-2 py-1 hover:bg-muted rounded-md" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Create
            </Link>
            <Link 
              to="/library"
              className="px-2 py-1 hover:bg-muted rounded-md" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Library
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="justify-start"
            >
              Logout
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
