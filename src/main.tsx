import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App.tsx";
import "./index.css";

const auth0Domain =
    import.meta.env.VITE_AUTH0_DOMAIN || "yudhisteer.jp.auth0.com";
const auth0ClientId =
    import.meta.env.VITE_AUTH0_CLIENT_ID || "poljwOzivWs0EAyZOg6tkXIW8FXVTw8x";
const auth0RedirectUri =
    import.meta.env.VITE_AUTH0_REDIRECT_URI || "https://somthing.app";

createRoot(document.getElementById("root")!).render(
    <Auth0Provider
        domain={auth0Domain}
        clientId={auth0ClientId}
        authorizationParams={{ redirect_uri: auth0RedirectUri }}
    >
        <App />
    </Auth0Provider>,
);
