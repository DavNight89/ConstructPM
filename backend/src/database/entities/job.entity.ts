import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { Worker } from './worker.entity';

export enum JobStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum JobPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  jobNumber: string;

  @Column({ type: 'uuid' })
  projectId: string;

  @ManyToOne(() => Project, (project) => project.jobs)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column({ type: 'uuid', nullable: true })
  assignedWorkerId: string;

  @ManyToOne(() => Worker, (worker) => worker.jobs, { nullable: true })
  @JoinColumn({ name: 'assignedWorkerId' })
  assignedWorker: Worker;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.PENDING,
  })
  status: JobStatus;

  @Column({
    type: 'enum',
    enum: JobPriority,
    default: JobPriority.MEDIUM,
  })
  priority: JobPriority;

  @Column({ type: 'timestamp', nullable: true })
  scheduledTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  location: {
    address: string;
    lat: number;
    lng: number;
  };

  @Column({ type: 'int', nullable: true })
  estimatedDuration: number;

  @Column({ type: 'int', nullable: true })
  actualDuration: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
