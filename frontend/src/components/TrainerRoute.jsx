import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

function TrainerRoute({ children }) {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  const isTrainer = user.publicMetadata?.role === "trainer";

  if (!isTrainer) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default TrainerRoute;
