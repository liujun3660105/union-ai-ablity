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
