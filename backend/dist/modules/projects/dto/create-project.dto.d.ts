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
export declare class CreateProjectDto {
    name: string;
    description?: string;
    address?: string;
    budget: number;
    spent?: number;
    startDate: Date;
    endDate: Date;
    status?: ProjectStatus;
    priority?: ProjectPriority;
    progress?: number;
    location?: {
        lat: number;
        lng: number;
        address?: string;
    };
    managerId: string;
}
export {};
