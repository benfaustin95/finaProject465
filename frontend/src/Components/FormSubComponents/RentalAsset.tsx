import { useState } from "react";
import { RentalAssetBody, RFBaseBody } from "../../../../backend/src/db/types.ts";
import { PostInputService } from "@/Services/PostInputService.tsx";
import Form from "react-bootstrap/Form";
import { RFBaseForm } from "@/Components/FormSubComponents/RFBase.tsx";
import { Button } from "react-bootstrap";

export const RentalAssetForm = () => {
	const [name, setName] = useState("");
	const [note, setNote] = useState("");
	const [costBasis, setCostBasis] = useState(0);
	const [totalValue, setTotalValue] = useState(0);
	const [owed, setOwed] = useState(0);
	const [expense, setExpense] = useState(0);
	const [grossIncome, setGrossIncome] = useState(0);
	const [submit, setSubmit] = useState(1);
	const [growthRate, setGrowthRate] = useState(0);
	const [wPriority, setWPriority] = useState(0);
	const [federalTax, setFederalTax] = useState("");
	const [capitalGainsTax, setCapitalGainsTax] = useState("");
	const [ficaTax, setFicaTax] = useState("");
	const [stateTax, setStateTax] = useState("");
	const [localTax, setLocalTax] = useState("");

	function submitExpense(event) {
		const item: RentalAssetBody = {
			name: name,
			note: note,
			totalValue: totalValue,
			costBasis: costBasis,
			growthRate: growthRate,
			owner_id: 2,
			federal: federalTax,
			capitalGains: capitalGainsTax,
			fica: ficaTax,
			state: stateTax,
			local: localTax,
			wPriority: wPriority,
			owed: owed,
			expense: expense,
			grossIncome: grossIncome,
		};

		event.preventDefault();

		PostInputService.send("/financialAsset", item)
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
		<Form onSubmit={submitExpense}>
			<RFBaseForm
				nameChanger={setName}
				noteChanger={setNote}
				growthRateChanger={setGrowthRate}
				federalChanger={setFederalTax}
				capitalGainsChanger={setCapitalGainsTax}
				ficaChanger={setFicaTax}
				stateChanger={setStateTax}
				localChanger={setLocalTax}
				totalValueChanger={setTotalValue}
				costBasisChanger={setCostBasis}
				wPriorityChanger={setWPriority}
			/>
			<Form.Label htmlFor={"owed"}>Remainder Owed on Property</Form.Label>
			<Form.Control
				type="text"
				id="owed"
				placeholder={"amount owed......"}
				onChange={(e) => setOwed(Number.parseFloat(e.target.value))}
			/>
			<Form.Label htmlFor={"expense"}>Monthly Property Expenses</Form.Label>
			<Form.Control
				type="text"
				id="expense"
				placeholder={"monthly property expense......"}
				onChange={(e) => setExpense(Number.parseFloat(e.target.value))}
			/>
			<Form.Label htmlFor={"grossIncome"}>Monthly Gross Income</Form.Label>
			<Form.Control
				type="text"
				id="grossIncome"
				placeholder={"monthly gross income......"}
				onChange={(e) => setGrossIncome(Number.parseFloat(e.target.value))}
			/>
			<Button type={"submit"}>Submit Rental Asset</Button>
		</Form>
	);
};
