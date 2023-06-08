import { FinancialAssetForm } from "@/Components/PostFormSubComponents/FinancialAssetForm.tsx";
import { DeleteItemForm } from "@/Components/DeleteFormSubComponents/DeleteItemForm.tsx";

export function FinancialAssetPage() {
	return (
		<div>
			<div>
				<FinancialAssetForm />
			</div>
			<div>
				<DeleteItemForm entityName={"Financial Asset"} type={"financialAsset"} />
			</div>
		</div>
	);
}
