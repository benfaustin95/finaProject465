import { RentalAssetForm } from "@/Components/PostFormSubComponents/RentalAsset.tsx";
import { DeleteItemForm } from "@/Components/DeleteFormSubComponents/DeleteItemForm.tsx";

export function RentalAssetPage() {
	return (
		<div>
			<div>
				<RentalAssetForm />
			</div>
			<div>
				<DeleteItemForm entityName={"Rental Asset"} type={"rentalAsset"} />
			</div>
		</div>
	);
}
