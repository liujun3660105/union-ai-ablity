import React, { useEffect, useState, useRef } from 'react';
// import { FilePreviewOptions } from '../type';
import { Table, Tabs } from 'antd';
// import { type ColumnsType } from 'antd/es/table/interface';
import type { ColumnsType } from 'antd/es/table';
import type { TabsProps } from 'antd';
import { writeXLSX, read, utils } from 'xlsx';
import { UploadFileProps } from '@/pages/rag/upload';
import { readFileFromUrl } from '@/utils/data-handle';

function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = () => reject;
    reader.readAsArrayBuffer(blob);
  });
}

export default function Index(props: UploadFileProps) {
  const { url } = props;
  const workbookRef = useRef<any>();
  const sheetNamesRef = useRef<TabsProps['items']>();
  const [tableTata, setTableData] = useState<Array<{ [key: string]: any }>>([]);
  const [columns, setColumns] = useState<ColumnsType<any>>([]);
  // const [sheetNames, setSheetNames] = useState<TabsProps['items']>([]);
  const [activeSheet, setActiveSheet] = useState<string>();
  async function fetchData(url: string) {
    const file = (await readFileFromUrl(url)) as Blob;
    const buffer: ArrayBuffer = await blobToArrayBuffer(file);
    const data = new Uint8Array(buffer);
    workbookRef.current = read(data, { type: 'array', cellDates: true });
    const newSheetNames = workbookRef.current.SheetNames.map((item, index: number) => ({ key: index, label: item, value: item }));
    sheetNamesRef.current = newSheetNames;
    // setSheetNames(newSheetNames);

    getDataBySheet(newSheetNames[0]?.key);
  }
  useEffect(() => {
    if (!url) return;
    fetchData(url);
    // const file = await readFileFromUrl(url);
  }, [url]);
  function handleSheetChange(activeKey: string) {
    // 切换sheet时，重新组装表格数据
    getDataBySheet(activeKey);
  }

  function getDataBySheet(sheetKey: string) {
    console.log('🚀 ~ getDataBySheet ~ sheetKey:', sheetKey);
    if (!workbookRef.current) return;
    // 如果指定了 sheetName，则将其用于查找工作表；否则，使用默认的第一个工作表。
    const sheetName = sheetNamesRef.current?.find((sheet) => sheet.key == sheetKey)?.label as string | undefined;
    if (!sheetName) return;
    const worksheet = workbookRef.current.Sheets[sheetName];
    // 将工作表数据转换为 JSON 格式
    const jsonData: any = utils.sheet_to_json(worksheet, { header: 1 });
    console.log('data', jsonData);
    // 将工作区转为options需要的格式
    // const newSheetNames = workbookRef.current.SheetNames.map((item) => ({ label: item, value: item }));
    // // 保存工作区
    // setSheetNames(newSheetNames);
    // // 设置默认工作区
    // setDefaultSheetName(sheetName ? sheetName : newSheetNames[0].value);
    // 判断所选工作区的内容是否为空
    if (jsonData.length > 0) {
      const newData: any[] = [];
      // 第一行默认认为是表头 除开第一行以外都是数据
      jsonData.slice(1).forEach((item: any, itemIndex: number) => {
        if (item.length === 0) return false;
        const obj: any = { key: itemIndex };
        jsonData[0].forEach((header: any, index: any) => {
          obj[header] = item[index];
        });
        newData.push(obj);
      });

      // 将第一行转为表头
      const columns = jsonData[0].map((header: any) => ({
        title: header,
        dataIndex: header,
        key: header,
        align: 'center',
      }));
      // 设置表头
      setColumns(columns);
      // 设置数据
      setTableData(newData);
    } else {
      console.log('没数据');
    }
  }
  return (
    <div className=" p-2">
      <div>
        <Tabs defaultActiveKey="0" items={sheetNamesRef.current} onChange={handleSheetChange} />
      </div>
      <Table dataSource={tableTata} columns={columns} scroll={{ x: 'max-content', y: 'max-content', scrollToFirstRowOnChange: true }} />
    </div>
  );
}
