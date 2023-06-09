import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
const rootContainer: HTMLElement = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(rootContainer).render(
	<Auth0Provider
		domain={"dev-2dtmb35dmkdjhb8l.us.auth0.com"}
		clientId={"WTp4p0IS7rLzxWnDrIE9HJVEpsXwU3Uh"}
		useRefreshTokens={true}
		useRefreshTokensFallback={false}
		authorizationParams={{
			redirect_uri: "http://localhost:5173",
			audience: `https://dev-2dtmb35dmkdjhb8l.us.auth0.com/api/v2/`,
			scope: "openid profile email",
		}}>
		<React.StrictMode>
			<App />
		</React.StrictMode>
	</Auth0Provider>
);
