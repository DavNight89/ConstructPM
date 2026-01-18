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

export enum WorkerStatus {
  AVAILABLE = 'available',
  ON_ROUTE = 'on-route',
  ON_SITE = 'on-site',
  OFFLINE = 'offline',
}

@Entity('workers')
export class Worker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: WorkerStatus,
    default: WorkerStatus.OFFLINE,
  })
  status: WorkerStatus;

  @Column({ type: 'uuid', nullable: true })
  currentJobId: string;

  @Column({ type: 'jsonb', nullable: true })
  currentLocation: {
    lat: number;
    lng: number;
    timestamp: Date;
  };

  @Column({ type: 'text', array: true, default: [] })
  skills: string[];

  @Column({ type: 'jsonb', nullable: true })
  certifications: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @OneToMany(() => Job, (job) => job.assignedWorker)
  jobs: Job[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
