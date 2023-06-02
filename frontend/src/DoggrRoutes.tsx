import { Link, Route, Routes } from "react-router-dom";
import "@css/DoggrStyles.css";
import { MacroReportSet } from "@/Components/UsersList.tsx";
import { MacroReportLoad } from "@/Components/MacroReportLoad.tsx";
import { Container } from "react-bootstrap";

export function DoggrRouter() {
	return (
		<Container>
			<nav className="bg-blue-800 rounded-b shadow-lg mb-4">
				<div className="navbar justify-center">
					<div className={"navbar-center lg:flex"}>
						<ul className={"menu menu-horizontal"}>
							<li>
								<Link to="/">Load Report</Link>{" "}
							</li>
						</ul>
					</div>
				</div>
			</nav>

			<Routes>
				<Route path="/" element={<MacroReportSet />} />
				<Route path="/macroReportLoaded" element={<MacroReportLoad />} />
			</Routes>
		</Container>
	);
}
