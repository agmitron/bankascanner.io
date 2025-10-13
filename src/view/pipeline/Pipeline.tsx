import { Button, Flex, Steps } from "antd";
import { Step } from "./common";
import store from "./Pipeline.store";

const steps: Record<Step, () => React.JSX.Element> = {
	[Step.Import]: () => <></>,
	[Step.Review]: () => <></>,
	[Step.Export]: () => <></>,
};

const Pipeline = () => {
	const Current = steps[store.step];

	return (
		<Flex vertical>
			<Steps>
				<Steps.Step title="Import" />
				<Steps.Step title="Review" />
				<Steps.Step title="Export" />
			</Steps>

			<Current />

			<Flex>
				<Button>Previous</Button>
				<Button>Next</Button>
			</Flex>
		</Flex>
	);
};

export default Pipeline;
