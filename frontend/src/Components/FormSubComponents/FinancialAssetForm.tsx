import { RFBaseForm } from "@/Components/FormSubComponents/RFBase.tsx";
import { useState } from "react";
import { CAssetBody, RFBaseBody } from "../../../../backend/src/db/types.ts";
import { PostInputService } from "@/Services/PostInputService.tsx";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";

export const FinancialAssetForm = () => {
	const [name, setName] = useState("");
	const [note, setNote] = useState("");
	const [costBasis, setCostBasis] = useState(0);
	const [totalValue, setTotalValue] = useState(0);
	const [submit, setSubmit] = useState(1);
	const [growthRate, setGrowthRate] = useState(0);
	const [wPriority, setWPriority] = useState(0);
	const [federalTax, setFederalTax] = useState("");
	const [capitalGainsTax, setCapitalGainsTax] = useState("");
	const [ficaTax, setFicaTax] = useState("");
	const [stateTax, setStateTax] = useState("");
	const [localTax, setLocalTax] = useState("");
	function submitExpense(event) {
		const item: RFBaseBody = {
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
			<Button type={"submit"}>Submit Financial Asset</Button>
		</Form>
	);
};
