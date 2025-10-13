import type React from "react";
import { useState } from "react";
import type { UploadChangeParam } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import { Upload, Steps, Button, message, Select } from "antd";
import QuestionCircle from "./QuestionCircle.svg";
import styles from "./FileUpload.module.css";

const { Step } = Steps;
const { Option } = Select;
const scanners: unknown[] = [];
const scanner = {
	run: (..._args: unknown[]) => [],
};
const supportedBanks: string[] = [];
const FileUpload: React.FC = () => {
	return null;
	// const [current, setCurrent] = useState(0);
	// const [fileList, setFileList] = useState<UploadFile[]>([]);
	// const [selectedBank, setSelectedBank] = useState<string | null>(null);
	// const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
	//
	// const handleChange = ({
	// 	fileList: newFileList,
	// }: UploadChangeParam<UploadFile>) => {
	// 	setFileList(newFileList);
	// };
	//
	// const handleContinue = () => {
	// 	if (fileList.length === 0) {
	// 		message.error("Пожалуйста, загрузите документ.");
	// 		return;
	// 	}
	// 	if (!selectedBank || !selectedVersion) {
	// 		message.error("Пожалуйста, выберите банк и версию.");
	// 		return;
	// 	}
	//
	// 	const file = fileList[0].originFileObj; // Получаем оригинальный файл
	// 	const reader = new FileReader();
	// 	reader.onload = async (e) => {
	// 		const statementResult = e.target?.result; // Содержимое файла
	//
	// 		// Проверяем, что statementResult является строкой
	// 		if (typeof statementResult !== "string") {
	// 			console.error("Ошибка: содержимое файла некорректно или пусто.");
	// 			return;
	// 		}
	//
	// 		// Обработка документа
	// 		const result = scanner.run(
	// 			selectedBank,
	// 			selectedVersion,
	// 			statementResult,
	// 			scanners,
	// 		);
	//
	// 		// Обработка результата
	// 		for (const attempt of result) {
	// 			if (attempt.isRight()) {
	// 				const operation = attempt.value.operation;
	// 				console.log("Успешно обработано:", operation);
	// 				// Здесь можно обновить состояние или выполнить другие действия
	// 			} else {
	// 				const failure = attempt.value;
	// 				console.error("Ошибка обработки:", {
	// 					text: failure.piece,
	// 					field: failure.field,
	// 					reason: failure.reason,
	// 				});
	// 			}
	// 		}
	// 	};
	//
	// 	reader.readAsText(file); // Читаем файл как текст
	// 	setCurrent(current + 1); // Переход на следующий шаг
	// };
	// const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
	// 	e.preventDefault();
	// 	const files = e.dataTransfer.files;
	// 	const newFileList = [...fileList];
	//
	// 	for (let i = 0; i < files.length; i++) {
	// 		const file = files[i];
	// 		const newFile = {
	// 			uid: file.name,
	// 			name: file.name,
	// 			status: "done",
	// 			url: URL.createObjectURL(file),
	// 		};
	// 		newFileList.push(newFile);
	// 		message.success(`${file.name} файл добавлен`);
	// 	}
	//
	// 	setFileList(newFileList);
	// };
	// return (
	// 	<div>
	// 		<header className={styles.AppHeader}>
	// 			<div className={styles.headerContainer}>
	// 				<span>Bankascanner</span>
	// 				<img src={QuestionCircle} alt="question" />
	// 			</div>
	// 		</header>
	// 		<main className={styles.AppMain}>
	// 			<Steps className={styles.steps} current={current}>
	// 				<Step title="Upload" />
	// 				<Step title="Scan" />
	// 				<Step title="Export" />
	// 			</Steps>
	// 			<div className={styles.uploadContainer}>
	// 				<div>
	// 					<h1 className={styles.title}>
	// 						{current === 0 && "Upload your file and choose settings"}
	// 						{current === 1 &&
	// 							"Your statement is scanned. Review the result in the table below"}
	// 						{current === 2 && "Choose your prefer format"}
	// 					</h1>
	// 				</div>
	// 				<div
	// 					className={styles.uploadArea}
	// 					onDrop={handleDrop} // Переместили onDrop сюда
	// 					onDragOver={(e) => e.preventDefault()} // Предотвращаем стандартное поведение
	// 				>
	// 					{current === 0 && (
	// 						<Upload
	// 							accept=".pdf"
	// 							fileList={fileList}
	// 							onChange={handleChange}
	// 							beforeUpload={() => false}
	// 						>
	// 							<div className={styles.uploadText}>
	// 								Drop down your file (Supported format: .pdf)
	// 							</div>
	// 						</Upload>
	// 					)}
	// 					{current === 1 && <h3>Обработка документа...</h3>}
	// 					{current === 2 && <h3>Загрузка завершена!</h3>}
	// 				</div>
	//
	// 				{current === 0 && (
	// 					<div className={styles.selectContainer}>
	// 						<Select
	// 							placeholder="Сhoose bank"
	// 							onChange={(value) => setSelectedBank(value)}
	// 							style={{ width: 128 }}
	// 						>
	// 							{supportedBanks.map((bank) => (
	// 								<Option key={bank} value={bank}>
	// 									{bank}
	// 								</Option>
	// 							))}
	// 							{/* Добавьте другие банки по необходимости */}
	// 						</Select>
	// 						<Select
	// 							placeholder="Version"
	// 							onChange={(value) => setSelectedVersion(value)}
	// 							style={{ width: 98 }}
	// 						>
	// 							<Option value="1.0">Версия 1.0</Option>
	// 							<Option value="1.1">Версия 1.1</Option>
	// 						</Select>
	// 						<Button type="primary" onClick={handleContinue}>
	// 							Continue
	// 						</Button>
	// 					</div>
	// 				)}
	// 				{current === 1 && (
	// 					<div className={styles.buttonContainer}>
	// 						<Button onClick={() => setCurrent(current - 1)}>
	// 							Previous Page
	// 						</Button>
	// 						<Button type="primary" onClick={handleContinue}>
	// 							Continue
	// 						</Button>
	// 					</div>
	// 				)}
	// 				{current === 2 && (
	// 					<div className={styles.buttonContainer}>
	// 						<Select placeholder="Сhoose bank" style={{ width: 128 }}>
	// 							<Option value="bank1">CSV</Option>
	// 							<Option value="bank2">JSON</Option>
	// 						</Select>
	// 						<Button type="primary" onClick={handleContinue}>
	// 							Download
	// 						</Button>
	// 					</div>
	// 				)}
	// 			</div>
	// 		</main>
	// 	</div>
	// );
};

export default FileUpload;
