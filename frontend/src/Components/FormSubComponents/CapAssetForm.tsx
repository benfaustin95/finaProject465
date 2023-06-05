import Form from "react-bootstrap/Form";
import { Button, FormControl } from "react-bootstrap";
import { useState } from "react";
import { BaseInputForm } from "@/Components/FormSubComponents/BaseInputForm.tsx";
import { PostInputService } from "@/Services/PostInputService.tsx";
import { BudgetBody, CAssetBody } from "../../../../backend/src/db/types.ts";
import { CapAsset } from "../../../../backend/src/db/entities/capasset.ts";

export const CapitalAssetForm = () => {
	const [name, setName] = useState("");
	const [note, setNote] = useState("");
	const [amount, setAmount] = useState(0);
	const [recurrence, setRecurrence] = useState("");
	const [type, setType] = useState("");
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [submit, setSubmit] = useState(1);
	const [growthRate, setGrowthRate] = useState(0);
	const [federalTax, setFederalTax] = useState("");
	const [ficaTax, setFicaTax] = useState("");
	const [stateTax, setStateTax] = useState("");
	const [localTax, setLocalTax] = useState("");
	function submitExpense(event) {
		const item: CAssetBody = {
			name: name,
			note: note,
			income: amount,
			growthRate: growthRate,
			recurrence: recurrence,
			start: startDate,
			end: endDate,
			owner_id: 2,
			federal: federalTax,
			capitalGains: "",
			fica: ficaTax,
			state: stateTax,
			local: localTax,
			type: type,
		};

		event.preventDefault();

		PostInputService.send("/capitalAsset", item)
			.then((res) => {
				console.log(res);
				if (res.status != 200) setSubmit(0);
			})
			.catch((err) => {
				console.log(err);
				setSubmit(0);
			});
	}
	return (
		<>
			{submit == 0 ? <h5>Submit Failed</h5> : null}
			<Form onSubmit={submitExpense}>
				<BaseInputForm
					nameChanger={setName}
					noteChanger={setNote}
					growthRateChanger={setGrowthRate}
					federalChanger={setFederalTax}
					ficaChanger={setFicaTax}
					stateChanger={setStateTax}
					localChanger={setLocalTax}
				/>
				<Form.Label htmlFor="amount">Expense Amount:</Form.Label>
				<Form.Control
					id="amount"
					type="text"
					placeholder="expense amount...."
					onChange={(e) => setAmount(Number.parseFloat(e.target.value))}
				/>
				<Form.Label htmlFor="type">Type of Capital Asset: </Form.Label>
				<Form.Select id="type" onChange={(e) => setType(e.target.value)}>
					<option value="Human Capital">Human Capital</option>
					<option value="Non-Taxable Annuity">NonTaxable</option>
					<option value="Social Capital">Social</option>
				</Form.Select>
				<Form.Label htmlFor="recurrence">Recurrence</Form.Label>
				<Form.Select id="recurrence" onChange={(e) => setRecurrence(e.target.value)}>
					<option value="monthly">Monthly</option>
					<option value="non-reocurring">Non-Reoccurring</option>
					<option value="annually">Annually</option>
					<option value="weekly">Weekly</option>
					<option value="daily">Daily</option>
				</Form.Select>
				<Form.Label htmlFor="startDate">Start Date:</Form.Label>
				<FormControl
					id="startDate"
					type="date"
					onChange={(e) => setStartDate(new Date(e.target.value))}
				/>
				<Form.Label htmlFor="endDate">Start Date:</Form.Label>
				<FormControl
					id="endDate"
					type="date"
					onChange={(e) => setEndDate(new Date(e.target.value))}
				/>
				<Button type="submit">Create Expense</Button>
			</Form>
		</>
	);
};
