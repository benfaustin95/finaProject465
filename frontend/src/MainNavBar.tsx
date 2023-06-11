import { useAuth } from "@/Services/Auth.tsx";
import { Col, Container, Nav, Navbar, NavbarBrand, NavDropdown, NavLink } from "react-bootstrap";
import NavbarCollapse from "react-bootstrap/NavbarCollapse";
import { LogOutButton } from "@/Components/AuthorizationComponents/LogOutButton.tsx";
import { LoginButton } from "@/Components/AuthorizationComponents/LoginButton.tsx";

export function MainNavBar() {
	const { token } = useAuth();

	return (
		<Navbar bg={"light"} expand={"lg"}>
			<Container>
				<NavbarBrand>Retire Maybe?</NavbarBrand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<NavbarCollapse>
					<Col xs={10} className={"d-flex flex-row justify-content-center"}>
						{token != null ? (
							<Nav>
								<NavLink href={"/macroReport"}>Macro Report</NavLink>
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
				</NavbarCollapse>
				<Col xs={2} className={"d-flex flex-row justify-content-end"}>
					<Nav>{token != null ? <LogOutButton /> : <LoginButton />}</Nav>
				</Col>
			</Container>
		</Navbar>
	);
}
