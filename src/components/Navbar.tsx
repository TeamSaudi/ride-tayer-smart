import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MapPin, Users, Star, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import tayerNewLogo from "@/assets/tayer-new-logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: MapPin },
    { name: "Find Transport", href: "/transport", icon: MapPin },
    { name: "Reviews", href: "/reviews", icon: Star },
    { name: "AI Insights", href: "/ai-insights", icon: Brain },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img src={tayerNewLogo} alt="Tayer" className="h-12 w-12" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                TAYER
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-primary p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium",
                    location.pathname === item.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="flex flex-col space-y-2 pt-4 mt-4 border-t border-border">
              <Button variant="ghost" asChild>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;