import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from "@/Services/Auth.tsx";

export function HomePage() {
	const { isAuthenticated } = useAuth0();
	const { handleToken } = useAuth();
	useEffect(() => {
		void handleToken().catch((err) => {
			console.log(err);
		});
		console.log('auth: ', isAuthenticated);
	}, [isAuthenticated]);

	return (
		<>
			{" "}
			<Home />
		</>
	);
}
export const Home = () => {
	return (
		<div
			className={
				"flex flex-col items-center justify-center " +
				"outline outline-offset-4 drop-shadow text-slate-50 bg-light w-80 h-80 mx-auto mt-24"
			}>
			<Title />
		</div>
	);
};

export function Title() {
	return <h1 className={"text-dark mb-4 mx-1"}>Retire Maybe</h1>;
}
