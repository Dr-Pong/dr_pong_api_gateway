import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from './utils/base-time.entity';

@Entity()
export class ProfileImage extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'url', nullable: false })
  url: string;
}
