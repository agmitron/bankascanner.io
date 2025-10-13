import type { DragEventHandler } from "react";
import { Button, Select, Upload, message } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import { observer } from "mobx-react-lite";
import { importers } from "../../const";
import styles from "./Import.module.css";
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
				onChange={() => console.log("onchange")}
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
				onChange={(value) => console.log("set selected bank")}
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
				onChange={() => console.log("change version")}
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
