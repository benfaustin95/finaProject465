import { RentalAssetForm } from "@/Components/PostFormSubComponents/RentalAssetForm.tsx";
import { Container } from "react-bootstrap";
import { CurrentItemListGroup } from "@/Components/DeleteFormSubComponents/SelectItemControl.tsx";
import { createSubmitNewItemForm, RentalAsset, RouteTypes } from "@/DoggrTypes.ts";
import { PostInputService } from "@/Services/PostInputService.tsx";

export function RentalAssetPage() {
	const submitForm = createSubmitNewItemForm(RouteTypes.RENATLASSET);
	return (
		<div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5"}>
					<h1 className={"text-center"}>Current Rental Assets</h1>
					<CurrentItemListGroup<RentalAsset>
						type={RouteTypes.RENATLASSET}
						entityName={"Rental Asset"}
						keysToDisplay={["name", "maintenanceExpense", "grossIncome", "growthRate"]}
					/>
				</Container>
			</div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5"}>
					<RentalAssetForm submitForm={submitForm} />
				</Container>
			</div>{" "}
		</div>
	);
}
