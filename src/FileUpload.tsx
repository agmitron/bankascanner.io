import React, { useState } from 'react';
import { Upload, Steps, Button, message, Select } from 'antd';
import QuestionCircle from './QuestionCircle.svg';
import styles from './FileUpload.module.css';
import { scanner } from 'bankascanner';

const { Step } = Steps;
const { Option } = Select;
const FileUpload: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [fileList, setFileList] = useState<any[]>([]);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  
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
        message.error('Пожалуйста, загрузите документ.');
        return;
    }
    if (!selectedBank || !selectedVersion) {
        message.error('Пожалуйста, выберите банк и версию.');
        return;
    }

    const file = fileList[0].originFileObj; // Получаем оригинальный файл
    const reader = new FileReader();
    reader.onload = async (e) => {
        const statementResult = e.target?.result; // Содержимое файла

        // Проверяем, что statementResult является строкой
        if (typeof statementResult !== 'string') {
            console.error('Ошибка: содержимое файла некорректно или пусто.');
            return;
        }

        // Обработка документа
        const bank = selectedBank as string;
        const version = selectedVersion as string;
        const result = scanner.run(bank, version, { content: statementResult }, scanners);

        // Обработка результата
        for (const attempt of result) {
            if (attempt.isRight()) {
                const operation = attempt.value.operation;
                console.log('Успешно обработано:', operation);
                // Здесь можно обновить состояние или выполнить другие действия
            } else {
                const failure = attempt.value;
                console.error('Ошибка обработки:', {
                    text: failure.piece,
                    field: failure.field,
                    reason: failure.reason
                });
            }
        }
    };

    reader.readAsText(file); // Читаем файл как текст
    setCurrent(current + 1); // Переход на следующий шаг
};
  // Drag-and-click upload handled via Ant Design Upload.Dragger
  return (
    
    <div>
      <header className={styles.AppHeader}><div className={styles.headerContainer}><span>Bankascanner</span><img src={QuestionCircle} alt="question" /></div></header>
      <main className={styles.AppMain}>
    <Steps className={styles.steps}  current={current}>
        <Step title="Upload" />
        <Step title="Scan" />
        <Step title="Export" />
      </Steps>
    <div className={styles.uploadContainer}>
      
      <div>
<h1 className={styles.title} >{current === 0 && 'Upload your file and choose settings' }
{current === 1 && 'Your statement is scanned. Review the result in the table below' }
{current === 2 && 'Choose your prefer format' }</h1></div>
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
              Drop your file here or click to choose (PDF only)
            </div>
          </Upload.Dragger>
        )}
        {current === 1 && <h3>Обработка документа...</h3>}
        {current === 2 && <h3>Загрузка завершена!</h3>}
      </div>

      {current === 0 && (
        <div className={styles.selectContainer}>
                  <Select
                    placeholder="Сhoose bank"
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
                    placeholder="Version"
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
          Continue
        </Button></div>
      )}
      {current === 1 && (<div className={styles.buttonContainer}><Button onClick={() => setCurrent(current - 1)} >
          Previous Page
        </Button><Button type="primary" onClick={handleContinue}>
          Continue
        </Button></div>)}
        {current === 2 && (<div className={styles.buttonContainer}><Select
                    placeholder="Сhoose bank"
                    
                    style={{ width: 128 }}
                  >
                    <Option value="bank1">CSV</Option>
                    <Option value="bank2">JSON</Option>
                    
                  </Select><Button type="primary" onClick={handleContinue}>
          Download
        </Button></div>)}
    </div></main></div>
  );
};

export default FileUpload;
