import { Button, Select } from "antd";
import { observer } from "mobx-react-lite";
import styles from "./Export.module.css";
import store from "./Pipeline.store";

const { Option } = Select;

const Export = observer(() => (
	<>
		<div className={styles.uploadArea}>
			<h3>Загрузка завершена!</h3>
		</div>

		<div className={styles.buttonContainer}>
			<Select placeholder="Сhoose bank" style={{ width: 128 }}>
				<Option value="csv">CSV</Option>
				<Option value="json">JSON</Option>
			</Select>
			<Button type="primary">Download</Button>
		</div>
	</>
));

export default Export;
