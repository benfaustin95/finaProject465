import Form from "react-bootstrap/Form";
import { Button, FormControl } from "react-bootstrap";
import { useState } from "react";
import { BaseInputForm } from "@/Components/FormSubComponents/BaseInputForm.tsx";
import { PostInputService } from "@/Services/PostInputService.tsx";
import { OneTimeIncome } from "../../../../backend/src/db/entities/OneTimeIncome.ts";
import { OneTimeIncomeBody } from "../../../../backend/src/db/types.ts";

export const OneTimeIncomeForm = () => {
	const [name, setName] = useState("");
	const [note, setNote] = useState("");
	const [amount, setAmount] = useState(0);
	const [date, setDate] = useState(new Date());
	const [submit, setSubmit] = useState(1);
	const [growthRate, setGrowthRate] = useState(0);
	const [federalTax, setFederalTax] = useState("");
	const [ficaTax, setFicaTax] = useState("");
	const [stateTax, setStateTax] = useState("");
	const [localTax, setLocalTax] = useState("");
	const [capitalGainsTax, setCapitalGainsTax] = useState("");
	function submitExpense(event) {
		const item: OneTimeIncomeBody = {
			name: name,
			note: note,
			cashBasis: amount,
			growthRate: growthRate,
			date: date,
			owner_id: 2,
			federal: federalTax,
			capitalGains: capitalGainsTax,
			fica: ficaTax,
			state: stateTax,
			local: localTax,
		};

		event.preventDefault();

		PostInputService.send("/oneTimeIncome", item)
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
					capitalGainsChanger={setCapitalGainsTax}
					ficaChanger={setFicaTax}
					stateChanger={setStateTax}
					localChanger={setLocalTax}
				/>
				<Form.Label htmlFor="amount">Cash Basis:</Form.Label>
				<Form.Control
					id="amount"
					type="text"
					placeholder="expense amount...."
					onChange={(e) => setAmount(Number.parseFloat(e.target.value))}
				/>
				<Form.Label htmlFor="date">Date:</Form.Label>
				<FormControl id="date" type="date" onChange={(e) => setDate(new Date(e.target.value))} />
				<Button type="submit">Create OneTimeIncome</Button>
			</Form>
		</>
	);
};
