import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from "@/Services/Auth.tsx";

export function HomePage() {
	const { isAuthenticated } = useAuth0();
	const { handleToken } = useAuth();
	useEffect(() => {
		handleToken().catch((err) => {
			console.log(err);
		});
	}, [isAuthenticated]);

	return <></>;
}
