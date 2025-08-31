import React, { useMemo, useState } from "react";
import { Upload, Steps, Button, message, Select, Table } from "antd";
import QuestionCircle from "./QuestionCircle.svg";
import styles from "./FileUpload.module.css";
import { useTranslation } from "./i18n";
import { load, banks as supportedBanks, type Bank } from "./load";

const { Step } = Steps;
const { Option } = Select;

const FileUpload: React.FC = () => {
        const { t, lang, setLang } = useTranslation();
        const [current, setCurrent] = useState(0);
        const [fileList, setFileList] = useState<any[]>([]);
        const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
        const [scanResult, setScanResult] = useState<any[] | null>(null);
        const [exportFormat, setExportFormat] = useState<"json" | "csv">("json");

        const handleChange = (info: any) => {
                setFileList(info.fileList.slice(-1));
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

                const file = fileList[0].originFileObj as File;
                const reader = new FileReader();
                reader.onload = async (e) => {
                        const result = e.target?.result;
                        if (!(result instanceof ArrayBuffer)) {
                                console.error(t("app.upload.messages.invalidContent"));
                                return;
                        }
                        const binary = new Uint8Array(result);
                        try {
                                const importer = await load(selectedBank);
                                const parsed = await importer.run(binary);
                                if (parsed.isRight()) {
                                        const attempts = Array.from(parsed.value as Iterable<any>);
                                        setScanResult(attempts);
                                        attempts.forEach((attempt: any) => {
                                                if (attempt.isRight()) {
                                                        console.log(t("app.log.success"), attempt.value);
                                                } else {
                                                        console.error(t("app.log.failure"), attempt.value);
                                                }
                                        });
                                } else {
                                        message.error(parsed.value);
                                }
                        } catch (err) {
                                console.error(err);
                        }
                        setCurrent(1);
                };
                reader.readAsArrayBuffer(file);
        };

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
                                                                onChange={(value: Bank) => setSelectedBank(value)}
                                                                style={{ width: 128 }}
                                                        >
                                                                {supportedBanks.map((bank) => (
                                                                        <Option key={bank} value={bank}>
                                                                                {bank}
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
                                                                        const exporterModule =
                                                                                exportFormat === "csv"
                                                                                        ? await import("bankascanner/exporter/csv")
                                                                                        : await import("bankascanner/exporter/json");
                                                                        const exporter = exporterModule.create();
                                                                        const scanIterable = (function* () {
                                                                                for (const a of scanResult as any[]) yield a;
                                                                        })();
                                                                        const exported = await exporter.run(scanIterable as any);
                                                                        if (exported.isLeft()) {
                                                                                message.error(exported.value);
                                                                                return;
                                                                        }
                                                                        const mime =
                                                                                exportFormat === "csv"
                                                                                        ? "text/csv"
                                                                                        : "application/json";
                                                                        const blob = new Blob([exported.value], { type: mime });
                                                                        const url = URL.createObjectURL(blob);
                                                                        const a = document.createElement("a");
                                                                        a.href = url;
                                                                        a.download = `export.${exportFormat}`;
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
        scanResult: any[] | null;
}> = ({ t, scanResult }) => {
        const data = useMemo(() => {
                if (!scanResult) return [];
                return scanResult
                        .filter((a: any) => a?.isRight?.())
                        .map((a: any, idx: number) => ({
                                key: idx,
                                date: a.value.operation.date,
                                comment: a.value.operation.comment,
                                value: a.value.operation.value,
                                currency: a.value.operation.currency,
                                category: a.value.operation.category,
                        }));
        }, [scanResult]);

        const columns = [
                {
                        title: t("app.table.date"),
                        dataIndex: "date",
                        key: "date",
                        render: (d: Date) => new Date(d).toLocaleDateString(),
                },
                { title: t("app.table.comment"), dataIndex: "comment", key: "comment" },
                { title: t("app.table.value"), dataIndex: "value", key: "value" },
                { title: t("app.table.currency"), dataIndex: "currency", key: "currency" },
                { title: t("app.table.category"), dataIndex: "category", key: "category" },
        ];

        return (
                <div>
                        <h3>{t("app.title.scan")}</h3>
                        <Table
                                dataSource={data}
                                columns={columns as any}
                                pagination={{ pageSize: 10 }}
                        />
                </div>
        );
};

