import { BudgetItemForm } from "@/Components/PostFormSubComponents/BudgetItemForm.tsx";
import { PostInputService } from "@/Services/PostInputService.tsx";
import { BudgetItem } from "@/DoggrTypes.ts";
import { Container } from "react-bootstrap";
import { CurrentItemListGroup } from "@/Components/DeleteFormSubComponents/SelectItemControl.tsx";

export function BudgetItemPage() {
	function submitForm(event) {
		PostInputService.send("/budgetItem", event)
			.then((res) => {
				console.log(res);
				if (res.status != 200) console.log("bad");
			})
			.catch((err) => {
				console.log(err);
			});
	}
	return (
		<div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5"}>
					<h1 className={"text-center"}>Current Expenses</h1>
					<CurrentItemListGroup<BudgetItem>
						type={"budgetItem"}
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
