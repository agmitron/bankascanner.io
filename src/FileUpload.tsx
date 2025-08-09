import React, { useMemo, useState } from 'react';
import { Upload, Steps, Button, message, Select, Table } from 'antd';
import QuestionCircle from './QuestionCircle.svg';
import styles from './FileUpload.module.css';
import * as scanner from '../node_modules/bankascanner/dist/scanner/index.js';
import { useTranslation } from './i18n';

const { Step } = Steps;
const { Option } = Select;
const FileUpload: React.FC = () => {
  const { t, lang, setLang } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [fileList, setFileList] = useState<any[]>([]);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<any[] | null>(null);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  
  const scanners = {
    ...scanner.defaultScanners,
    // Добавьте свои сканеры, если необходимо
};
const supportedBanks = scanner.choices(scanners);

const getSupportedVersions = (bank: string | null): string[] => {
  if (!bank) return [];
  const versioner = (scanners as Record<string, any>)[bank];
  if (!versioner) return [];
  return (versioner.supported ?? []) as string[];
};

  const handleChange = (info: any) => {
    setFileList(info.fileList);
  };

  const handleContinue = () => {
    if (fileList.length === 0) {
        message.error(t('app.upload.messages.noFile'));
        return;
    }
    if (!selectedBank || !selectedVersion) {
        message.error(t('app.upload.messages.chooseBankVersion'));
        return;
    }

    const file = fileList[0].originFileObj; // Получаем оригинальный файл
    const reader = new FileReader();
    reader.onload = async (e) => {
        const statementResult = e.target?.result; // Содержимое файла

        // Проверяем, что statementResult является строкой
        if (typeof statementResult !== 'string') {
            console.error(t('app.upload.messages.invalidContent'));
            return;
        }

        // Обработка документа
        const bank = selectedBank as string;
        const version = selectedVersion as string;
        const scan = scanner.run(bank, version, { content: statementResult }, scanners);
        const attempts = Array.from(scan as Iterable<any>);
        setScanResult(attempts);
        attempts.forEach((attempt: any) => {
          if (attempt.isRight()) {
            console.log(t('app.log.success'), attempt.value.operation);
          } else {
            const failure = attempt.value;
            console.error(t('app.log.failure'), {
              text: failure.piece,
              field: failure.field,
              reason: failure.reason,
            });
          }
        });
    };

    reader.readAsText(file); // Читаем файл как текст
    setCurrent(1); // Go to Scan step
};
  // Drag-and-click upload handled via Ant Design Upload.Dragger
  return (
    
    <div>
      <header className={styles.AppHeader}>
        <div className={styles.headerContainer}>
          <span>{t('app.header.brand')}</span>
          <img src={QuestionCircle} alt={t('app.header.helpAlt')} />
          <div style={{ marginLeft: 'auto' }}>
            <Select
              size="small"
              value={lang}
              onChange={(value: 'en' | 'ru') => setLang(value)}
              style={{ width: 110 }}
            >
              <Option value="en">{t('app.language.en')}</Option>
              <Option value="ru">{t('app.language.ru')}</Option>
            </Select>
          </div>
        </div>
      </header>
      <main className={styles.AppMain}>
    <Steps className={styles.steps}  current={current}>
        <Step title={t('app.steps.upload')} />
        <Step title={t('app.steps.scan')} />
        <Step title={t('app.steps.export')} />
      </Steps>
    <div className={styles.uploadContainer}>
      
      <div>
<h1 className={styles.title} >{current === 0 && t('app.title.upload') }
{current === 1 && t('app.title.scan') }
{current === 2 && t('app.title.export') }</h1></div>
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
            style={{ background: 'transparent', border: 'none' }}
          >
            <div className={styles.uploadText}>
              {t('app.upload.hint')}
            </div>
          </Upload.Dragger>
        )}
        {current === 1 && (
          <ScanTable t={t} scanResult={scanResult} />
        )}
        {current === 2 && <h3>{t('app.title.export')}</h3>}
      </div>

      {current === 0 && (
        <div className={styles.selectContainer}>
                  <Select
                    placeholder={t('app.upload.select.bank')}
                    value={selectedBank ?? undefined}
                    onChange={(value: string) => {
                      setSelectedBank(value);
                      const versions = getSupportedVersions(value);
                      const defaultVersion = versions.find(v => v === 'latest') ?? versions[0] ?? null;
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
                    placeholder={t('app.upload.select.version')}
                    value={selectedVersion ?? undefined}
                    disabled={!selectedBank}
                    onChange={(value: string) => setSelectedVersion(value)}
                    style={{ width: 128 }}
                  >
                    {getSupportedVersions(selectedBank).map((v) => (
                      <Option key={v} value={v}>
                        {v}
                      </Option>
                    ))}
                  </Select>
        <Button type="primary" onClick={handleContinue}>
          {t('app.upload.button.continue')}
        </Button></div>
      )}
      {current === 1 && (<div className={styles.buttonContainer}><Button onClick={() => setCurrent(0)} >
          {t('app.upload.button.previous')}
        </Button><Button type="primary" onClick={() => setCurrent(2)} disabled={!scanResult || scanResult.length === 0}>
          {t('app.upload.button.continue')}
        </Button></div>)}
        {current === 2 && (<div className={styles.buttonContainer}><Select
                    placeholder={t('app.upload.select.format')}
                    
                    style={{ width: 128 }}
                    value={exportFormat}
                    onChange={(v: 'json' | 'csv') => setExportFormat(v)}
                  >
                    <Option value="csv">{t('app.formats.csv')}</Option>
                    <Option value="json">{t('app.formats.json')}</Option>
                    
                  </Select><Button type="primary" onClick={async () => {
                    if (!scanResult) return;
                    const exporter = await import('../node_modules/bankascanner/dist/exporter/index.js');
                    const scanIterable = (function*(){
                      for (const a of scanResult as any[]) yield a;
                    })();
                    const currentFormat: 'json' | 'csv' = exportFormat;
                    const stream = exporter.run(scanIterable as any, '', currentFormat);
                    const reader = stream.getReader();
                    const chunks: Uint8Array[] = [];
                    while (true) {
                      const { done, value } = await reader.read();
                      if (done) break;
                      if (value) chunks.push(value);
                    }
                    const mime: string = currentFormat === 'csv' ? 'text/csv' : 'application/json';
                    const blob = new Blob(chunks, { type: mime });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `export.${currentFormat}`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                  }}>
          {t('app.upload.button.download')}
        </Button></div>)}
    </div></main></div>
  );
};

export default FileUpload;

const ScanTable: React.FC<{ t: (k: string) => string; scanResult: any[] | null } > = ({ t, scanResult }) => {
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
    { title: t('app.table.date'), dataIndex: 'date', key: 'date', render: (d: Date) => new Date(d).toLocaleDateString() },
    { title: t('app.table.comment'), dataIndex: 'comment', key: 'comment' },
    { title: t('app.table.value'), dataIndex: 'value', key: 'value' },
    { title: t('app.table.currency'), dataIndex: 'currency', key: 'currency' },
    { title: t('app.table.category'), dataIndex: 'category', key: 'category' },
  ];

  return (
    <div>
      <h3>{t('app.title.scan')}</h3>
      <Table dataSource={data} columns={columns as any} pagination={{ pageSize: 10 }} />
    </div>
  );
};
