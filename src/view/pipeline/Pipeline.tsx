import { Steps } from "antd";
import { observer } from "mobx-react-lite";
import QuestionCircle from "../../QuestionCircle.svg";
import layoutStyles from "./Pipeline.module.css";
import Import from "./1.Import";
import Export from "./3.Export";
import Review from "./2.Review";
import { Step, WithTitle } from "./common";
import store from "./Pipeline.store";

const stepComponents: Record<Step, () => React.JSX.Element> = {
	[Step.Import]: WithTitle("Upload your file and choose settings", Import),
	[Step.Review]: WithTitle(
		"Your statement is scanned. Review the result in the table below",
		Review,
	),
	[Step.Export]: WithTitle("Choose your prefer format", Export),
};

const Pipeline = observer(() => {
	const CurrentStep = stepComponents[store.step];

	return (
		<div>
			<header className={layoutStyles.AppHeader}>
				<div className={layoutStyles.headerContainer}>
					<span>Bankascanner</span>
					<img alt="question" src={QuestionCircle} />
				</div>
			</header>

			<main className={layoutStyles.AppMain}>
				<Steps className={layoutStyles.steps} current={store.step}>
					<Steps.Step title="Upload" />
					<Steps.Step title="Scan" />
					<Steps.Step title="Export" />
				</Steps>

				<div className={layoutStyles.uploadContainer}>
					<CurrentStep />
				</div>
			</main>
		</div>
	);
});

export default Pipeline;
