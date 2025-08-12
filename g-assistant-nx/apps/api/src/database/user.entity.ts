import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ConversationEntity } from './conversation.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ type: 'json', nullable: true })
  preferences: {
    language: string;
    theme: string;
    defaultAgent: string;
    defaultMode: string;
  };

  @Column({ type: 'json', nullable: true })
  profile: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    bio?: string;
  };

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: true })
  lastLoginIp: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ConversationEntity, conversation => conversation.user)
  conversations: ConversationEntity[];
}