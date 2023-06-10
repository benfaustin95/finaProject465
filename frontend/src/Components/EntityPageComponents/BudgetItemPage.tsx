import { BudgetItemForm } from "@/Components/PostFormSubComponents/BudgetItemForm.tsx";
import { DeleteItemForm } from "@/Components/DeleteFormSubComponents/DeleteItemForm.tsx";
import { PostInputService } from "@/Services/PostInputService.tsx";
import { BudgetItem } from "@/DoggrTypes.ts";

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
				<BudgetItemForm submitForm={submitForm} />
			</div>
			<div>
				<DeleteItemForm<BudgetItem> entityName={"Budget Item"} type={"budgetItem"} />
			</div>
		</div>
	);
}
