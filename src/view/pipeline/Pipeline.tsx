import { Steps } from "antd";
import { observer } from "mobx-react-lite";
import QuestionCircle from "../../QuestionCircle.svg";
import styles from "../../FileUpload.module.css";
import Import from "./1.Import";
import Export from "./2.Export";
import Review from "./3.Review";
import { Step } from "./common";
import store from "./Pipeline.store";

const stepComponents: Record<Step, () => React.JSX.Element> = {
	[Step.Import]: Import,
	[Step.Review]: Review,
	[Step.Export]: Export,
};

const stepTitles: Record<Step, string> = {
	[Step.Import]: "Upload your file and choose settings",
	[Step.Review]: "Your statement is scanned. Review the result in the table below",
	[Step.Export]: "Choose your prefer format",
};

const Pipeline = observer(() => {
	const CurrentStep = stepComponents[store.step];

	return (
		<div>
			<header className={styles.AppHeader}>
				<div className={styles.headerContainer}>
					<span>Bankascanner</span>
					<img alt="question" src={QuestionCircle} />
				</div>
			</header>

			<main className={styles.AppMain}>
				<Steps className={styles.steps} current={store.step}>
					<Steps.Step title="Upload" />
					<Steps.Step title="Scan" />
					<Steps.Step title="Export" />
				</Steps>

				<div className={styles.uploadContainer}>
					<div>
						<h1 className={styles.title}>{stepTitles[store.step]}</h1>
					</div>

					<CurrentStep />
				</div>
			</main>
		</div>
	);
});

export default Pipeline;
