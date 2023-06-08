import { CapitalAssetForm } from "@/Components/PostFormSubComponents/CapAssetForm.tsx";
import { DeleteItemForm } from "@/Components/DeleteFormSubComponents/DeleteItemForm.tsx";
import { FinancialAsset } from "../../../../backend/src/db/entities/financialasset.ts";
import { CapAsset } from "../../../../backend/src/db/entities/capasset.ts";

export function CapitalAssetPage() {
	return (
		<div>
			<div>
				<CapitalAssetForm />
			</div>
			<div>
				<DeleteItemForm<CapAsset> type={"capitalAsset"} entityName={"Capital Asset"} />
			</div>
		</div>
	);
}
