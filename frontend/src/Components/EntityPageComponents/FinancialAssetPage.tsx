import { FinancialAssetForm } from "@/Components/PostFormSubComponents/FinancialAssetForm.tsx";
import { Container } from "react-bootstrap";
import { CurrentItemListGroup } from "@/Components/DeleteFormSubComponents/SelectItemControl.tsx";
import { BudgetItem, RFBase } from "@/DoggrTypes.ts";
import { PostInputService } from "@/Services/PostInputService.tsx";

export function FinancialAssetPage() {
	function submitForm(event) {
		console.log(event);
		PostInputService.send("/financialAsset", event)
			.then((res) => {
				console.log(res);
				if (res.status != 200) console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	return (
		<div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5"}>
					<h1 className={"Current Financial Assets"}> Financial Assets</h1>
					<CurrentItemListGroup<RFBase>
						type={"financialAsset"}
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
