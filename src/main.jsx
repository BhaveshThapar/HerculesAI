import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { UserProfileProvider } from "./context/UserProfileContext";
import { OnboardingProvider } from "./context/OnboardingContext";
import { FitnessProvider } from "./context/FitnessContext";
import { MLProvider } from "./context/MLContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <AuthContextProvider>
      <UserProfileProvider>
        <OnboardingProvider>
          <FitnessProvider>
            <MLProvider>
        <RouterProvider router={router} />
            </MLProvider>
          </FitnessProvider>
        </OnboardingProvider>
      </UserProfileProvider>
      </AuthContextProvider>
  </React.StrictMode>
);