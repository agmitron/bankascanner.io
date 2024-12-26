import React from 'react';
import { Upload, Button, message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styles from './FileUpload.module.css'; 

const FileUpload = () => {
  const handleChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} файл загружен успешно.`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} файл не удалось загрузить.`);
    }
  };

  const props = {
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76', 
    onChange: handleChange,
    showUploadList: true,
    multiple: false, 
  };

  return (
    <div className={styles.container}> 
      <Upload.Dragger {...props} style={{ marginBottom: '20px' }}>
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">Перетащите файл сюда, или нажмите для выбора файла</p>
        <p className="ant-upload-hint">
          Поддерживаются форматы: .jpg, .png, .pdf и т.д.
        </p>
      </Upload.Dragger>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Загрузить файл</Button>
      </Upload>

     
      <div className={styles.buttonContainer}> 
        <Select className={styles.select} id="bank">
          <option value="bank1">Банк 1</option>
          <option value="bank2">Банк 2</option>
          <option value="bank3">Банк 3</option>
        </Select>

        <Select className={styles.select} defaultValue='format1' id="out-format">
          <option value="format1">Формат 1</option>
          <option value="format2">Формат 2</option>
          <option value="format3">Формат 3</option>
        </Select>

        <Button className={styles.button}  type="primary" id="parse">Parse</Button>
      </div>
      
    </div>
  );
};

export default FileUpload;
