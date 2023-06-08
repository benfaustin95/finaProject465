import { BudgetItemForm } from "@/Components/PostFormSubComponents/BudgetItemForm.tsx";
import { DeleteItemForm } from "@/Components/DeleteFormSubComponents/DeleteItemForm.tsx";
import { BudgetItem } from "../../../../backend/src/db/entities/budgetItem.ts";

export function BudgetItemPage() {
	return (
		<div>
			<div>
				<BudgetItemForm />
			</div>
			<div>
				<DeleteItemForm<BudgetItem> entityName={"Budget Item"} type={"budgetItem"} />
			</div>
		</div>
	);
}
