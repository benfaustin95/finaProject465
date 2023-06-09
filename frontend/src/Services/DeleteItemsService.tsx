import { httpClient } from "@/Services/HttpClient.tsx";

export const DeleteItemsService = {
	async send(idsToDelete: number[], id: number, type: string) {
		const toReturn = httpClient({
			method: "delete",
			url: `/${type}`,
			data: { idsToDelete, userId: id },
		});
		return toReturn;
	},
};
