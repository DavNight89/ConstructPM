export declare enum IntegrationType {
    QUICKBOOKS = "quickbooks",
    SALESFORCE = "salesforce",
    SHAREPOINT = "sharepoint",
    SQL_SERVER = "sql-server",
    ORACLE = "oracle",
    MYSQL = "mysql",
    GOOGLE_DRIVE = "google-drive",
    DROPBOX = "dropbox",
    BOX = "box"
}
export declare enum IntegrationStatus {
    CONNECTED = "connected",
    DISCONNECTED = "disconnected",
    ERROR = "error"
}
export declare class Integration {
    id: string;
    name: string;
    type: IntegrationType;
    status: IntegrationStatus;
    credentials: Record<string, any>;
    config: Record<string, any>;
    lastSync: Date;
    syncStatus: string;
    errorLog: string;
    createdAt: Date;
    updatedAt: Date;
}
