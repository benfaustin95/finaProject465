import { CapitalAssetForm } from "@/Components/PostFormSubComponents/CapAssetForm.tsx";
import { Container } from "react-bootstrap";
import { CurrentItemListGroup } from "@/Components/DeleteFormSubComponents/SelectItemControl.tsx";
import { CapAsset, createSubmitNewItemForm, RouteTypes } from "@/FrontendTypes.ts";
import { useState } from "react";

export function CapitalAssetPage() {
	const [submit, setSubmit] = useState(0);
	const submitForm = createSubmitNewItemForm(RouteTypes.CAPASSET, setSubmit, submit);
	return (
		<div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5"}>
					<h1 className={"text-center"}>Current Capital Assets</h1>
					<CurrentItemListGroup<CapAsset>
						type={RouteTypes.CAPASSET}
						entityName={"Capital Asset"}
						keysToDisplay={["name", "note", "income", "recurrence"]}
						condition={submit}
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
