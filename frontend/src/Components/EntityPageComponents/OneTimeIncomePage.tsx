import { OneTimeIncomeForm } from "@/Components/PostFormSubComponents/OneTimeIncomeForm.tsx";
import { DeleteItemForm } from "@/Components/DeleteFormSubComponents/DeleteItemForm.tsx";

export function OneTimeIncomePage() {
	return (
		<div>
			<div>
				<OneTimeIncomeForm />
			</div>
			<div>
				<DeleteItemForm entityName={"One Time Income"} type={"oneTimeIncome"} />
			</div>
		</div>
	);
}
