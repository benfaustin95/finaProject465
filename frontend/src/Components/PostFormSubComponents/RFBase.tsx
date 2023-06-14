import { InputControl } from "@/Components/PostFormSubComponents/FormSubComponents/InputControl.tsx";

export type rfBaseForm = {
	handleChange;
	errorsTotalValue;
	touchedTotalValue;
	valuesTotalValue;
	errorsCostBasis;
	touchedCostBasis;
	valuesCostBasis;
	errorsWPriority;
	valuesWPriority;
	touchedWPriority;
};

export const RFBaseForm = (props: rfBaseForm) => {
	const {
		handleChange,
		errorsTotalValue,
		errorsWPriority,
		errorsCostBasis,
		touchedTotalValue,
		touchedWPriority,
		touchedCostBasis,
		valuesWPriority,
		valuesTotalValue,
		valuesCostBasis,
	} = props;
	return (
		<>
			<InputControl
				handleChange={handleChange}
				type={"number"}
				name={"totalValue"}
				title={"Total Value"}
				values={valuesTotalValue}
				touched={touchedTotalValue}
				errors={errorsTotalValue}
			/>
			<InputControl
				handleChange={handleChange}
				type={"number"}
				name={"costBasis"}
				title={"Cost Basis"}
				values={valuesCostBasis}
				touched={touchedCostBasis}
				errors={errorsCostBasis}
			/>
			<InputControl
				handleChange={handleChange}
				type={"number"}
				name={"wPriority"}
				title={"Withdrawal Priority"}
				values={valuesWPriority}
				touched={touchedWPriority}
				errors={errorsWPriority}
			/>
		</>
	);
};
