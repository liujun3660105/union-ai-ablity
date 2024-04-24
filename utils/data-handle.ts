import { v4 as uuidv4 } from 'uuid';

export function uuid() {
  return uuidv4().replace(/-/g, '');
}
export function extractPotentialGeojson(inputString: string) {
  // 找到第一个 "{" 和最后一个 "}"
  const startBraceIndex = inputString.indexOf('{');
  const endBraceIndex = inputString.lastIndexOf('}');
  // 提取出疑似GeoJSON对象的字符串
  const potentialGeojsonStr = inputString.substring(startBraceIndex, endBraceIndex + 1);
  // 尝试将字符串解析为JSON对象
  let potentialGeojsonObj;
  try {
    potentialGeojsonObj = JSON.parse(potentialGeojsonStr);
  } catch (error) {
    return null;
  }
  // 检查类型是否为"Feature"或"FeatureCollection"
  if ('type' in potentialGeojsonObj && ['Feature', 'FeatureCollection'].includes(potentialGeojsonObj.type)) {
    return potentialGeojsonObj;
  } else {
    return null;
  }
}

export async function readBuffer(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (loadEvent) => resolve(loadEvent.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsArrayBuffer(file);
  });
}

export async function readBufferFromUrl(url: string) {
  fetch(url, {
    method: 'GET',
    headers: {
      responseType: 'blob',
    },
  })
    .then((res) => res.blob())
    .then((data) => {
      readBuffer(data);
    });
}

export async function readDataURL(buffer: ArrayBuffer) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (loadEvent) => resolve(loadEvent.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(new Blob([buffer]));
  });
}

export async function readText(buffer: ArrayBuffer | File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (loadEvent) => resolve(loadEvent.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(new Blob([buffer]), 'utf-8');
  });
}

export async function readFileFromUrl(url: string) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'GET',
      headers: {
        responseType: 'blob',
      },
    })
      .then((res) => res.blob())
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function formatMarkdownVal(val: string) {
  return val
    .replaceAll('\\n', '\n')
    .replace(/<table(\w*=[^>]+)>/gi, '<table $1>')
    .replace(/<tr(\w*=[^>]+)>/gi, '<tr $1>');
}
