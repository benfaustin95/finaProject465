import { httpClient } from "@/Services/HttpClient.tsx";

export const DeleteItemsService = {
	async send(idsToDelete: number[], type: string) {
		const toReturn = httpClient({
			method: "delete",
			url: `/${type}`,
			data: { idsToDelete, userId: 3 },
		});
		return toReturn;
	},
};
