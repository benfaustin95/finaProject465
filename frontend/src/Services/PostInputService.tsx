import { httpClient } from "@/Services/HttpClient.tsx";

export const PostInputService = {
	async send(url: string, data) {
		const status = await httpClient.post(url, data);
		return status;
	},
};
