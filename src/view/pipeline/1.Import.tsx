import { Button, Select, Upload } from "antd";
import type { UploadProps } from "antd";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { importers } from "~/definitions";
import styles from "./Import.module.css";
import store from "./Pipeline.store";

const { Option } = Select;
const supportedBanks = Object.keys(importers);

const Import = observer(() => {
	const [isLoadingFile, setIsLoadingFile] = useState(false);

	const handleUploadChange: UploadProps["onChange"] = ({ file }) => {
		if (!file || file.status === "removed") {
			return;
		}

		setIsLoadingFile(true);

		const readFileAsUint8Array = async () => {
			try {
				const rawFile = (file.originFileObj ?? file) as File; // Fallback handles cases where originFileObj is not populated yet.
				const arrayBuffer = await rawFile.arrayBuffer();
				const uint8Array = new Uint8Array(arrayBuffer);
				store.upload(uint8Array);
			} catch (error) {
				console.error("Failed to read the uploaded file.", error);
			} finally {
				setIsLoadingFile(false);
			}
		};

		void readFileAsUint8Array();
	};

	return (
		<>
			<div
				className={styles.uploadArea}
				onDragOver={(event) => event.preventDefault()}
				onDrop={() => console.log("drop")}
			>
				<Upload
					accept=".pdf"
					beforeUpload={() => false}
					onChange={handleUploadChange}
					disabled={isLoadingFile}
				>
					<div className={styles.uploadText}>
						{isLoadingFile
							? "Processing file..."
							: "Drop down your file (Supported format: .pdf)"}
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
					Scan the statement
				</Button>
			</div>
		</>
	);
});

export default Import;
