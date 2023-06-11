import { RentalAssetForm } from "@/Components/PostFormSubComponents/RentalAsset.tsx";
import { Container } from "react-bootstrap";
import { CurrentItemListGroup } from "@/Components/DeleteFormSubComponents/SelectItemControl.tsx";
import { RentalAsset } from "@/DoggrTypes.ts";
import { PostInputService } from "@/Services/PostInputService.tsx";

export function RentalAssetPage() {
	function submitForm(event) {
		PostInputService.send("/rentalAsset", event)
			.then((res) => {
				console.log(res);
				if (res.status != 200) console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	}
	return (
		<div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5"}>
					<h1 className={"text-center"}>Current Rental Assets</h1>
					<CurrentItemListGroup<RentalAsset>
						type={"rentalAsset"}
						entityName={"Rental Asset"}
						keysToDisplay={["name", "maintenanceExpense", "grossIncome", "growthRate"]}
					/>
				</Container>
			</div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5"}>
					<RentalAssetForm submitForm={submitForm} />
				</Container>
			</div>{" "}
		</div>
	);
}
