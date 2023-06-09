import axios from "axios";
import { useEffect, useState } from "react";
import { MacroReportService } from "@/Services/MacroReportService.tsx";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Button, Container, FormControl } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from "@/Services/Auth.tsx";

// 1) Make a place to store the users list result
// 2) Make the actual request to backend and store result
// 3) Show the list of users formatted nicely in our webpage
export const MacroReportSet = () => {
	const [endDate, setEndDate] = useState("");
	const navigate = useNavigate();
	const { email } = useAuth();
	const { handleToken, userId } = useAuth();
	const { isAuthenticated } = useAuth0();
	useEffect(() => {
		handleToken();
	}, [isAuthenticated]);
	const loadReport = (event) => {
		if (endDate != "") navigate("/macroReportLoaded", { state: { end: endDate } });
	};

	return (
		<Container className={"m-4"}>
			<Form onSubmit={loadReport} className={"bg-light"}>
				<h1>This is the email: {email}</h1>
				<Form.Label htmlFor="endYear " className="col-span-1 text-blue-300 ">
					End Year:
				</Form.Label>
				<FormControl
					type="date"
					name="endDate"
					id="endDate"
					value={endDate}
					onChange={(e) => setEndDate(e.target.value)}
					className="col-span-2 rounded w-128 h-128"
				/>
				<Button
					className="btn btn-primary btn-circle ml-2 col-span-1 text-white border-4"
					type="submit"
					id="send">
					Send
				</Button>
			</Form>
		</Container>
	);
};
