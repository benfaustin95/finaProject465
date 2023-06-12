import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
const rootContainer: HTMLElement = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(rootContainer).render(
	<Auth0Provider
		domain={import.meta.env.AUTH_DOMAIN}
		clientId={import.meta.env.AUTH_CLIENT}
		useRefreshTokens={true}
		useRefreshTokensFallback={false}
		authorizationParams={{
			redirect_uri: import.meta.env.AUTH_REDIRECT,
			audience: import.meta.env.AUTH_AUD,
			scope: import.meta.env.AUTH_SCOPE,
		}}>
		<React.StrictMode>
			<App />
		</React.StrictMode>
	</Auth0Provider>
);
