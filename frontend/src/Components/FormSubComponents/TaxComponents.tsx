import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import { TaxService } from "@/Services/TaxService.tsx";

export const TaxSelector = (props: { level: string }) => {
	const { level } = props;
	const [tax, setTax] = useState();

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
	return (
		<>
			<Form.Label htmlFor={level}>{level}: </Form.Label>
			<Form.Select id={level}>{}</Form.Select>
		</>
	);
};
