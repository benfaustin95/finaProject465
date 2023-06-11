import { OneTimeIncomeForm } from "@/Components/PostFormSubComponents/OneTimeIncomeForm.tsx";
import { Container } from "react-bootstrap";
import { CurrentItemListGroup } from "@/Components/DeleteFormSubComponents/SelectItemControl.tsx";
import { BudgetItem, OneTimeIncome, RFBase } from "@/DoggrTypes.ts";
import { PostInputService } from "@/Services/PostInputService.tsx";
import { OneTimeIncomeBody } from "../../../../backend/src/db/backendTypes/createTypes.ts";

export function OneTimeIncomePage() {
	function submitForm(event) {
		PostInputService.send("/oneTimeIncome", event)
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
					<h1 className={"text-center"}>Current One Time Incomes</h1>
					<CurrentItemListGroup<OneTimeIncome>
						type={"oneTimeIncome"}
						entityName={"One Time Income"}
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
