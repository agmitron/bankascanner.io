import { Button, Select, Typography } from "antd";
import { observer } from "mobx-react-lite";
import styles from "./Export.module.css";
import store from "./Pipeline.store";
import { exporters } from "~/definitions";

const Export = observer(() => {
	return (
		<>
			<div className={styles.uploadArea}>
				<div>
					<Typography.Title level={3}>Загрузка завершена!</Typography.Title>
					<Typography.Paragraph>
						Выберите формат и нажмите Export, чтобы скачать результат.
					</Typography.Paragraph>
				</div>
			</div>

			<div className={styles.buttonContainer}>
				<Select
					value={store.format}
					options={Object.keys(exporters).map((f) => ({ label: f, value: f }))}
					onChange={(value) => store.setFormat(value)}
					style={{ width: 160 }}
				/>
				<Button type="primary" onClick={() => store.export()}>
					Export
				</Button>
			</div>
		</>
	);
});

export default Export;
