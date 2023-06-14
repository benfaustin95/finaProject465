import { BudgetItemForm } from "@/Components/PostFormSubComponents/BudgetItemForm.tsx";
import { BudgetItem, createSubmitNewItemForm, RouteTypes } from "@/FrontendTypes.ts";
import { Container } from "react-bootstrap";
import { CurrentItemListGroup } from "@/Components/DeleteFormSubComponents/SelectItemControl.tsx";
import { useState } from "react";

export function BudgetItemPage() {
	const [submit, setSubmit] = useState(0);
	const submitForm = createSubmitNewItemForm(RouteTypes.BUDGET, setSubmit, submit);
	return (
		<div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5"}>
					<h1 className={"text-center"}>Current Expenses</h1>
					<CurrentItemListGroup<BudgetItem>
						type={RouteTypes.BUDGET}
						entityName={"Budget Item"}
						keysToDisplay={["name", "amount", "recurrence", "start", "end"]}
						condition={submit}
					/>
				</Container>
			</div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5"}>
					<BudgetItemForm submitForm={submitForm} />
				</Container>
			</div>
		</div>
	);
}
