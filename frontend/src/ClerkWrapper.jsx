import { ClerkProvider } from "@clerk/clerk-react";
import { arSA, enUS } from "@clerk/localizations";
import { useTranslation } from "react-i18next";

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

console.log("Clerk key:", clerkKey);

export default function ClerkWrapper({ children }) {
  const { i18n } = useTranslation();

  return (
    <ClerkProvider
      publishableKey={clerkKey}
      localization={i18n.language.startsWith("ar") ? arSA : enUS}
    >
      {children}
    </ClerkProvider>
  );
}
