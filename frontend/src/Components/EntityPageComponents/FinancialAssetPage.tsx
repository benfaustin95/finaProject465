import { FinancialAssetForm } from "@/Components/PostFormSubComponents/FinancialAssetForm.tsx";
import { Container } from "react-bootstrap";
import { CurrentItemListGroup } from "@/Components/DeleteFormSubComponents/SelectItemControl.tsx";
import { BudgetItem, createSubmitNewItemForm, RFBase, RouteTypes } from "@/DoggrTypes.ts";
import { PostInputService } from "@/Services/PostInputService.tsx";

export function FinancialAssetPage() {
	const submitForm = createSubmitNewItemForm(RouteTypes.FINASSET);

	return (
		<div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5"}>
					<h1 className={"Current Financial Assets"}> Financial Assets</h1>
					<CurrentItemListGroup<RFBase>
						type={RouteTypes.FINASSET}
						entityName={"Financial Asset"}
						keysToDisplay={["name", "totalValue", "costBasis"]}
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
