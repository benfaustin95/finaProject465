import { Container } from "react-bootstrap";
import { CurrentItemListGroup } from "@/Components/DeleteFormSubComponents/SelectItemControl.tsx";
import { BaseInput } from "@/DoggrTypes.ts";

export function DeleteItemForm<T extends BaseInput>(props: { entityName: string; type: string }) {
	return (
		<Container className={"mx-auto my-4 p-4 bg-light rounded-5 w-75"}>
			<CurrentItemListGroup<T>
				type={"budgetItem"}
				entityName={"Budget Item"}
				keysToDisplay={["name", "note", "amount", "recurrence"]}
			/>
		</Container>
	);
}
