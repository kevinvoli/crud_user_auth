import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Role } from './role.entity';

export enum Action {
  Read = 'read',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}


@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:"enum",enum:Action,default: Action.Read,enumName: 'action_enum'})
  action: Action;

  @Column()
  resource: string;

  @Column({ type: 'json', nullable: true })
  conditions: Record<string, any>;

  @CreateDateColumn({type:'datetime',  name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({type:'datetime', name: 'updated_at'})
  updatedAt: Date;

  @DeleteDateColumn({type:'datetime', name: 'delected_at'})
  delectedAt:Date;

  @ManyToOne(() => Role, (role) => role.permissions, { onDelete: 'CASCADE' })
  role: Role;
}
