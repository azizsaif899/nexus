import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('conversations')
export class ConversationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sessionId: string;

  @Column('uuid')
  userId: string;

  @Column('text')
  userMessage: string;

  @Column('text')
  aiResponse: string;

  @Column({ nullable: true })
  intent: string;

  @Column({ nullable: true })
  sentiment: string;

  @Column({ nullable: true })
  agent: string;

  @Column({ nullable: true })
  mode: string;

  @Column({ type: 'json', nullable: true })
  context: {
    topics?: string[];
    entities?: any[];
    confidence?: number;
    responseTime?: number;
  };

  @Column({ type: 'json', nullable: true })
  metadata: {
    ip?: string;
    userAgent?: string;
    platform?: string;
    language?: string;
  };

  @Column({ default: false })
  isArchived: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, user => user.conversations)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}