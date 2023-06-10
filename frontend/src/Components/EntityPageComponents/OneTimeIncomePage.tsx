import { OneTimeIncomeForm } from "@/Components/PostFormSubComponents/OneTimeIncomeForm.tsx";
import { DeleteItemForm } from "@/Components/DeleteFormSubComponents/DeleteItemForm.tsx";
import { Container } from "react-bootstrap";
import { CurrentItemListGroup } from "@/Components/DeleteFormSubComponents/SelectItemControl.tsx";
import { BudgetItem, OneTimeIncome, RFBase } from "@/DoggrTypes.ts";
import { OneTimeIncomeBody } from "../../../../backend/src/db/types.ts";
import { PostInputService } from "@/Services/PostInputService.tsx";

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
				<OneTimeIncomeForm submitForm={submitForm} />
			</div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5 w-75"}>
					<CurrentItemListGroup<OneTimeIncome>
						type={"oneTimeIncome"}
						entityName={"One Time Income"}
						keysToDisplay={["name", "cashBasis", "date"]}
					/>
				</Container>
			</div>
		</div>
	);
}
