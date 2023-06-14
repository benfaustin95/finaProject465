import { DividendForm } from "@/Components/PostFormSubComponents/DividendForm.tsx";
import { Container } from "react-bootstrap";
import { CurrentItemListGroup } from "@/Components/DeleteFormSubComponents/SelectItemControl.tsx";
import { createSubmitNewItemForm, Dividend, RouteTypes } from "@/FrontendTypes.ts";

export function DividendPage() {
	const submitForm = createSubmitNewItemForm(RouteTypes.DIVIDEND);
	return (
		<div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5"}>
					<h1 className={"text-center"}>Current Dividends</h1>
					<CurrentItemListGroup<Dividend>
						type={RouteTypes.DIVIDEND}
						entityName={"Dividend"}
						keysToDisplay={["name", "rate", "asset"]}
					/>
				</Container>
			</div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5"}>
					<DividendForm submitForm={submitForm} />
				</Container>
			</div>
		</div>
	);
}
