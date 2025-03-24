
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background animate-fade-in">
      <div className="max-w-md w-full text-center space-y-6 glass-effect p-8 rounded-xl">
        <div className="text-twitter-blue font-bold text-5xl">404</div>
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="rounded-full">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
