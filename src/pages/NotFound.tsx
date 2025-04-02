
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-2">Page Not Found</p>
        <p className="text-gray-500 mb-6">
          The page you are looking for doesn't exist or you may not have permission to access it.
        </p>
        <div className="space-y-2">
          <Button asChild className="w-full bg-[#F97316] hover:bg-[#FB923C]">
            <Link to="/">Return to Home</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
