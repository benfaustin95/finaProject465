import { useAuth } from "@/Services/Auth.tsx";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
	const { token, userId, email } = useAuth();

	if (!token || !userId || !email) {
		alert("User Not Logged In");
		return <Navigate to="/" replace />;
	}
	return children;
};
