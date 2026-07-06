import { UserProfile } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import "./ProfileSettingsPage.css";

export default function ProfileSettingsPage() {
  return (
    <>
      <Navbar />
      <div className="profile-settings-page">
        <UserProfile />
      </div>
    </>
  );
}
