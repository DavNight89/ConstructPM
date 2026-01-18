declare enum ProjectStatus {
    PLANNING = "planning",
    ACTIVE = "active",
    ON_HOLD = "on_hold",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
declare enum ProjectPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export declare class FilterProjectDto {
    status?: ProjectStatus;
    priority?: ProjectPriority;
    managerId?: string;
    search?: string;
    page?: number;
    limit?: number;
}
export {};
