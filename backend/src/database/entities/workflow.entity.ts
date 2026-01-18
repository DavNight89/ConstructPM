import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { WorkflowExecution } from './workflow-execution.entity';

export enum WorkflowStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  ARCHIVED = 'archived',
}

@Entity('workflows')
export class Workflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: WorkflowStatus,
    default: WorkflowStatus.ACTIVE,
  })
  status: WorkflowStatus;

  @Column()
  triggerType: string;

  @Column({ type: 'jsonb' })
  triggerConfig: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  conditions: Record<string, any>[];

  @Column({ type: 'jsonb' })
  actions: Record<string, any>[];

  @Column({ type: 'int', default: 0 })
  executionCount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastExecution: Date;

  @Column({ type: 'uuid' })
  createdBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @OneToMany(() => WorkflowExecution, (execution) => execution.workflow)
  executions: WorkflowExecution[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
