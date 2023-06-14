import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "react-bootstrap";
import { useAuth } from "@/Services/Auth.tsx";

export function LogOutButton() {
	const { handleLogout } = useAuth();

	return (
		<Button className={"ml-5"} onClick={() => handleLogout()}>
			Log Out
		</Button>
	);
}
