import { BudgetItemForm } from "@/Components/PostFormSubComponents/BudgetItemForm.tsx";
import { PostInputService } from "@/Services/PostInputService.tsx";
import { BudgetItem, createSubmitNewItemForm, RouteTypes } from "@/DoggrTypes.ts";
import { Container } from "react-bootstrap";
import { CurrentItemListGroup } from "@/Components/DeleteFormSubComponents/SelectItemControl.tsx";

export function BudgetItemPage() {
	const submitForm = createSubmitNewItemForm(RouteTypes.BUDGET);
	return (
		<div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5"}>
					<h1 className={"text-center"}>Current Expenses</h1>
					<CurrentItemListGroup<BudgetItem>
						type={RouteTypes.BUDGET}
						entityName={"Budget Item"}
						keysToDisplay={["name", "amount", "recurrence", "start", "end"]}
					/>
				</Container>
			</div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5"}>
					<BudgetItemForm submitForm={submitForm} />
				</Container>
			</div>
		</div>
	);
}
