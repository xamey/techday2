import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, User, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock user data - would come from auth context in a real app
  const user = {
    username: "xameyz",
    name: "Xameyz",
    profilePicture:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const NavItems = () => (
    <>
      <Button
        variant="ghost"
        className="flex items-center space-x-2 w-full justify-start"
        asChild
      >
        <Link to="/">
          <Home className="h-5 w-5" />
          <span className={cn(isMobile ? "" : "ml-2")}>Home</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="flex items-center space-x-2 w-full justify-start"
        asChild
      >
        <Link to={`/profile/${user.username}`}>
          <User className="h-5 w-5" />
          <span className={cn(isMobile ? "" : "ml-2")}>Profile</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="flex items-center space-x-2 w-full justify-start"
      >
        <LogOut className="h-5 w-5" />
        <span className={cn(isMobile ? "" : "ml-2")}>Logout</span>
      </Button>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="w-64 border-r border-border p-4 flex flex-col space-y-4 fixed h-full">
          <div className="mb-6 px-2">
            <div className="text-twitter-blue text-2xl font-bold">Chirper</div>
          </div>

          <nav className="flex flex-col space-y-1">
            <NavItems />
          </nav>

          <div className="mt-auto">
            <div className="flex items-center space-x-2 p-2 rounded-full hover:bg-muted cursor-pointer twitter-transition">
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border border-border"
              />
              <div className="flex-1 hidden lg:block">
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm text-muted-foreground">
                  @{user.username}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 h-14 border-b border-border bg-background/80 backdrop-blur-md z-50 flex items-center justify-between px-4">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          <div className="text-twitter-blue text-xl font-bold">Chirper</div>

          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
        </header>
      )}

      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 animate-fade-in"
          onClick={toggleMobileMenu}
        >
          <div
            className="fixed left-0 top-14 bottom-0 w-64 bg-background border-r border-border p-4 animate-slide-right"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col space-y-1">
              <NavItems />
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          isMobile ? "pt-14" : "ml-64"
        )}
      >
        <div className="max-w-2xl mx-auto h-full">{children}</div>
      </main>
    </div>
  );
}
