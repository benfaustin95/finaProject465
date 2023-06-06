import Form from "react-bootstrap/Form";
import { FormControl, InputGroup, Row } from "react-bootstrap";
import { baseInputForm, BaseInputForm } from "@/Components/FormSubComponents/BaseInputForm.tsx";
import { InputControl } from "@/Components/FormSubComponents/CapAssetForm.tsx";

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
			<Row className={"mb-4"}>
				<InputControl
					handleChange={handleChange}
					type={"number"}
					name={"totalValue"}
					values={valuesTotalValue}
					touched={touchedTotalValue}
					errors={errorsTotalValue}
				/>
			</Row>
			<Row className={"mb-4"}>
				<InputControl
					handleChange={handleChange}
					type={"number"}
					name={"costBasis"}
					values={valuesCostBasis}
					touched={touchedCostBasis}
					errors={errorsCostBasis}
				/>
			</Row>
			<Row className={"mb-4"}>
				<InputControl
					handleChange={handleChange}
					type={"number"}
					name={"wPriority"}
					values={valuesWPriority}
					touched={touchedWPriority}
					errors={errorsWPriority}
				/>
			</Row>
		</>
	);
};
