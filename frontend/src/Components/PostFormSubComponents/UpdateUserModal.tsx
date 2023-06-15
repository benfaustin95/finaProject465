import { DeleteItemsService } from "@/Services/DeleteItemsService.tsx";
import { useAuth } from "@/Services/Auth.tsx";
import { Modal } from "react-bootstrap";
import { PutInputService } from "@/Services/PutInputService.tsx";
import { UpdateUserForm } from "@/Components/PostFormSubComponents/UpdateUserForm.tsx";
import { useState } from "react";

export function UpdateUserModal(props: { show: boolean; onHide: any }) {
	const { show, onHide } = props;
	const { email, handleLogout, userId } = useAuth();

	function submitForm(event, actions) {
		const toSubmit = {
			...event,
			email,
		};

		PutInputService.send(`/user`, userId, toSubmit)
			.then((res) => {
				actions.resetForm();
				actions.setSubmitting(false);
				actions.setStatus(undefined);
				console.log(res);
				onHide();
				if (res.status != 200) console.log("bad");
			})
			.catch((err) => {
				console.log(err);
				actions.setStatus({ error: true, message: "Submit Failed Please Try Again" });
				actions.setSubmitting(false);
			});
	}

	function deleteItem(event) {
		DeleteItemsService.send(event, userId, "user")
			.then((res) => {
				if (res.status != 200) console.log(res);
				handleLogout();
				onHide();
			})
			.catch((err) => {
				console.log(err);
			});
		return;
	}

	return (
		<Modal size="lg" show={show} onHide={onHide}>
			<Modal.Header closeButton></Modal.Header>
			<Modal.Body className={"bg-sky-950"}>
				<div className={"bg-light p-3"}>
					<UpdateUserForm submitForm={submitForm} deleteItem={deleteItem} />
				</div>
			</Modal.Body>
		</Modal>
	);
}
