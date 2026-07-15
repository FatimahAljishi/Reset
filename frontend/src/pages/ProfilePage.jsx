import { useNavigate, Link } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import "./ProfilePage.css";
import Navbar from "../components/Navbar";
import { useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const { t } = useTranslation();

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <>
      <Navbar />

      <main className="profile-page">
        <section className="profile-card">
          <h1>
            {t("profile.welcome")}, {user.fullName}!
          </h1>

          <div className="profile-actions">
            <Link to="/profile/settings" className="profile-btn">
              {t("profile.manageAccount")}
            </Link>

            <Link to="/my-orders" className="profile-btn">
              {t("myOrders.title")}
            </Link>

            <button
              className="profile-btn profile-btn-secondary"
              onClick={() => signOut({ redirectUrl: "/" })}
            >
              {t("profile.signOut")}
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
