import { Link, Navigate, Route, Routes } from "react-router-dom";
import "@css/DoggrStyles.css";
import { MacroReportSet } from "@/Components/GetReportSubComponenets/UsersList.tsx";
import { MicroReportLoad } from "@/Components/GetReportSubComponenets/MicroReportLoad.tsx";
import { MacroReportLoad } from "@/Components/GetReportSubComponenets/MacroReportLoad.tsx";
import { BudgetItemForm } from "@/Components/PostFormSubComponents/BudgetItemForm.tsx";
import {
	CapitalAssetForm,
	SubmitButton,
} from "@/Components/PostFormSubComponents/CapAssetForm.tsx";
import { DividendForm } from "@/Components/PostFormSubComponents/DividendForm.tsx";
import { OneTimeIncomeForm } from "@/Components/PostFormSubComponents/OneTimeIncomeForm.tsx";
import { FinancialAssetForm } from "@/Components/PostFormSubComponents/FinancialAssetForm.tsx";
import { RentalAssetForm } from "@/Components/PostFormSubComponents/RentalAsset.tsx";
import { Col, Container, Nav, Navbar, NavbarBrand, NavDropdown, NavLink } from "react-bootstrap";
import NavbarCollapse from "react-bootstrap/NavbarCollapse";
import { BudgetItemPage } from "@/Components/EntityPageComponents/BudgetItemPage.tsx";
import { CapitalAssetPage } from "@/Components/EntityPageComponents/CapitalAssetPage.tsx";
import { DividendPage } from "@/Components/EntityPageComponents/DividendPage.tsx";
import { OneTimeIncomePage } from "@/Components/EntityPageComponents/OneTimeIncomePage.tsx";
import { FinancialAssetPage } from "@/Components/EntityPageComponents/FinancialAssetPage.tsx";
import { RentalAssetPage } from "@/Components/EntityPageComponents/RentalAssetPage.tsx";
import { LoginButton } from "@/Components/AuthorizationComponents/LoginButton.tsx";
import { LogOutButton } from "@/Components/AuthorizationComponents/LogOutButton.tsx";
import { useAuth } from "@/Services/Auth.tsx";
import { UserForm } from "@/Components/PostFormSubComponents/UserForm.tsx";

export function DoggrRouter() {
	const { token } = useAuth();
	return (
		<main className={"bg-dark"}>
			<Navbar bg={"light"} expand={"lg"}>
				<Container>
					<NavbarBrand>Retire Maybe?</NavbarBrand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<NavbarCollapse>
						<Col xs={10} className={"d-flex flex-row justify-content-center"}>
							{token != null ? (
								<Nav>
									<NavLink href={"/"}>Macro Report</NavLink>
									<NavLink href={"/microReportLoaded"}>Micro Report</NavLink>
									<NavDropdown title={"Financial Items"}>
										<NavDropdown.Item href={"/budgetItem"}>Budget Item</NavDropdown.Item>
										<NavDropdown.Item href={"/capitalAsset"}>Capital Asset</NavDropdown.Item>
										<NavDropdown.Item href={"/dividend"}>Dividend</NavDropdown.Item>
										<NavDropdown.Item href={"/oneTimeIncome"}>One Time Income</NavDropdown.Item>
										<NavDropdown.Item href={"/financialAsset"}>Financial Asset</NavDropdown.Item>
										<NavDropdown.Item href={"/RentalAsset"}>Rental Asset</NavDropdown.Item>
									</NavDropdown>
								</Nav>
							) : null}
						</Col>
						<Col xs={2} className={"d-flex flex-row justify-content-end"}>
							<Nav>{token != null ? <LogOutButton /> : <LoginButton />}</Nav>
						</Col>
					</NavbarCollapse>
				</Container>
			</Navbar>
			<Container>
				<Routes>
					<Route path="/" element={<MacroReportSet />} />
					<Route path="/macroReportLoaded" element={<MacroReportLoad />} />
					<Route path="/microReportLoaded" element={<MicroReportLoad />} />
					<Route path="/budgetItem" element={<BudgetItemPage />} />
					<Route path="/capitalAsset" element={<CapitalAssetPage />} />
					<Route path="/dividend" element={<DividendPage />} />
					<Route path="/oneTimeIncome" element={<OneTimeIncomePage />} />
					<Route path="/financialAsset" element={<FinancialAssetPage />} />
					<Route path="/rentalAsset" element={<RentalAssetPage />} />
					<Route path="/createProfile" element={<UserForm />} />
				</Routes>
			</Container>
		</main>
	);
}
