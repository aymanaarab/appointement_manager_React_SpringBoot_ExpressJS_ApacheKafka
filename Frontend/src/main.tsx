import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@mantine/notifications/styles.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { AuthProvider } from "./Contexts/AuthContext.tsx";
// import { Notifications } from "@mantine/notifications";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <Notifications /> */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
