import { OneTimeIncomeForm } from "@/Components/PostFormSubComponents/OneTimeIncomeForm.tsx";
import { Container } from "react-bootstrap";
import { CurrentItemListGroup } from "@/Components/DeleteFormSubComponents/SelectItemControl.tsx";
import { createSubmitNewItemForm, OneTimeIncome, RouteTypes } from "@/FrontendTypes.ts";
import { useState } from "react";

export function OneTimeIncomePage() {
	const [submit, setSubmit] = useState(0);
	const submitForm = createSubmitNewItemForm(RouteTypes.ONETIMEINCOME, setSubmit, submit);
	return (
		<div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5"}>
					<h1 className={"text-center"}>Current One Time Incomes</h1>
					<CurrentItemListGroup<OneTimeIncome>
						type={"oneTimeIncome"}
						entityName={RouteTypes.ONETIMEINCOME}
						keysToDisplay={["name", "cashBasis", "date"]}
						condition={submit}
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
