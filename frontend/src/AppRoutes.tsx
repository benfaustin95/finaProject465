import { Route, Routes } from "react-router-dom";
import "@css/AppStyles.css";
import { MicroReportLoad } from "@/Components/GetReportSubComponenets/MicroReportLoad.tsx";
import { MacroReportLoad } from "@/Components/GetReportSubComponenets/MacroReportComponents/MacroReportLoad.tsx";
import { Container } from "react-bootstrap";
import { BudgetItemPage } from "@/Components/EntityPageComponents/BudgetItemPage.tsx";
import { CapitalAssetPage } from "@/Components/EntityPageComponents/CapitalAssetPage.tsx";
import { DividendPage } from "@/Components/EntityPageComponents/DividendPage.tsx";
import { OneTimeIncomePage } from "@/Components/EntityPageComponents/OneTimeIncomePage.tsx";
import { FinancialAssetPage } from "@/Components/EntityPageComponents/FinancialAssetPage.tsx";
import { RentalAssetPage } from "@/Components/EntityPageComponents/RentalAssetPage.tsx";
import { UserForm } from "@/Components/PostFormSubComponents/UserForm.tsx";
import { MainNavBar } from "@/MainNavBar.tsx";
import { HomePage } from "@/Components/EntityPageComponents/HomePage.tsx";
import { ProtectedRoute } from "@/Components/AuthorizationComponents/ProtectedRoute.tsx";

export function RetireMaybeRouter() {
	return (
		<main className={"bg-dark"}>
			<MainNavBar />
			<Container>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route
						path="/macroReport"
						element={
							<ProtectedRoute>
								<MacroReportLoad />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/macroReportLoaded"
						element={
							<ProtectedRoute>
								<MacroReportLoad />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/microReportLoaded"
						element={
							<ProtectedRoute>
								<MicroReportLoad />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/budgetItem"
						element={
							<ProtectedRoute>
								<BudgetItemPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/capitalAsset"
						element={
							<ProtectedRoute>
								<CapitalAssetPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/dividend"
						element={
							<ProtectedRoute>
								<DividendPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/oneTimeIncome"
						element={
							<ProtectedRoute>
								<OneTimeIncomePage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/financialAsset"
						element={
							<ProtectedRoute>
								<FinancialAssetPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/rentalAsset"
						element={
							<ProtectedRoute>
								<RentalAssetPage />
							</ProtectedRoute>
						}
					/>
					<Route path="/createProfile" element={<UserForm />} />
				</Routes>
			</Container>
		</main>
	);
}
