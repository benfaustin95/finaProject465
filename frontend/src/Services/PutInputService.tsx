import { httpClient } from "@/Services/HttpClient.tsx";

export const PutInputService = {
	async send(url: string, userid: number, data) {
		const status = await httpClient.put(url, { userid, toUpdate: data });
		return status;
	},
};
