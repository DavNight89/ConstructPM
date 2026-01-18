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
import { Job } from './job.entity';

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  ON_HOLD = 'on-hold',
}

export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: true })
  clientId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'clientId' })
  client: User;

  @Column({ type: 'uuid', nullable: true })
  managerId: string;

  @ManyToOne(() => User, (user) => user.managedProjects, { nullable: true })
  @JoinColumn({ name: 'managerId' })
  manager: User;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.PLANNING,
  })
  status: ProjectStatus;

  @Column({ type: 'int', default: 0 })
  progress: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  budget: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  spent: number;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  location: {
    address: string;
    lat: number;
    lng: number;
  };

  @Column({
    type: 'enum',
    enum: ProjectPriority,
    default: ProjectPriority.MEDIUM,
  })
  priority: ProjectPriority;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @OneToMany(() => Job, (job) => job.project)
  jobs: Job[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
