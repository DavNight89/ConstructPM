import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { UpdateLocationDto } from './dto/update-location.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: 'dispatch',
})
export class DispatchGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('DispatchGateway');
  private workerSockets = new Map<string, string>(); // workerId -> socketId
  private dispatcherSockets = new Set<string>(); // socketIds of dispatchers

  constructor(private readonly dispatchService: DispatchService) {}

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    // Send welcome message
    client.emit('connected', {
      message: 'Connected to dispatch system',
      socketId: client.id,
    });
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    // Remove from worker sockets
    for (const [workerId, socketId] of this.workerSockets.entries()) {
      if (socketId === client.id) {
        this.workerSockets.delete(workerId);
        this.logger.log(`Worker ${workerId} disconnected`);

        // Notify dispatchers
        this.notifyDispatchers('worker:offline', {
          workerId,
          timestamp: new Date(),
        });
        break;
      }
    }

    // Remove from dispatcher sockets
    this.dispatcherSockets.delete(client.id);
  }

  @SubscribeMessage('worker:register')
  handleWorkerRegister(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { workerId: string },
  ) {
    const { workerId } = data;
    this.workerSockets.set(workerId, client.id);
    this.logger.log(`Worker registered: ${workerId} -> ${client.id}`);

    // Notify dispatchers
    this.notifyDispatchers('worker:online', {
      workerId,
      socketId: client.id,
      timestamp: new Date(),
    });

    return { success: true, workerId, socketId: client.id };
  }

  @SubscribeMessage('dispatcher:register')
  handleDispatcherRegister(@ConnectedSocket() client: Socket) {
    this.dispatcherSockets.add(client.id);
    this.logger.log(`Dispatcher registered: ${client.id}`);

    // Send current worker statuses
    const workers = Array.from(this.workerSockets.entries()).map(([workerId, socketId]) => ({
      workerId,
      socketId,
      online: true,
    }));

    return { success: true, workers, socketId: client.id };
  }

  @SubscribeMessage('location:update')
  async handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { workerId: string; location: UpdateLocationDto },
  ) {
    const { workerId, location } = data;

    try {
      // Update location in database
      const worker = await this.dispatchService.updateWorkerLocation(workerId, location);

      // Broadcast to all dispatchers
      this.notifyDispatchers('location:updated', {
        workerId,
        location: worker.currentLocation,
        status: worker.status,
      });

      return { success: true, worker };
    } catch (error) {
      this.logger.error(`Failed to update location for worker ${workerId}:`, error);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('job:status:update')
  async handleJobStatusUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { jobId: string; status: string },
  ) {
    const { jobId, status } = data;

    try {
      // Notify dispatchers about job status change
      this.notifyDispatchers('job:status:changed', {
        jobId,
        status,
        timestamp: new Date(),
      });

      return { success: true, jobId, status };
    } catch (error) {
      this.logger.error(`Failed to update job status ${jobId}:`, error);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('worker:request:job')
  async handleWorkerRequestJob(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { workerId: string },
  ) {
    const { workerId } = data;

    try {
      const currentJob = await this.dispatchService.getWorkerCurrentJob(workerId);
      return { success: true, job: currentJob };
    } catch (error) {
      this.logger.error(`Failed to get current job for worker ${workerId}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Public methods to notify clients from other services
  notifyWorker(workerId: string, event: string, data: any) {
    const socketId = this.workerSockets.get(workerId);
    if (socketId) {
      this.server.to(socketId).emit(event, data);
      this.logger.log(`Sent ${event} to worker ${workerId}`);
    } else {
      this.logger.warn(`Worker ${workerId} is not connected`);
    }
  }

  notifyDispatchers(event: string, data: any) {
    this.dispatcherSockets.forEach((socketId) => {
      this.server.to(socketId).emit(event, data);
    });
    this.logger.log(`Sent ${event} to ${this.dispatcherSockets.size} dispatchers`);
  }

  notifyJobAssignment(workerId: string, job: any) {
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

  notifyJobUnassigned(workerId: string, jobId: string) {
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

  broadcastJobUpdate(jobId: string, updates: any) {
    this.server.emit('job:updated', {
      jobId,
      updates,
      timestamp: new Date(),
    });
  }

  broadcastWorkerUpdate(workerId: string, updates: any) {
    this.server.emit('worker:updated', {
      workerId,
      updates,
      timestamp: new Date(),
    });
  }
}
