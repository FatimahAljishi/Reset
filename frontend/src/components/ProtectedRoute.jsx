import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  return (
    <>
      <SignedIn>{children}</SignedIn>

      <SignedOut>
        <Navigate to="/login" replace state={{ from: location.pathname }} />
      </SignedOut>
    </>
  );
}
