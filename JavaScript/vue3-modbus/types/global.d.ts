declare global {
  interface Window {
    test(...data: any[]): void;
  }
  declare let test: (...data: any[]) => void;
}
export {};
