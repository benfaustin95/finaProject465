import { FinancialAssetForm } from "@/Components/PostFormSubComponents/FinancialAssetForm.tsx";
import { Container } from "react-bootstrap";
import { CurrentItemListGroup } from "@/Components/DeleteFormSubComponents/SelectItemControl.tsx";
import { createSubmitNewItemForm, RFBase, RouteTypes } from "@/FrontendTypes.ts";
import { useState } from "react";

export function FinancialAssetPage() {
	const [submit, setSubmit] = useState(0);
	const submitForm = createSubmitNewItemForm(RouteTypes.FINASSET, setSubmit, submit);

	return (
		<div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5"}>
					<h1 className={"text-center"}>Current Financial Assets</h1>
					<CurrentItemListGroup<RFBase>
						type={RouteTypes.FINASSET}
						entityName={"Financial Asset"}
						keysToDisplay={["name", "totalValue", "costBasis"]}
						condition={submit}
					/>
				</Container>
			</div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5"}>
					<FinancialAssetForm submitForm={submitForm} />
				</Container>
			</div>
		</div>
	);
}
