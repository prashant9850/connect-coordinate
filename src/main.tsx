import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { NotificationProvider } from "@/context/NotificationProvider";
import { AuthProvider } from "@/context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </AuthProvider>,
);
