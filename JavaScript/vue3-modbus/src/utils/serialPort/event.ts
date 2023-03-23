type SerialEvent = "open" | "close" | "data" | "send" | "error" | (string & {});
/**
 * 串口事件类
 */
export default class SerialEventTarget {
  private eventMap: Map<SerialEvent, Function[]> = new Map();
  /**
   * 监听事件
   * @param eventName 事件名称
   * @param listener 监听器
   */
  public on(eventName: SerialEvent, listener: Function) {
    let listeners = this.eventMap.get(eventName) ?? [];
    listeners.push(listener);
    this.eventMap.set(eventName, listeners);
  }
  /**
   * 按添加顺序, 同步地执行监听事件
   * @param eventName 事件名称
   */
  public async emit(eventName: SerialEvent, ...args: any[]) {
    let listeners = this.eventMap.get(eventName);
    if (!listeners) return;
    for (let listener of listeners) {
      await listener(...args);
    }
  }
  /**
   * 关闭事件监听
   * @param eventName 事件名称
   * @param listener 监听器
   */
  public off(eventName: SerialEvent, listener: Function) {
    let listeners = this.eventMap.get(eventName);
    if (!listeners) return;
    let index = listeners.indexOf(listener);
    if (index !== -1) return;
    listeners.splice(index, 1);
  }
}
