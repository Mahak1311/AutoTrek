import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8 inline-flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur opacity-75 animate-pulse" />
            <div className="relative bg-black p-4 rounded-full">
              <AlertCircle className="h-12 w-12 text-cyan-400" />
            </div>
          </div>
        </div>

        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-2xl text-purple-200 mb-2">Oops! Page not found</p>
        <p className="text-lg text-purple-300 mb-8 max-w-md">
          The page you're looking for doesn't exist. Let's get you back to
          planning your perfect trip!
        </p>

        <Button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-lg"
        >
          Return to AutoTrek
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
