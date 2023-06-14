import { OneTimeIncomeForm } from "@/Components/PostFormSubComponents/OneTimeIncomeForm.tsx";
import { Container } from "react-bootstrap";
import { CurrentItemListGroup } from "@/Components/DeleteFormSubComponents/SelectItemControl.tsx";
import { createSubmitNewItemForm, OneTimeIncome, RouteTypes } from "@/FrontendTypes.ts";

export function OneTimeIncomePage() {
	const submitForm = createSubmitNewItemForm(RouteTypes.ONETIMEINCOME);
	return (
		<div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5"}>
					<h1 className={"text-center"}>Current One Time Incomes</h1>
					<CurrentItemListGroup<OneTimeIncome>
						type={"oneTimeIncome"}
						entityName={RouteTypes.ONETIMEINCOME}
						keysToDisplay={["name", "cashBasis", "date"]}
					/>
				</Container>
			</div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5"}>
					<OneTimeIncomeForm submitForm={submitForm} />
				</Container>
			</div>
		</div>
	);
}
