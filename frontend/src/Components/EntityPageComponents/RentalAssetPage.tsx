import { RentalAssetForm } from "@/Components/PostFormSubComponents/RentalAssetForm.tsx";
import { Container } from "react-bootstrap";
import { CurrentItemListGroup } from "@/Components/DeleteFormSubComponents/SelectItemControl.tsx";
import { createSubmitNewItemForm, RentalAsset, RouteTypes } from "@/FrontendTypes.ts";
import { useState } from "react";

export function RentalAssetPage() {
	const [submit, setSubmit] = useState(0);
	const submitForm = createSubmitNewItemForm(RouteTypes.RENATLASSET, setSubmit, submit);
	return (
		<div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5"}>
					<h1 className={"text-center"}>Current Rental Assets</h1>
					<CurrentItemListGroup<RentalAsset>
						type={RouteTypes.RENATLASSET}
						entityName={"Rental Asset"}
						keysToDisplay={["name", "maintenanceExpense", "grossIncome", "growthRate"]}
						condition={submit}
					/>
				</Container>
			</div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5"}>
					<RentalAssetForm submitForm={submitForm} />
				</Container>
			</div>
		</div>
	);
}
