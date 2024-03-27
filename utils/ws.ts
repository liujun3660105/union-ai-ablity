// 前端向服务端发送的参数
interface WebSocketDataParams {
  socketType: string;
  //   action: string;
  //   chartName: string;
  //   value: boolean;
  value?: string;
}
// 后端向前端传回的数据
export interface WebSocketDataProps {
  socketType: string;
  action: string;
  chartName: string;
  value: boolean;
  data: string;
}

class SocketService {
  /**
   * 单例 保证拿到的都是同一个实例
   */
  static instance: SocketService;
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService();
    }
    return this.instance;
  }

  baseUrl: string;
  ws: WebSocket;
  callBackMapping: Record<string, any>;
  isconnect: boolean;
  sendRetryCount: number; //重复发送次数
  connectRetryCount: number;
  constructor(url: string = 'ws://localhost:5002/ws') {
    this.baseUrl = url;
    this.ws = {} as WebSocket;
    this.callBackMapping = {};
    this.isconnect = false;
    this.sendRetryCount = 0;
    this.connectRetryCount = 0;
  }

  //和服务端创建的stocket对象

  //定义连接服务器的方法
  connect(url = '') {
    if (!window.WebSocket) {
      return console.log('您的浏览器不支持WebSocket');
    }
    url = url ? url : this.baseUrl;
    this.baseUrl = url;
    this.ws = new WebSocket(url);

    //连接监听
    this.ws.onopen = () => {
      console.log('连接服务端成功');
      this.connectRetryCount = 0;
      this.isconnect = true;
    };

    this.ws.onclose = () => {
      this.connectRetryCount++;
      console.log('连接失败/关闭');
      this.isconnect = false;
      //当连接关闭后进行重新连接尝试
      setTimeout(() => {
        this.connect(this.baseUrl);
      }, this.connectRetryCount * 500);
    };

    this.ws.onmessage = (res) => {
      console.log('res', res);
      debugger;
      const recvData: WebSocketDataProps = JSON.parse(res.data);
      const stocketType = recvData.socketType; //与后端约定type
      //如果存在，直接调用
      const callBack = this.callBackMapping[stocketType]; //执行订阅的回调
      if (callBack) {
        const action = recvData.action;
        if (action === 'getData') {
          //   const realData = JSON.parse(recvData.data);
          const realData = recvData.data;
          //将数据传给回调函数
          callBack.call(this, realData);
        } else if (action === 'fullScreen') {
        } else if (action === 'themeChange') {
        }
      }
    };
  }

  //注册回调函数,可能有多个scoket
  registerCallBack(socketType: string, callBack: (data: Object) => void) {
    this.callBackMapping[socketType] = callBack;
  }

  unRegisterCallBack(socketType: string) {
    this.callBackMapping[socketType] = null;
  }

  send(data: WebSocketDataParams) {
    if (this.isconnect) {
      this.sendRetryCount = 0; //发送成功重置为0
      this.ws.send(JSON.stringify(data));
    } else {
      setTimeout(() => {
        this.sendRetryCount++;
        this.send(data);
      }, this.sendRetryCount * 500);
    }
  }
}
const wss = SocketService.Instance;
export { wss };
