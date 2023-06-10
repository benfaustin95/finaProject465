import { DividendForm } from "@/Components/PostFormSubComponents/DividendForm.tsx";
import { DeleteItemForm } from "@/Components/DeleteFormSubComponents/DeleteItemForm.tsx";
import { BudgetItemForm } from "@/Components/PostFormSubComponents/BudgetItemForm.tsx";
import { Container } from "react-bootstrap";
import { CurrentItemListGroup } from "@/Components/DeleteFormSubComponents/SelectItemControl.tsx";
import { BudgetItem, Dividend } from "@/DoggrTypes.ts";
import { PostInputService } from "@/Services/PostInputService.tsx";

export function DividendPage() {
	function submitForm(event) {
		PostInputService.send("/dividend", event)
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
				<DividendForm submitForm={submitForm} />
			</div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5 w-75"}>
					<CurrentItemListGroup<Dividend>
						type={"dividend"}
						entityName={"Dividend"}
						keysToDisplay={["name", "rate", "asset"]}
					/>
				</Container>
			</div>
		</div>
	);
}
