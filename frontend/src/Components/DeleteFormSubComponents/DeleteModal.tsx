import { BudgetItemForm } from "@/Components/PostFormSubComponents/BudgetItemForm.tsx";
import { PostInputService } from "@/Services/PostInputService.tsx";
import { DeleteItemsService } from "@/Services/DeleteItemsService.tsx";
import { useAuth } from "@/Services/Auth.tsx";
import { BaseInput, BudgetItem, isBudgetItem } from "@/DoggrTypes.ts";
import { Modal } from "react-bootstrap";
import { entityType } from "../../../../backend/src/db/types.ts";
import { PutInputService } from "@/Services/PutInputService.tsx";
import { CapitalAssetForm } from "@/Components/PostFormSubComponents/CapAssetForm.tsx";
import { DividendForm } from "@/Components/PostFormSubComponents/DividendForm.tsx";
import { FinancialAssetForm } from "@/Components/PostFormSubComponents/FinancialAssetForm.tsx";
import { OneTimeIncomeForm } from "@/Components/PostFormSubComponents/OneTimeIncomeForm.tsx";
import { RentalAssetForm } from "@/Components/PostFormSubComponents/RentalAsset.tsx";

class extend {}

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

	function submitForm(event) {
		PutInputService.send(`/${type}`, userId, event)
			.then((res) => {
				console.log(res);
				onHide();
				if (res.status != 200) console.log("bad");
			})
			.catch((err) => {
				console.log(err);
			});
	}

	function deleteItem(event) {
		const idsToDelete = event;
		console.log(event);
		DeleteItemsService.send(idsToDelete, userId, props.type)
			.then((res) => {
				if (res.status != 200) console.log(res);
				onHide();
			})
			.catch((err) => {
				console.log(err);
			});
		return;
	}

	return (
		<Modal size="lg" show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">Modal heading</Modal.Title>
			</Modal.Header>
			<Modal.Body>{getForm()}</Modal.Body>
		</Modal>
	);
}
