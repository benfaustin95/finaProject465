import { useFormikContext } from "formik";
import { Button } from "react-bootstrap";

export function SubmitButton(props: { name: string }) {
	const { dirty, isValid, isSubmitting, isValidating, status } = useFormikContext();
	const { name } = props;

	return (
		<>
			<Button
				as="input"
				className={`btn-lg ${status != undefined && status.error != undefined ? `btn-danger` : ""}`}
				type="submit"
				value={name}
				disabled={!isValid || !dirty || isSubmitting || isValidating}
			/>
		</>
	);
}
