import { Button, Select, Typography } from "antd";
import { observer } from "mobx-react-lite";
import styles from "./Export.module.css";
import store, { type ExportFormat } from "./Pipeline.store";

const Export = observer(() => {
	const formatOptions: Array<{ value: ExportFormat; label: string }> = [
		{ value: "csv", label: "CSV" },
		{ value: "json", label: "JSON" },
	];

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
				<Select<ExportFormat>
					value={store.exportFormat}
					options={formatOptions}
					onChange={(value) => store.setExportFormat(value)}
					style={{ width: 160 }}
				/>
				<Button type="primary" onClick={() => store.exportResult()}>
					Export
				</Button>
			</div>
		</>
	);
});

export default Export;
