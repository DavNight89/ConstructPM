import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Workflow } from './workflow.entity';

export enum ExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('workflow_executions')
export class WorkflowExecution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  workflowId: string;

  @ManyToOne(() => Workflow, (workflow) => workflow.executions)
  @JoinColumn({ name: 'workflowId' })
  workflow: Workflow;

  @Column({ type: 'jsonb' })
  triggerData: Record<string, any>;

  @Column({
    type: 'enum',
    enum: ExecutionStatus,
    default: ExecutionStatus.PENDING,
  })
  executionStatus: ExecutionStatus;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'jsonb', nullable: true })
  logs: Record<string, any>[];

  @CreateDateColumn()
  createdAt: Date;
}
