import { BudgetItemForm } from "@/Components/PostFormSubComponents/BudgetItemForm.tsx";
import { DeleteItemsService } from "@/Services/DeleteItemsService.tsx";
import { useAuth } from "@/Services/Auth.tsx";
import { BaseInput } from "@/FrontendTypes.ts";
import { Modal } from "react-bootstrap";
import { PutInputService } from "@/Services/PutInputService.tsx";
import { CapitalAssetForm } from "@/Components/PostFormSubComponents/CapAssetForm.tsx";
import { DividendForm } from "@/Components/PostFormSubComponents/DividendForm.tsx";
import { FinancialAssetForm } from "@/Components/PostFormSubComponents/FinancialAssetForm.tsx";
import { OneTimeIncomeForm } from "@/Components/PostFormSubComponents/OneTimeIncomeForm.tsx";
import { RentalAssetForm } from "@/Components/PostFormSubComponents/RentalAssetForm.tsx";

export function DeleteModal<T extends BaseInput>(props: {
	type: string;
	show: boolean;
	onHide: any;
	item: any;
}) {
	const { type, show, onHide, item } = props;
	const { userId } = useAuth();
	const getForm = () => {
		if (type == "budgetItem") {
			return <BudgetItemForm budgetItem={item} submitForm={submitForm} deleteItem={deleteItem} />;
		}
		if (type == "capitalAsset")
			return <CapitalAssetForm capAsset={item} submitForm={submitForm} deleteItem={deleteItem} />;
		if (type == "dividend")
			return <DividendForm dividend={item} submitForm={submitForm} deleteItem={deleteItem} />;
		if (type == "financialAsset")
			return <FinancialAssetForm finAsset={item} submitForm={submitForm} deleteItem={deleteItem} />;
		if (type == "oneTimeIncome")
			return (
				<OneTimeIncomeForm oneTimeIncome={item} submitForm={submitForm} deleteItem={deleteItem} />
			);
		if (type == "rentalAsset")
			return <RentalAssetForm rentalAsset={item} submitForm={submitForm} deleteItem={deleteItem} />;
		return <></>;
	};

	function submitForm(event, actions) {
		PutInputService.send(`/${type}`, userId, event)
			.then((res) => {
				actions.resetForm();
				actions.setSubmitting(false);
				actions.setStatus(undefined);
				onHide();
				if (res.status != 200) console.log("bad submit");
			})
			.catch((err) => {
				console.log(err);
				actions.setStatus({ error: true, message: "Submit Failed Please Try Again" });
				actions.setSubmitting(false);
			});
	}

	function deleteItem(event) {
		const idsToDelete = event;
		DeleteItemsService.send(idsToDelete, userId, props.type)
			.then((res) => {
				if (res.status != 200) throw res;
				onHide();
			})
			.catch((err) => {
				console.log(err);
			});
		return;
	}

	return (
		<Modal size="lg" show={show} onHide={onHide}>
			<Modal.Header closeButton></Modal.Header>
			<Modal.Body className={"bg-sky-950"}>
				<div className={"bg-light p-3"}>{getForm()}</div>
			</Modal.Body>
		</Modal>
	);
}
