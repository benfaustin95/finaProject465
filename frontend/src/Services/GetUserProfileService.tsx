import { httpClient } from "@/Services/HttpClient.tsx";

export const GetUserProfileService = {
	async send(email: string) {
		return httpClient({
			method: "search",
			url: "/user",
			data: { email },
		});
	},
};
