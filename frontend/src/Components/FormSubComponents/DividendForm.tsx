import Form from "react-bootstrap/Form";
import { Button, FormControl } from "react-bootstrap";
import { useEffect, useState } from "react";
import { BaseInputForm } from "@/Components/FormSubComponents/BaseInputForm.tsx";
import { PostInputService } from "@/Services/PostInputService.tsx";
import { BudgetBody, CAssetBody, DividendBody } from "../../../../backend/src/db/types.ts";
import { CapAsset } from "../../../../backend/src/db/entities/capasset.ts";
import { FinancialAsset } from "../../../../backend/src/db/entities/financialasset.ts";
import { TaxService } from "@/Services/TaxService.tsx";
import { FinAssetService } from "@/Services/FinAssetService.tsx";

export const DividendForm = () => {
	const [name, setName] = useState("");
	const [note, setNote] = useState("");
	const [submit, setSubmit] = useState(1);
	const [federalTax, setFederalTax] = useState("");
	const [stateTax, setStateTax] = useState("");
	const [localTax, setLocalTax] = useState("");
	const [rate, setRate] = useState(0);
	const [finAsset, setFinAsset] = useState(0);
	const [finAssets, setFinAssets] = useState<Array<FinancialAsset>>([]);

	useEffect(() => {
		const loadFinAssets = () => {
			FinAssetService.send(1)
				.then((res) => {
					if (res.status != 200) throw Error();
					return res.data;
				})
				.then((res) => {
					setFinAssets(res);
				})
				.catch((err) => {
					console.log(err);
				});
		};
		loadFinAssets();
	}, []);
	function submitExpense(event) {
		const item: DividendBody = {
			owner_id: 2,
			name: name,
			note: note,
			growthRate: 0,
			federal: federalTax,
			capitalGains: "",
			fica: "",
			state: stateTax,
			local: localTax,
			rate: rate,
			finAsset: finAsset,
		};

		event.preventDefault();

		PostInputService.send("/dividend", item)
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
					type={"dividend"}
					nameChanger={setName}
					noteChanger={setNote}
					federalChanger={setFederalTax}
					stateChanger={setStateTax}
					localChanger={setLocalTax}
				/>
				<Form.Label htmlFor="rate">Rate of Return:</Form.Label>
				<Form.Control
					id="rate"
					type="text"
					placeholder="rate of return...."
					onChange={(e) => setRate(Number.parseFloat(e.target.value))}
				/>
				<Form.Label htmlFor="finAsset">Financial Asset: </Form.Label>
				<Form.Select id="finAsset" onChange={(e) => setFinAsset(Number.parseInt(e.target.value))}>
					{finAssets.map((x) => (
						<option key={x.id} value={x.id}>
							{x.name}
						</option>
					))}
				</Form.Select>
				<Button type="submit">Create Dividend</Button>
			</Form>
		</>
	);
};
