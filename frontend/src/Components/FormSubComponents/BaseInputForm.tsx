import Form from "react-bootstrap/Form";
import { TaxSelector } from "@/Components/FormSubComponents/TaxComponents.tsx";
import { useState } from "react";

export type baseInputForm = {
	type: string;
	nameChanger;
	noteChanger;
	growthRateChanger?;
	federalChanger?;
	capitalGainsChanger?;
	ficaChanger?;
	stateChanger?;
	localChanger?;
};
export const BaseInputForm = (props: baseInputForm) => {
	const {
		type,
		nameChanger,
		noteChanger,
		growthRateChanger,
		federalChanger,
		capitalGainsChanger,
		ficaChanger,
		stateChanger,
		localChanger,
	} = props;

	return (
		<>
			<Form.Label htmlFor="itemName">Name:</Form.Label>
			<Form.Control
				id="itemName"
				type="text"
				placeholder="item name...."
				onChange={(e) => nameChanger(e.target.value)}
			/>
			<Form.Label htmlFor="itemNote">Note:</Form.Label>
			<Form.Control
				id="itemNote"
				type="text"
				placeholder="item note...."
				onChange={(e) => noteChanger(e.target.value)}
			/>
			{type != "budgetItem" ? (
				<>
					{type != "dividend" ? (
						<>
							<Form.Label htmlFor="itemGrowthRate">Growth Rate:</Form.Label>
							<Form.Control
								id="itemGrowthRate"
								type="text"
								placeholder="item note...."
								onChange={(e) => growthRateChanger(Number.parseFloat(e.target.value))}
							/>
						</>
					) : null}
					<TaxSelector stateChanger={federalChanger} level={"federal"} />
					{type != "capitalAsset" && type != "dividend" ? (
						<TaxSelector stateChanger={capitalGainsChanger} level={"capitalGains"} />
					) : null}
					{type != "dividend" ? <TaxSelector level={"fica"} stateChanger={ficaChanger} /> : null}
					<TaxSelector level={"state"} stateChanger={stateChanger} />
					<TaxSelector level={"local"} stateChanger={localChanger} />
				</>
			) : null}
		</>
	);
};
