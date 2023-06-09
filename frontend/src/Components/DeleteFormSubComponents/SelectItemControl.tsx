import React, { useEffect, useState } from "react";
import { BaseInput } from "../../../../backend/src/db/entities/BaseInput.ts";
import { Col, Form, Row } from "react-bootstrap";
import { SearchItemService } from "@/Services/SearchItemService.tsx";
import { useAuth } from "@/Services/Auth.tsx";

export function SelectItemControl<T extends BaseInput>(props: {
	type: string;
	entityName: string;
	handleChange: any;
	errors: any;
	touched: any;
	values: any;
}) {
	const [entityArray, setEntityArray] = useState<Array<T>>([]);
	const { type, entityName, handleChange, values, touched, errors } = props;
	const { userId } = useAuth();
	useEffect(() => {
		const loadSearchItem = () => {
			SearchItemService.send(userId, type)
				.then((res) => {
					if (res.status != 200) throw Error();
					return res.data;
				})
				.then((res) => {
					setEntityArray(res);
				})
				.catch((err) => {
					console.log(err);
				});
		};
		loadSearchItem();
	}, []);
	return (
		<>
			<Col xs={12} md={4} className={"mb-4"}>
				<Form.Label htmlFor={"ids"}>Select {entityName}s to be deleted:</Form.Label>
			</Col>
			<Col xs={12} md={8} className={"mb-4"}>
				<Form.Select
					id={"ids"}
					value={values}
					name={"idsToDelete"}
					isValid={touched && !errors}
					isInvalid={!!errors}
					multiple
					onChange={handleChange}
					className={"mb-4"}>
					{entityArray.map((x) => (
						<option key={x.id + x.name + x.note} value={x.id}>
							{x.name}
						</option>
					))}
				</Form.Select>
			</Col>
		</>
	);
}
