import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "react-bootstrap";
import { useAuth } from "@/Services/Auth.tsx";

export function LoginButton() {
	const { loginWithRedirect } = useAuth0();
	return (
		<Button className={"ml-5"} onClick={async () => loginWithRedirect()}>
			Log In
		</Button>
	);
}
