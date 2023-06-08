import { httpClient } from "@/Services/HttpClient.tsx";

export const SearchItemService = {
	async send(id: number, type: string) {
		const toReturn = await httpClient({
			method: "search",
			url: `/${type}`,
			data: { userId: id },
		});
		return toReturn;
	},
};
