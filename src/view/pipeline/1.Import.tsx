import { Button, Select, Upload } from "antd";
import { observer } from "mobx-react-lite";
import { importers } from "../../const";
import styles from "../../FileUpload.module.css";
import store from "./Pipeline.store";

const { Option } = Select;
const supportedBanks = Object.keys(importers);

const Import = observer(() => (
	<>
		<div
			className={styles.uploadArea}
			onDragOver={(event) => event.preventDefault()}
			onDrop={() => console.log("drop")}
		>
			<Upload
				accept=".pdf"
				beforeUpload={() => false}
				onChange={() => console.log("change")}
			>
				<div className={styles.uploadText}>
					Drop down your file (Supported format: .pdf)
				</div>
			</Upload>
		</div>

		<div className={styles.selectContainer}>
			<Select
				placeholder="Сhoose bank"
				style={{ width: 128 }}
				value={"value"}
				onChange={(value) => console.log("change bank")}
			>
				{supportedBanks.map((bank) => (
					<Option key={bank} value={bank}>
						{bank}
					</Option>
				))}
			</Select>

			<Select
				placeholder="Version"
				style={{ width: 98 }}
				value={"version"}
				onChange={(value) => console.log("change version")}
			>
				<Option value="1.0">Версия 1.0</Option>
				<Option value="1.1">Версия 1.1</Option>
			</Select>

			<Button type="primary" onClick={() => console.log("continue")}>
				Continue
			</Button>
		</div>
	</>
));

export default Import;
