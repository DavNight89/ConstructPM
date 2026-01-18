export declare class CreateSubmissionDto {
    formId: string;
    formVersion: number;
    projectId?: string;
    workerId?: string;
    jobId?: string;
    data: Record<string, any>;
    metadata?: {
        gpsLocation?: {
            lat: number;
            lng: number;
        };
        signature?: string;
        photos?: string[];
        ipAddress?: string;
        deviceInfo?: Record<string, any>;
    };
}
