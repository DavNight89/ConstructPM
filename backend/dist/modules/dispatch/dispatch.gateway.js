"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const dispatch_service_1 = require("./dispatch.service");
let DispatchGateway = class DispatchGateway {
    dispatchService;
    server;
    logger = new common_1.Logger('DispatchGateway');
    workerSockets = new Map();
    dispatcherSockets = new Set();
    constructor(dispatchService) {
        this.dispatchService = dispatchService;
    }
    async handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
        client.emit('connected', {
            message: 'Connected to dispatch system',
            socketId: client.id,
        });
    }
    async handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        for (const [workerId, socketId] of this.workerSockets.entries()) {
            if (socketId === client.id) {
                this.workerSockets.delete(workerId);
                this.logger.log(`Worker ${workerId} disconnected`);
                this.notifyDispatchers('worker:offline', {
                    workerId,
                    timestamp: new Date(),
                });
                break;
            }
        }
        this.dispatcherSockets.delete(client.id);
    }
    handleWorkerRegister(client, data) {
        const { workerId } = data;
        this.workerSockets.set(workerId, client.id);
        this.logger.log(`Worker registered: ${workerId} -> ${client.id}`);
        this.notifyDispatchers('worker:online', {
            workerId,
            socketId: client.id,
            timestamp: new Date(),
        });
        return { success: true, workerId, socketId: client.id };
    }
    handleDispatcherRegister(client) {
        this.dispatcherSockets.add(client.id);
        this.logger.log(`Dispatcher registered: ${client.id}`);
        const workers = Array.from(this.workerSockets.entries()).map(([workerId, socketId]) => ({
            workerId,
            socketId,
            online: true,
        }));
        return { success: true, workers, socketId: client.id };
    }
    async handleLocationUpdate(client, data) {
        const { workerId, location } = data;
        try {
            const worker = await this.dispatchService.updateWorkerLocation(workerId, location);
            this.notifyDispatchers('location:updated', {
                workerId,
                location: worker.currentLocation,
                status: worker.status,
            });
            return { success: true, worker };
        }
        catch (error) {
            this.logger.error(`Failed to update location for worker ${workerId}:`, error);
            return { success: false, error: error.message };
        }
    }
    async handleJobStatusUpdate(client, data) {
        const { jobId, status } = data;
        try {
            this.notifyDispatchers('job:status:changed', {
                jobId,
                status,
                timestamp: new Date(),
            });
            return { success: true, jobId, status };
        }
        catch (error) {
            this.logger.error(`Failed to update job status ${jobId}:`, error);
            return { success: false, error: error.message };
        }
    }
    async handleWorkerRequestJob(client, data) {
        const { workerId } = data;
        try {
            const currentJob = await this.dispatchService.getWorkerCurrentJob(workerId);
            return { success: true, job: currentJob };
        }
        catch (error) {
            this.logger.error(`Failed to get current job for worker ${workerId}:`, error);
            return { success: false, error: error.message };
        }
    }
    notifyWorker(workerId, event, data) {
        const socketId = this.workerSockets.get(workerId);
        if (socketId) {
            this.server.to(socketId).emit(event, data);
            this.logger.log(`Sent ${event} to worker ${workerId}`);
        }
        else {
            this.logger.warn(`Worker ${workerId} is not connected`);
        }
    }
    notifyDispatchers(event, data) {
        this.dispatcherSockets.forEach((socketId) => {
            this.server.to(socketId).emit(event, data);
        });
        this.logger.log(`Sent ${event} to ${this.dispatcherSockets.size} dispatchers`);
    }
    notifyJobAssignment(workerId, job) {
        this.notifyWorker(workerId, 'job:assigned', {
            job,
            timestamp: new Date(),
        });
        this.notifyDispatchers('job:assigned', {
            workerId,
            jobId: job.id,
            timestamp: new Date(),
        });
    }
    notifyJobUnassigned(workerId, jobId) {
        this.notifyWorker(workerId, 'job:unassigned', {
            jobId,
            timestamp: new Date(),
        });
        this.notifyDispatchers('job:unassigned', {
            workerId,
            jobId,
            timestamp: new Date(),
        });
    }
    broadcastJobUpdate(jobId, updates) {
        this.server.emit('job:updated', {
            jobId,
            updates,
            timestamp: new Date(),
        });
    }
    broadcastWorkerUpdate(workerId, updates) {
        this.server.emit('worker:updated', {
            workerId,
            updates,
            timestamp: new Date(),
        });
    }
};
exports.DispatchGateway = DispatchGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], DispatchGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('worker:register'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], DispatchGateway.prototype, "handleWorkerRegister", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('dispatcher:register'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], DispatchGateway.prototype, "handleDispatcherRegister", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('location:update'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], DispatchGateway.prototype, "handleLocationUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('job:status:update'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], DispatchGateway.prototype, "handleJobStatusUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('worker:request:job'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], DispatchGateway.prototype, "handleWorkerRequestJob", null);
exports.DispatchGateway = DispatchGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            credentials: true,
        },
        namespace: 'dispatch',
    }),
    __metadata("design:paramtypes", [dispatch_service_1.DispatchService])
], DispatchGateway);
//# sourceMappingURL=dispatch.gateway.js.map