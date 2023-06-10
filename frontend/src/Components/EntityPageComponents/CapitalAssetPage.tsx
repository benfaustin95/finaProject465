import { CapitalAssetForm } from "@/Components/PostFormSubComponents/CapAssetForm.tsx";
import { Container } from "react-bootstrap";
import { CurrentItemListGroup } from "@/Components/DeleteFormSubComponents/SelectItemControl.tsx";
import { CapAsset } from "@/DoggrTypes.ts";
import { PostInputService } from "@/Services/PostInputService.tsx";

export function CapitalAssetPage() {
	function submitForm(event) {
		console.log(event);
		PostInputService.send("/capitalAsset", event)
			.then((res) => {
				console.log(res);
				if (res.status != 200) console.log("fix error");
			})
			.catch((err) => {
				console.log(err);
			});
	}
	return (
		<div>
			<div>
				<CapitalAssetForm submitForm={submitForm} />
			</div>
			<div>
				<Container className={"mx-auto my-4 p-4 bg-light rounded-5 w-75"}>
					<CurrentItemListGroup<CapAsset>
						type={"capitalAsset"}
						entityName={"Capital Asset"}
						keysToDisplay={["name", "note", "income", "recurrence"]}
					/>
				</Container>
			</div>
		</div>
	);
}
