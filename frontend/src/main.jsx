import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import "./i18n/i18n";
import ClerkWrapper from "./ClerkWrapper";
import { CartProvider } from "./context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkWrapper>
      <CartProvider>
        <App />
      </CartProvider>
    </ClerkWrapper>
  </StrictMode>,
);
