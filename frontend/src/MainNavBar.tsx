import { useAuth } from "@/Services/Auth.tsx";
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
import { LogOutButton } from "@/Components/AuthorizationComponents/LogOutButton.tsx";
import { LoginButton } from "@/Components/AuthorizationComponents/LoginButton.tsx";
import React, { useState } from "react";
import { UpdateUserModal } from "@/Components/PostFormSubComponents/UpdateUserModal.tsx";

function UpdateUserButton() {
	const [show, setShow] = useState(false);
	return (
		<>
			<Button
				className={"ml-4"}
				onClick={() => {
					setShow(true);
				}}>
				Update User
			</Button>
			<UpdateUserModal show={show} onHide={() => setShow(false)} />
		</>
	);
}

export function MainNavBar() {
	const { token, email, userId } = useAuth();

	return (
		<Navbar bg={"light"} expand={"lg"}>
			<Container>
				<NavbarBrand className={"brand"} href={"/"}>
					Retire Maybe?
				</NavbarBrand>
				{email != null ? <Navbar.Text> Signed in as {email} </Navbar.Text> : null}
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<NavbarCollapse className={"justify-content-end"}>
					<Nav>
						{token != null ? (
							<>
								<NavLink href={"/"}>Home</NavLink>
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
							</>
						) : null}
						{token != null && userId != null ? <UpdateUserButton /> : null}
						{token != null ? <LogOutButton /> : <LoginButton />}
					</Nav>
				</NavbarCollapse>
			</Container>
		</Navbar>
	);
}
