import { Link, Route, Routes } from "react-router-dom";
import "@css/DoggrStyles.css";
import { MacroReportSet } from "@/Components/UsersList.tsx";
import { MicroReportLoad } from "@/Components/MicroReportLoad.tsx";
import { Container } from "react-bootstrap";
import { MacroReportLoad } from "@/Components/MacroReportLoad.tsx";

export function DoggrRouter() {
	return (
		<Container>
			<nav className="bg-blue-800 rounded-b shadow-lg mb-4">
				<div className="navbar justify-center">
					<div className={"navbar-center lg:flex"}>
						<ul className={"menu menu-horizontal"}>
							<li>
								<Link to="/">Load Report</Link>
							</li>
							<li>
								<Link to="/microReportLoaded">Load Micro Report</Link>
							</li>
						</ul>
					</div>
				</div>
			</nav>

			<Routes>
				<Route path="/" element={<MacroReportSet />} />
				<Route path="/macroReportLoaded" element={<MacroReportLoad />} />
				<Route path="/microReportLoaded" element={<MicroReportLoad />} />
			</Routes>
		</Container>
	);
}
