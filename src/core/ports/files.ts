/** Puerto de almacenamiento para módulos futuros; sin adaptador aún. */
export interface FileStore {
  upload(path: string, bytes: Blob): Promise<string>;
  download(path: string): Promise<Blob>;
}