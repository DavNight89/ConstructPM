import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Project } from './project.entity';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  WORKER = 'worker',
  CLIENT = 'client',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.WORKER,
  })
  role: UserRole;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: false })
  mfaEnabled: boolean;

  @Column({ nullable: true, select: false })
  mfaSecret: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @OneToMany(() => Project, (project) => project.manager)
  managedProjects: Project[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
