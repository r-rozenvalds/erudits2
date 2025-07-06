import { Navigate, useLocation } from "react-router-dom";
import { userStore } from "../../stores/UserStore";
import { useEffect, useState } from "react";
import { SpinnerCircularFixed } from "spinners-react";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user, getUser } = userStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const userIsLoggedIn = user ? true : await getUser();
      setIsAuthenticated(userIsLoggedIn);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex place-items-center justify-center min-h-screen overflow-x-hidden bg-gradient-to-r from-[#31587A] to-[#3C3266]">
        <SpinnerCircularFixed size={24} thickness={240} color="#fff" />
        <p className="ms-2 text-white font-semibold text-xl">
          Lūdzu, uzgaidiet!
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};
