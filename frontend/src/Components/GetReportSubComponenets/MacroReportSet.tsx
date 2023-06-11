import axios from "axios";
import { useEffect, useState } from "react";
import { MacroReportService } from "@/Services/MacroReportService.tsx";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Button, Container, FormControl, Row } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from "@/Services/Auth.tsx";
import { Formik } from "formik";
import * as yup from "yup";
import { InputControl, SubmitButton } from "@/Components/PostFormSubComponents/CapAssetForm.tsx";
import Submit from "react-formal/Submit";

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
		handleToken().catch((err) => {});
	}, [isAuthenticated]);
	const loadReport = (event) => {
		if (event != "") navigate("/macroReportLoaded", { state: { ...event } });
	};

	return <Container className={"mx-auto my-4 p-4 bg-light rounded-5 w-50"}></Container>;
};
