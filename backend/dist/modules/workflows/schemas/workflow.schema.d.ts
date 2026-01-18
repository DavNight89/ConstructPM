import { Document, Types } from 'mongoose';
export type WorkflowDocument = Workflow & Document;
export declare enum TriggerType {
    FORM_SUBMIT = "form_submit",
    STATUS_CHANGE = "status_change",
    SCHEDULE = "schedule",
    MANUAL = "manual",
    WEBHOOK = "webhook"
}
export declare enum ActionType {
    SEND_EMAIL = "send_email",
    SEND_SMS = "send_sms",
    UPDATE_DATABASE = "update_database",
    CREATE_RECORD = "create_record",
    WEBHOOK = "webhook",
    ASSIGN_TASK = "assign_task",
    UPDATE_STATUS = "update_status"
}
export declare enum ConditionOperator {
    EQUALS = "equals",
    NOT_EQUALS = "not_equals",
    GREATER_THAN = "greater_than",
    LESS_THAN = "less_than",
    CONTAINS = "contains",
    NOT_CONTAINS = "not_contains",
    IS_EMPTY = "is_empty",
    IS_NOT_EMPTY = "is_not_empty"
}
export interface WorkflowCondition {
    field: string;
    operator: ConditionOperator;
    value: any;
    logicalOperator?: 'AND' | 'OR';
}
export interface WorkflowAction {
    type: ActionType;
    config: Record<string, any>;
    conditions?: WorkflowCondition[];
}
export interface WorkflowTrigger {
    type: TriggerType;
    config: Record<string, any>;
}
export declare class Workflow {
    name: string;
    description: string;
    trigger: WorkflowTrigger;
    actions: WorkflowAction[];
    conditions: WorkflowCondition[];
    isActive: boolean;
    createdBy: Types.ObjectId;
    organizationId: Types.ObjectId;
    metadata: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const WorkflowSchema: import("mongoose").Schema<Workflow, import("mongoose").Model<Workflow, any, any, any, Document<unknown, any, Workflow, any, {}> & Workflow & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Workflow, Document<unknown, {}, import("mongoose").FlatRecord<Workflow>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Workflow> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
