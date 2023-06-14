import { CapitalAssetForm } from "@/Components/PostFormSubComponents/CapAssetForm.tsx";
import { Container } from "react-bootstrap";
import { CurrentItemListGroup } from "@/Components/DeleteFormSubComponents/SelectItemControl.tsx";
import { CapAsset, createSubmitNewItemForm, RouteTypes } from "@/FrontendTypes.ts";

export function CapitalAssetPage() {
	const submitForm = createSubmitNewItemForm(RouteTypes.CAPASSET);
	return (
		<div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5"}>
					<h1 className={"text-center"}>Current Capital Assets</h1>
					<CurrentItemListGroup<CapAsset>
						type={RouteTypes.CAPASSET}
						entityName={"Capital Asset"}
						keysToDisplay={["name", "note", "income", "recurrence"]}
					/>
				</Container>
			</div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5"}>
					<CapitalAssetForm submitForm={submitForm} />
				</Container>
			</div>
		</div>
	);
}
