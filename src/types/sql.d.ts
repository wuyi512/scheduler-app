declare module 'sql.js' {
    export interface Database {
        exec(sql: string, params?: any[]): any[];
        run(sql: string, params?: any[]): Database;
        prepare(sql: string): Statement;
        each(sql: string, params: any[], callback: (row: any) => void, done: () => void): void;
        export(): Uint8Array;
    }

    export interface Statement {
        bind(params?: any[]): boolean;
        step(): boolean;
        get(): any[];
        getColumnNames(): string[];
        getAsObject(): any;
        run(): Statement;
        free(): void;
    }

    export interface SqlJsStatic {
        Database: new (data?: any[]) => Database;
        Statement: any;
        (config?: { locateFile?: (file: string) => string, wasmBinary?: ArrayBuffer }): Promise<SqlJsStatic>;
    }

    const initSqlJs: (config?: { locateFile?: (file: string) => string, wasmBinary?: ArrayBuffer }) => Promise<SqlJsStatic>;

    export default initSqlJs;
}

declare module 'sql.js/dist/sql-wasm-browser.js' {
    const initSqlJs: (config?: { locateFile?: (file: string) => string, wasmBinary?: ArrayBuffer }) => Promise<any>;
    export default initSqlJs;
}