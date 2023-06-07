import { Link, Navigate, Route, Routes } from "react-router-dom";
import "@css/DoggrStyles.css";
import { MacroReportSet } from "@/Components/UsersList.tsx";
import { MicroReportLoad } from "@/Components/MicroReportLoad.tsx";
import { MacroReportLoad } from "@/Components/MacroReportLoad.tsx";
import { BudgetItemForm } from "@/Components/FormSubComponents/BudgetItemForm.tsx";
import { CapitalAssetForm, SubmitButton } from "@/Components/FormSubComponents/CapAssetForm.tsx";
import { DividendForm } from "@/Components/FormSubComponents/DividendForm.tsx";
import { OneTimeIncomeForm } from "@/Components/FormSubComponents/OneTimeIncomeForm.tsx";
import { FinancialAssetForm } from "@/Components/FormSubComponents/FinancialAssetForm.tsx";
import { RentalAssetForm } from "@/Components/FormSubComponents/RentalAsset.tsx";
import {
	Button,
	Col,
	Container,
	Nav,
	Navbar,
	NavbarBrand,
	NavDropdown,
	NavLink,
} from "react-bootstrap";
import NavbarCollapse from "react-bootstrap/NavbarCollapse";

export function DoggrRouter() {
	return (
		<main className={"bg-dark"}>
			<Navbar bg={"light"} expand={"lg"}>
				<Container>
					<NavbarBrand>Retire Maybe?</NavbarBrand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<NavbarCollapse>
						<Col xs={10} className={"d-flex flex-row justify-content-center"}>
							<Nav>
								<NavLink href={"/"}>Macro Report</NavLink>
								<NavLink href={"/microReportLoaded"}>Micro Report</NavLink>
								<NavDropdown title={"Financial Items"}>
									<NavDropdown.Item href={"/budgetItemPost"}>Budget Item</NavDropdown.Item>
									<NavDropdown.Item href={"/capitalAssetPost"}>Capital Asset</NavDropdown.Item>
									<NavDropdown.Item href={"/dividendPost"}>Dividend</NavDropdown.Item>
									<NavDropdown.Item href={"/oneTimeIncomePost"}>One Time Income</NavDropdown.Item>
									<NavDropdown.Item href={"/FinancialAssetPost"}>Financial Asset</NavDropdown.Item>
									<NavDropdown.Item href={"/RentalAssetPost"}>Rental Asset</NavDropdown.Item>
								</NavDropdown>
							</Nav>
						</Col>
						<Col xs={2} className={"d-flex flex-row justify-content-end"}>
							<Nav>
								<Button>Login</Button>
							</Nav>
						</Col>
					</NavbarCollapse>
				</Container>
			</Navbar>
			<Container>
				<Routes>
					<Route path="/" element={<MacroReportSet />} />
					<Route path="/macroReportLoaded" element={<MacroReportLoad />} />
					<Route path="/microReportLoaded" element={<MicroReportLoad />} />
					<Route path="/budgetItemPost" element={<BudgetItemForm />} />
					<Route path="/capitalAssetPost" element={<CapitalAssetForm />} />
					<Route path="/dividendPost" element={<DividendForm />} />
					<Route path="/oneTimeIncomePost" element={<OneTimeIncomeForm />} />
					<Route path="/financialAssetPost" element={<FinancialAssetForm />} />
					<Route path="/rentalAssetPost" element={<RentalAssetForm />} />
				</Routes>
			</Container>
		</main>
	);
}
