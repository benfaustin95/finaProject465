import { Link, Route, Routes } from "react-router-dom";
import "@css/DoggrStyles.css";
import { MacroReportSet } from "@/Components/UsersList.tsx";
import { MicroReportLoad } from "@/Components/MicroReportLoad.tsx";
import { Container } from "react-bootstrap";
import { MacroReportLoad } from "@/Components/MacroReportLoad.tsx";
import { BudgetItemForm } from "@/Components/FormSubComponents/BudgetItemForm.tsx";
import { CapitalAssetForm } from "@/Components/FormSubComponents/CapAssetForm.tsx";
import { DividendForm } from "@/Components/FormSubComponents/DividendForm.tsx";

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
							<li>
								<Link to="/budgetItemPost">Budget Item Post</Link>
							</li>
							<li>
								<Link to="/capitalAssetPost">Capital Asset Post</Link>
							</li>
							<li>
								<Link to="/dividendPost">Dividend Post</Link>
							</li>
						</ul>
					</div>
				</div>
			</nav>

			<Routes>
				<Route path="/" element={<MacroReportSet />} />
				<Route path="/macroReportLoaded" element={<MacroReportLoad />} />
				<Route path="/microReportLoaded" element={<MicroReportLoad />} />
				<Route path="/budgetItemPost" element={<BudgetItemForm />} />
				<Route path="/capitalAssetPost" element={<CapitalAssetForm />} />
				<Route path="/dividendPost" element={<DividendForm />} />
			</Routes>
		</Container>
	);
}
