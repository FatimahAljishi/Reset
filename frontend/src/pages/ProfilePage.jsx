import { useNavigate } from "react-router-dom";
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
            <button
              className="profile-btn"
              onClick={() => navigate("/profile/settings")}
            >
              {t("profile.manageAccount")}
            </button>

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
