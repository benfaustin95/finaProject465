import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import { TaxService } from "@/Services/TaxService.tsx";
import { TaxRate } from "../../../../backend/src/db/entities/Tax.ts";

export const TaxSelector = (props: { level: string; stateChanger: any }) => {
	const { level, stateChanger } = props;
	const [tax, setTax] = useState<Array<TaxRate>>([]);

	useEffect(() => {
		const loadTax = () => {
			TaxService.send(level)
				.then((res) => {
					if (res.status != 200) throw Error();
					return res.data;
				})
				.then((res) => {
					setTax(res);
				})
				.catch((err) => {
					console.log(err);
				});
		};
		loadTax();
	});

	function setTaxLevel(value: string) {
		stateChanger(value);
	}

	return (
		<>
			<Form.Label htmlFor={level}>{level}: </Form.Label>
			<Form.Select id={level} onChange={(e) => setTaxLevel(e.target.value)}>
				{tax.length != 0
					? tax.map((x) => (
							<option value={JSON.stringify([x.level, x.location])}>
								{x.level + " - " + x.location + "-" + x.rate}
							</option>
					  ))
					: null}
				<option value="">Not Applicable</option>
			</Form.Select>
		</>
	);
};
