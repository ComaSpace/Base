declare module 'mysql2' {
  import * as mysql from 'mysql';

  export interface RowDataPacket {
    [column: string]: any;
  }

  export interface OkPacket {
    affectedRows: number;
    insertId: number;
    warningStatus: number;
  }

  export interface ResultSetHeader {
    fieldCount: number;
    affectedRows: number;
    insertId: number;
    info: string;
    serverStatus: number;
    warningStatus: number;
  }

  export function createConnection(connectionUri: string | mysql.ConnectionConfig): mysql.Connection;
  export function createPool(config: mysql.PoolConfig): mysql.Pool;
}
