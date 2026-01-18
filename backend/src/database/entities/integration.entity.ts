import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum IntegrationType {
  QUICKBOOKS = 'quickbooks',
  SALESFORCE = 'salesforce',
  SHAREPOINT = 'sharepoint',
  SQL_SERVER = 'sql-server',
  ORACLE = 'oracle',
  MYSQL = 'mysql',
  GOOGLE_DRIVE = 'google-drive',
  DROPBOX = 'dropbox',
  BOX = 'box',
}

export enum IntegrationStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
}

@Entity('integrations')
export class Integration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: IntegrationType,
  })
  type: IntegrationType;

  @Column({
    type: 'enum',
    enum: IntegrationStatus,
    default: IntegrationStatus.DISCONNECTED,
  })
  status: IntegrationStatus;

  @Column({ type: 'jsonb', nullable: true })
  credentials: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  config: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  lastSync: Date;

  @Column({ nullable: true })
  syncStatus: string;

  @Column({ type: 'text', nullable: true })
  errorLog: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
