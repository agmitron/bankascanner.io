import type React from "react";
import { useMemo, useState } from "react";
import { Upload, Steps, Button, message, Select, Table } from "antd";
import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";
import type { ColumnsType } from "antd/es/table";
import QuestionCircle from "./QuestionCircle.svg";
import styles from "./FileUpload.module.css";
import { useTranslation } from "./i18n";
import {
        load as loadImporter,
        getSupportedBanks,
        getSupportedVersions,
        type Bank,
        type Outcome,
        type ScanSuccess,
} from "./load";

const { Step } = Steps;
const { Option } = Select;
const FileUpload: React.FC = () => {
        const { t, lang, setLang } = useTranslation();
        const [current, setCurrent] = useState(0);
        const [fileList, setFileList] = useState<UploadFile[]>([]);
        const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
        const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
        const [scanResult, setScanResult] = useState<Outcome[] | null>(null);
        const [exportFormat, setExportFormat] = useState<"json" | "csv">("json");
        const supportedBanks = getSupportedBanks();

        const handleChange = ({ fileList: newFileList }: UploadChangeParam<UploadFile>) => {
                setFileList(newFileList.slice(-1));
        };

	const handleContinue = () => {
		if (fileList.length === 0) {
			message.error(t("app.upload.messages.noFile"));
			return;
		}
                if (!selectedBank) {
                        message.error(t("app.upload.messages.chooseBankVersion"));
                        return;
                }

                const file = fileList[0].originFileObj;
                const reader = new FileReader();
                reader.onload = async (e) => {
                        const statementResult = e.target?.result;

                        if (!(statementResult instanceof ArrayBuffer)) {
                                console.error(t("app.upload.messages.invalidContent"));
                                return;
                        }

                        try {
                                const impl = await loadImporter(selectedBank);
                                const result = await impl.run(new Uint8Array(statementResult));
                                if (result.isLeft()) {
                                        message.error(result.value);
                                        return;
                                }

                                setScanResult(result.value);
                                for (const outcome of result.value) {
                                        if (outcome.isRight()) {
                                                console.log(
                                                        t("app.log.success"),
                                                        outcome.value,
                                                );
                                        } else {
                                                console.error(
                                                        t("app.log.failure"),
                                                        outcome.value.message,
                                                );
                                        }
                                }
                        } catch (err) {
                                console.error(err);
                                message.error(String(err));
                        }
                };

                reader.readAsArrayBuffer(file);
                setCurrent(1);
        };
	// Drag-and-click upload handled via Ant Design Upload.Dragger
	return (
		<div>
			<header className={styles.AppHeader}>
				<div className={styles.headerContainer}>
					<span>{t("app.header.brand")}</span>
					<img src={QuestionCircle} alt={t("app.header.helpAlt")} />
					<div style={{ marginLeft: "auto" }}>
						<Select
							size="small"
							value={lang}
							onChange={(value: "en" | "ru") => setLang(value)}
							style={{ width: 110 }}
						>
							<Option value="en">{t("app.language.en")}</Option>
							<Option value="ru">{t("app.language.ru")}</Option>
						</Select>
					</div>
				</div>
			</header>
			<main className={styles.AppMain}>
				<Steps className={styles.steps} current={current}>
					<Step title={t("app.steps.upload")} />
					<Step title={t("app.steps.scan")} />
					<Step title={t("app.steps.export")} />
				</Steps>
				<div className={styles.uploadContainer}>
					<div>
						<h1 className={styles.title}>
							{current === 0 && t("app.title.upload")}
							{current === 1 && t("app.title.scan")}
							{current === 2 && t("app.title.export")}
						</h1>
					</div>
					<div className={styles.uploadArea}>
						{current === 0 && (
							<Upload.Dragger
								accept=".pdf"
								multiple={false}
								maxCount={1}
								fileList={fileList}
								onChange={handleChange}
								beforeUpload={() => false}
								openFileDialogOnClick
								style={{ background: "transparent", border: "none" }}
							>
								<div className={styles.uploadText}>{t("app.upload.hint")}</div>
							</Upload.Dragger>
						)}
                                                {current === 1 && <ScanTable t={t} scanResult={scanResult} />}
						{current === 2 && <h3>{t("app.title.export")}</h3>}
					</div>

					{current === 0 && (
						<div className={styles.selectContainer}>
							<Select
								placeholder={t("app.upload.select.bank")}
								value={selectedBank ?? undefined}
                                                                onChange={(value: string) => {
                                                                        setSelectedBank(value as Bank);
                                                                        const versions = getSupportedVersions(
                                                                                value as Bank,
                                                                        );
									const defaultVersion =
										versions.find((v) => v === "latest") ?? versions[0] ?? null;
									setSelectedVersion(defaultVersion);
								}}
								style={{ width: 128 }}
							>
								{supportedBanks.map((bank) => (
									<Option key={bank} value={bank}>
										{bank}
									</Option>
								))}
								{/* Добавьте другие банки по необходимости */}
							</Select>
							<Select
								placeholder={t("app.upload.select.version")}
								value={selectedVersion ?? undefined}
								disabled={!selectedBank}
								onChange={(value: string) => setSelectedVersion(value)}
								style={{ width: 128 }}
							>
                                                                {(selectedBank
                                                                        ? getSupportedVersions(selectedBank)
                                                                        : []
                                                                ).map((v) => (
                                                                        <Option key={v} value={v}>
                                                                                {v}
                                                                        </Option>
                                                                ))}
                                                        </Select>
							<Button type="primary" onClick={handleContinue}>
								{t("app.upload.button.continue")}
							</Button>
						</div>
					)}
					{current === 1 && (
						<div className={styles.buttonContainer}>
							<Button onClick={() => setCurrent(0)}>
								{t("app.upload.button.previous")}
							</Button>
							<Button
								type="primary"
								onClick={() => setCurrent(2)}
								disabled={!scanResult || scanResult.length === 0}
							>
								{t("app.upload.button.continue")}
							</Button>
						</div>
					)}
					{current === 2 && (
						<div className={styles.buttonContainer}>
							<Select
								placeholder={t("app.upload.select.format")}
								style={{ width: 128 }}
								value={exportFormat}
								onChange={(v: "json" | "csv") => setExportFormat(v)}
							>
								<Option value="csv">{t("app.formats.csv")}</Option>
								<Option value="json">{t("app.formats.json")}</Option>
							</Select>
							<Button
								type="primary"
								onClick={async () => {
									if (!scanResult) return;
                                                                        const exporter = await import(
                                                                                "bankascanner/exporter",
                                                                        );
                                                                        const scanIterable = (function* () {
                                                                                for (const a of scanResult) yield a;
                                                                        })();
									const currentFormat: "json" | "csv" = exportFormat;
                                                                        const stream = exporter.run(
                                                                                scanIterable as unknown as Iterable<unknown>,
                                                                                "",
                                                                                currentFormat,
                                                                        );
									const reader = stream.getReader();
									const chunks: Uint8Array[] = [];
									while (true) {
										const { done, value } = await reader.read();
										if (done) break;
										if (value) chunks.push(value);
									}
									const mime: string =
										currentFormat === "csv" ? "text/csv" : "application/json";
									const blob = new Blob(chunks, { type: mime });
									const url = URL.createObjectURL(blob);
									const a = document.createElement("a");
									a.href = url;
									a.download = `export.${currentFormat}`;
									document.body.appendChild(a);
									a.click();
									a.remove();
									URL.revokeObjectURL(url);
								}}
							>
								{t("app.upload.button.download")}
							</Button>
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default FileUpload;

const ScanTable: React.FC<{
        t: (k: string) => string;
        scanResult: Outcome[] | null;
}> = ({ t, scanResult }) => {
        type TableRow = { key: number } & ScanSuccess;

        const data = useMemo<TableRow[]>(() => {
                if (!scanResult) return [];
                return scanResult
                        .filter((a): a is Outcome & { value: ScanSuccess } => a.isRight())
                        .map((a, idx) => ({ key: idx, ...a.value }));
        }, [scanResult]);

        const columns: ColumnsType<TableRow> = [
                {
                        title: t("app.table.date"),
                        dataIndex: "date",
                        key: "date",
                        render: (d: string) => new Date(d).toLocaleDateString(),
                },
                { title: t("app.table.comment"), dataIndex: "comment", key: "comment" },
                { title: t("app.table.value"), dataIndex: "value", key: "value" },
                { title: t("app.table.currency"), dataIndex: "currency", key: "currency" },
                { title: t("app.table.category"), dataIndex: "category", key: "category" },
        ];

        return (
                <div>
                        <h3>{t("app.title.scan")}</h3>
                        <Table<TableRow>
                                dataSource={data}
                                columns={columns}
                                pagination={{ pageSize: 10 }}
                        />
                </div>
        );
};
