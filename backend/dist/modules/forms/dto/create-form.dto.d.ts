declare class FormFieldDto {
    id: string;
    type: string;
    label: string;
    placeholder?: string;
    required: boolean;
    validation?: Record<string, any>;
    options?: string[];
    defaultValue?: any;
    properties: Record<string, any>;
}
declare class FormSettingsDto {
    requireGPS: boolean;
    requireSignature: boolean;
    allowOffline: boolean;
    emailNotifications: boolean;
    autoSubmit?: boolean;
}
export declare class CreateFormDto {
    name: string;
    category: string;
    version?: number;
    fields: FormFieldDto[];
    settings: FormSettingsDto;
    logic?: Array<{
        condition: Record<string, any>;
        actions: Record<string, any>[];
    }>;
    metadata: {
        createdBy: string;
        submissions?: number;
    };
}
export {};
