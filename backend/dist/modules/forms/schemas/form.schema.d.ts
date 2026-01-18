import { Document } from 'mongoose';
export type FormDocument = Form & Document;
export declare class Form {
    name: string;
    category: string;
    version: number;
    fields: Array<{
        id: string;
        type: string;
        label: string;
        placeholder?: string;
        required: boolean;
        validation?: Record<string, any>;
        options?: string[];
        defaultValue?: any;
        properties: Record<string, any>;
    }>;
    settings: {
        requireGPS: boolean;
        requireSignature: boolean;
        allowOffline: boolean;
        emailNotifications: boolean;
        autoSubmit?: boolean;
    };
    logic: Array<{
        condition: Record<string, any>;
        actions: Record<string, any>[];
    }>;
    metadata: {
        createdBy: string;
        submissions: number;
    };
}
export declare const FormSchema: import("mongoose").Schema<Form, import("mongoose").Model<Form, any, any, any, Document<unknown, any, Form, any, {}> & Form & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Form, Document<unknown, {}, import("mongoose").FlatRecord<Form>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Form> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
