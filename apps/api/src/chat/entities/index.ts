import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('chat_sessions')
@Index(['userId', 'isActive'])
export class ChatSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ name: 'user_id' })
  @Index()
  userId: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity('messages')
@Index(['sessionId', 'createdAt'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: ['user', 'assistant', 'system'],
    default: 'user',
  })
  role: 'user' | 'assistant' | 'system';

  @Column({ name: 'session_id' })
  @Index()
  sessionId: string;

  @Column({
    type: 'enum',
    enum: ['sending', 'sent', 'error', 'streaming'],
    default: 'sent',
  })
  status: 'sending' | 'sent' | 'error' | 'streaming';

  @Column('jsonb', { nullable: true })
  metadata?: {
    model?: string;
    tokens?: number;
    processingTime?: number;
    temperature?: number;
    maxTokens?: number;
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}