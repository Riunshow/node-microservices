export interface Settings {
  // grpc bind port
  PORT: string | number;

  // grpc bind host
  HOST?: string;

  // ca file path string
  ca?: string;

  // cert file path string
  cert?: string;

  // key file path string
  key?: string;
}
