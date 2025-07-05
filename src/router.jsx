import { createBrowserRouter } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import SignupPage from "./pages/Signup";
import About from "./pages/About";
import OnboardingWrapper from "./pages/Onboarding/OnboardingWrapper";
import Dashboard from "./pages/Dashboard";
import Workout from "./pages/Workout";
import Nutrition from "./pages/Nutrition";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import MLDemo from "./pages/MLDemo";
import MLPage from "./pages/MLPage";
import PrivateRoute from "./components/PrivateRoute";

export const router = createBrowserRouter([
  { path: "/", element: <Homepage /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/about", element: <About /> },
  { path: "/ml-demo", element: <MLDemo /> },
  {
    path: "/ai-assistant",
    element: (
      <PrivateRoute>
        <MLPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/onboarding",
    element: (
      <PrivateRoute>
        <OnboardingWrapper />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/workout",
    element: (
      <PrivateRoute>
        <Workout />
      </PrivateRoute>
    ),
  },
  {
    path: "/nutrition",
    element: (
      <PrivateRoute>
        <Nutrition />
      </PrivateRoute>
    ),
  },
  {
    path: "/progress",
    element: (
      <PrivateRoute>
        <Progress />
      </PrivateRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <PrivateRoute>
        <Settings />
      </PrivateRoute>
    ),
  },
]);