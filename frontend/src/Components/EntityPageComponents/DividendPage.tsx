import { DividendForm } from "@/Components/PostFormSubComponents/DividendForm.tsx";
import { DeleteItemForm } from "@/Components/DeleteFormSubComponents/DeleteItemForm.tsx";

export function DividendPage() {
	return (
		<div>
			<div>
				<DividendForm />
			</div>
			<div>
				<DeleteItemForm entityName={"Dividend"} type={"dividend"} />
			</div>
		</div>
	);
}
