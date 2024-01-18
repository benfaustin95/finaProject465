import { httpClient } from "@/Services/HttpClient.tsx";
import { createContext, useContext, useEffect, useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Simulate } from "react-dom/test-utils";
import waiting = Simulate.waiting;
import { GetUserProfileService } from "@/Services/GetUserProfileService.tsx";
import React from "react";
const serverIP = import.meta.env.API_HOST;
export const AuthContext = createContext<AuthContextProps | null>(null);

export type AuthContextProps = {
	token: string | null;
	userId: number;
	email: string;
	handleToken: () => Promise<boolean>;
	handleLogout: () => void;
	updateUserID: (id: number) => void;
};

const updateAxios = async (token: string) => {
	httpClient.interceptors.request.use(
		async (config) => {
			// @ts-ignore
			config.headers = {
				Authorization: `Bearer ${token}`,
				Accept: "application/json",
			};
			return config;
		},
		(error) => {
			console.error("REJECTED TOKEN PROMISE");
			Promise.reject(error);
		}
	);
};

let initialToken = getToken();
let initialEmail;
let initialUserID;
if (!(initialToken == null)) {
	try {
		await updateAxios(initialToken);
		initialEmail = getUserItemFromToken(initialToken, import.meta.env.AUTH_EMAIL_KEY);
		await GetUserProfileService.send(initialEmail)
			.then((res) => {
				if (res.status != 200) throw new Error("error here initial token");
				return res.data;
			})
			.then((res) => {
				initialUserID = res.id;
			})
			.catch((err) => {
				initialEmail = null;
				initialToken = null;
			});
	} catch (err) {
		initialEmail = null;
		initialToken = null;
	}
}

export const AuthProvider = ({ children }: any) => {
	const navigate = useNavigate();

	const [token, setToken] = useState(initialToken);
	const [email, setEmail] = useState(initialEmail);
	const [userId, setUserId] = useState(initialUserID);
	const { getAccessTokenSilently, isAuthenticated, logout } = useAuth0();

	const handleToken = async () => {
		let token;
		let email;
		try {
			if (isAuthenticated) {
				token = await getAccessTokenSilently();
				console.log(token);
				await updateAxios(token);
				email = getUserItemFromToken(token, import.meta.env.AUTH_EMAIL_KEY);
				setEmail(email);
				saveToken(token);
				await GetUserProfileService.send(email)
					.then((res) => {
						if (res.status != 200) throw new Error("bad login no profile");
						return res.data;
					})
					.then((res) => {
						setUserId((userId) => res.id);
					})
					.catch((err) => {
						throw new Error(err);
					});
				navigate("/");
			} else {
				navigate("/");
			}
			return true;
		} catch (err) {
			console.error("Failed to handle login: ", err);
			await handleLogout();
			navigate("/");
		}
	};
	const updateUserID = (id: number) => {
		setUserId(id);
		console.log("here", userId);
	};
	const handleLogout = async () => {
		await logout();
		setToken(null);
		setEmail(undefined);
		setUserId(undefined);
		localStorage.removeItem("token");
	};

	const saveToken = (thetoken) => {
		setToken(thetoken);
		localStorage.setItem("token", JSON.stringify(thetoken));
	};

	return (
		<AuthContext.Provider
			value={{
				token,
				userId,
				email,
				handleLogout,
				handleToken,
				updateUserID,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};

function getToken() {
	const tokenString = localStorage.getItem("token");

	if (typeof tokenString === "undefined" || tokenString === null) {
		console.error("No token found");
		return null;
	}
	return JSON.parse(tokenString);
}

function getPayloadFromToken(token: string) {
	const base64Url = token.split(".")[1];
	if (base64Url == null) {
		console.error("Yikes your token has no payload, how did that happen?");
	}

	// Mostly ignore me, taken from JWT docs, this extracts the text payload from our token
	const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
	const jsonPayload = decodeURIComponent(
		atob(base64)
			.split("")
			.map(function (c) {
				return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join("")
	);

	const payload = JSON.parse(jsonPayload);
	return payload;
}

export function getUserItemFromToken(token: string, item: string) {
	const payload = getPayloadFromToken(token);
	return payload[item];
}
