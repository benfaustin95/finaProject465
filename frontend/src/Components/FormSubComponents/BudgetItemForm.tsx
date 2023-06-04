import Form from "react-bootstrap/Form";
import { FormControl } from "react-bootstrap";

export const BudgetItemForm = () => {
	return (
		<>
			<Form.Label htmlFor="amount">Expense Amount:</Form.Label>
			<Form.Control id="amount" type="text" placeholder="expense amount...." />
			<Form.Label htmlFor="recurrence">Reccurence</Form.Label>
			<Form.Select id="recurrence">
				<option value="monthly">Monthly</option>
				<option value="non-reocurring">Non-Reoccurring</option>
				<option value="annually">Annually</option>
				<option value="weekly">Weekly</option>
				<option value="daily">Daily</option>
			</Form.Select>
			<Form.Label htmlFor="startDate">Start Date:</Form.Label>
			<FormControl id="startDate" type="date" />
			<Form.Label htmlFor="endDate">Start Date:</Form.Label>
			<FormControl id="endDate" type="date" />
		</>
	);
};
