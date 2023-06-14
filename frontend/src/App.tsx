import { RetireMaybeRouter } from "@/AppRoutes.tsx";
import { BrowserRouter } from "react-router-dom";
import "@css/AppStyles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "@/Services/Auth.tsx";
import { useAuth0 } from "@auth0/auth0-react";
import { Container } from "react-bootstrap";
// This is our base React Component
export function App() {
	const { isLoading } = useAuth0();

	if (isLoading) {
		return (
			<Container className={"bg-sky-950"}>
				<h1>Page Loading</h1>
			</Container>
		);
	}
	return (
		<BrowserRouter>
			<AuthProvider>
				<div className="App retMaybe">
					<RetireMaybeRouter />
				</div>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
