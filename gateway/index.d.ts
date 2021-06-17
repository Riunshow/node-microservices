export {}

declare global {
  namespace NodeJS {
    interface Global {
      zk: any;
    }
  }
}
