import Form from "react-bootstrap/Form";
import { TaxSelector } from "@/Components/FormSubComponents/TaxComponents.tsx";
export const BaseInputForm = () => {
	return (
		<>
			<Form.Label htmlFor="itemName">Name:</Form.Label>
			<Form.Control id="itemName" type="text" placeholder="item name...." />
			<Form.Label htmlFor="itemNote">Note:</Form.Label>
			<Form.Control id="itemNote" type="text" placeholder="item note...." />
			{/*
				hidden if for budget item
				Bounds????? NA - > 0??
			*/}
			<Form.Label htmlFor="itemGrowthRate">Growth Rate:</Form.Label>
			<Form.Control id="itemGrowthRate" type="text" placeholder="item note...." />
			<TaxSelector level={"federal"} />
			<TaxSelector level={"capitalGains"} />
			<TaxSelector level={"fica"} />
			<TaxSelector level={"state"} />
			<TaxSelector level={"local"} />
		</>
	);
};
