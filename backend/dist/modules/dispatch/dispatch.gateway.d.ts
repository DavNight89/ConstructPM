import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DispatchService } from './dispatch.service';
import { UpdateLocationDto } from './dto/update-location.dto';
export declare class DispatchGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly dispatchService;
    server: Server;
    private logger;
    private workerSockets;
    private dispatcherSockets;
    constructor(dispatchService: DispatchService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleWorkerRegister(client: Socket, data: {
        workerId: string;
    }): {
        success: boolean;
        workerId: string;
        socketId: string;
    };
    handleDispatcherRegister(client: Socket): {
        success: boolean;
        workers: {
            workerId: string;
            socketId: string;
            online: boolean;
        }[];
        socketId: string;
    };
    handleLocationUpdate(client: Socket, data: {
        workerId: string;
        location: UpdateLocationDto;
    }): Promise<{
        success: boolean;
        worker: import("../../database/entities/worker.entity").Worker;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        worker?: undefined;
    }>;
    handleJobStatusUpdate(client: Socket, data: {
        jobId: string;
        status: string;
    }): Promise<{
        success: boolean;
        jobId: string;
        status: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        jobId?: undefined;
        status?: undefined;
    }>;
    handleWorkerRequestJob(client: Socket, data: {
        workerId: string;
    }): Promise<{
        success: boolean;
        job: import("../../database/entities/job.entity").Job | null;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        job?: undefined;
    }>;
    notifyWorker(workerId: string, event: string, data: any): void;
    notifyDispatchers(event: string, data: any): void;
    notifyJobAssignment(workerId: string, job: any): void;
    notifyJobUnassigned(workerId: string, jobId: string): void;
    broadcastJobUpdate(jobId: string, updates: any): void;
    broadcastWorkerUpdate(workerId: string, updates: any): void;
}
