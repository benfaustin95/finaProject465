import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { SearchItemService } from "@/Services/SearchItemService.tsx";
import { useAuth } from "@/Services/Auth.tsx";
import { DeleteModal } from "@/Components/DeleteFormSubComponents/DeleteModal.tsx";
import { BaseInput, entityType, isBudgetItem } from "@/DoggrTypes.ts";

export function CurrentItemListGroup<T extends BaseInput>(props: {
	type: string;
	entityName: string;
	keysToDisplay: string[];
}) {
	const [entityArray, setEntityArray] = useState<T[]>([]);
	const [modalShow, setModalShow] = useState(false);
	const [updateSubmited, setUpdateSubmitted] = useState(false);
	const [item, setItem] = useState<T>(null);
	const { type, entityName, keysToDisplay } = props;
	const { userId } = useAuth();
	const formatter = new Intl.NumberFormat("em-US", {
		style: "currency",
		currency: "USD",
	});
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
		console.log(modalShow);
	}, [modalShow]);

	function handleClick(x: T) {
		setItem(x);
		setModalShow(true);
	}

	function getValueToDisplay(item: T, name: string) {
		switch (name) {
			case "totalValue":
			case "costBasis":
			case "amount":
			case "maintenanceExpense":
			case "grossIncome":
				return formatter.format(item[name]);
			case "end":
			case "start":
			case "date":
				return new Date(item[name]).toISOString().slice(0, 10);
			default:
				return item[name];
		}
	}
	return (
		<>
			<div className={"overflow-auto current-group"}>
				<Table striped bordered>
					<thead>
						<tr className={""}>
							{entityArray.length > 0
								? Object.getOwnPropertyNames(entityArray[0]).map((x) =>
										keysToDisplay.includes(x) ? (
											<th className={"current-th sticky"} key={entityArray[0].id + x}>
												{x.toUpperCase()}
											</th>
										) : null
								  )
								: null}
						</tr>
					</thead>
					<tbody>
						{entityArray.map((x) => (
							<tr
								key={x.id}
								className={"currentRow"}
								onClick={() => {
									handleClick(x);
								}}>
								{Object.getOwnPropertyNames(x).map((name) =>
									keysToDisplay.includes(name) ? (
										<td key={x[name] + name + "cell" + x.id}>{getValueToDisplay(x, name)}</td>
									) : null
								)}
							</tr>
						))}
					</tbody>
				</Table>
			</div>
			<DeleteModal<T> type={type} item={item} show={modalShow} onHide={() => setModalShow(false)} />
		</>
	);
	{
		/*<Col xs={12} md={4} className={"mb-4"}>*/
	}
	{
		/*	<Form.Label htmlFor={"ids"}>Select {entityName}s to be deleted:</Form.Label>*/
	}
	{
		/*</Col>*/
	}
	{
		/*<Col xs={12} md={8} className={"mb-4"}>*/
	}
	{
		/*	<Form.Select*/
	}
	{
		/*		id={"ids"}*/
	}
	{
		/*		value={values}*/
	}
	{
		/*		name={"idsToDelete"}*/
	}
	{
		/*		isValid={touched && !errors}*/
	}
	{
		/*		isInvalid={!!errors}*/
	}
	{
		/*		multiple*/
	}
	{
		/*		onChange={handleChange}*/
	}
	{
		/*		className={"mb-4"}>*/
	}
	{
		/*		{entityArray.map((x) => (*/
	}
	{
		/*			<option key={x.id + x.name + x.note} value={x.id}>*/
	}
	{
		/*				{x.name}*/
	}
	{
		/*			</option>*/
	}
	{
		/*		))}*/
	}
	{
		/*	</Form.Select>*/
	}
	{
		/*</Col>*/
	}
}
