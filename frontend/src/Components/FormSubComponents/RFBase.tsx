import Form from "react-bootstrap/Form";
import { FormControl } from "react-bootstrap";
import { baseInputForm, BaseInputForm } from "@/Components/FormSubComponents/BaseInputForm.tsx";

export type rfBaseForm = baseInputForm & {
	totalValueChanger;
	costBasisChanger;
	wPriorityChanger;
};

export const RFBaseForm = (props: rfBaseForm) => {
	return (
		<>
			<BaseInputForm
				nameChanger={props.nameChanger}
				noteChanger={props.noteChanger}
				growthRateChanger={props.growthRateChanger}
				federalChanger={props.federalChanger}
				ficaChanger={props.ficaChanger}
				stateChanger={props.stateChanger}
				localChanger={props.localChanger}
				capitalGainsChanger={props.capitalGainsChanger}
			/>
			<Form.Label htmlFor="totalValue">Total Value: </Form.Label>
			<Form.Control
				id="totalValue"
				type="text"
				placeholder="total value ...."
				onChange={(e) => props.totalValueChanger(Number.parseFloat(e.target.value))}
			/>
			<Form.Label htmlFor="costBasis">Cost Basis: </Form.Label>
			<Form.Control
				id="costBasis"
				type="text"
				placeholder="cost basis....."
				onChange={(e) => props.costBasisChanger(Number.parseFloat(e.target.value))}
			/>
			<Form.Label htmlFor="withdrawalPriority">Withdrawal Priority: </Form.Label>
			<Form.Control
				id="costBasis"
				type="text"
				placeholder="withdrawal priority....."
				onChange={(e) => props.wPriorityChanger(Number.parseFloat(e.target.value))}
			/>
		</>
	);
};
