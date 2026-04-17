import { BaseFormCard } from "./BaseFormCard";
import BaseFormItem from "./BaseFormItem";
import Form from "./InternalForm";

const BaseForm = Object.assign(Form, {
	Item: BaseFormItem,
	Card: BaseFormCard,
});

export default BaseForm;
export { BaseFormCard };
