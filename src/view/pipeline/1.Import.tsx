import { Button, Select, Upload } from "antd";
import { observer } from "mobx-react-lite";
import { importers } from "~/definitions";
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
				onChange={async (v) => {
					// Do the job here.
					//
					// Read the file as Uint8Array and print to the console.
				}}
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
				onChange={(value) => {
					store.bank = value;
				}}
			>
				{supportedBanks.map((bank) => (
					<Option key={bank} value={bank}>
						{bank}
					</Option>
				))}
			</Select>

			<Button
				type="primary"
				onClick={() => store.next()}
				disabled={!store.canContinue}
			>
				Continue
			</Button>
		</div>
	</>
));

export default Import;
