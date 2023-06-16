import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTimeEntity } from '../auth/utils/base-time.entity';
import { ProfileImage } from '../auth/profile-image.entity';

@Entity()
export class User extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'e_mail', nullable: false })
  email: string;

  @Column({ name: 'nickname', default: null })
  nickname: string;

  @ManyToOne(() => ProfileImage, { eager: true })
  @JoinColumn({ name: 'image_id' })
  image: ProfileImage;

  @Column({ name: 'second_auth_secret', default: null })
  secondAuthSecret: string;
}
