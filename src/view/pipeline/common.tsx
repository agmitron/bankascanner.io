import type React from "react";
import titleStyles from "./WithTitle.module.css";

export enum Step {
	Import,
	Review,
	Export,
}

type StepComponent = () => React.JSX.Element;

export const WithTitle = (
	title: string,
	Component: StepComponent,
): StepComponent => {
	const Wrapped: StepComponent = () => (
		<>
			<div>
				<h1 className={titleStyles.title}>{title}</h1>
			</div>
			<Component />
		</>
	);

	return Wrapped;
};
