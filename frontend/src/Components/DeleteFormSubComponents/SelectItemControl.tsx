import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { SearchItemService } from "@/Services/SearchItemService.tsx";
import { useAuth } from "@/Services/Auth.tsx";
import { DeleteModal } from "@/Components/DeleteFormSubComponents/DeleteModal.tsx";
import { BaseInput } from "@/FrontendTypes.ts";

export function CurrentItemListGroup<T extends BaseInput>(props: {
	type: string;
	entityName: string;
	keysToDisplay: string[];
	condition: number;
}) {
	const [entityArray, setEntityArray] = useState<T[]>([]);
	const [modalShow, setModalShow] = useState(false);
	const [item, setItem] = useState<T>(null);
	const { type, keysToDisplay, condition } = props;
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
	}, [modalShow, condition]);

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
			case "income":
				return formatter.format(item[name]);
			case "end":
			case "start":
			case "date":
				return new Date(item[name]).toISOString().slice(0, 10);
			case "rate":
				return Math.round(item[name] * 100) + "%";
			case "growthRate":
				return Math.round((item[name] - 1) * 100);
			// case "asset": return item[asset].
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
}
