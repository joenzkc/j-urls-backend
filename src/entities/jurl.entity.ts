import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";

/**
 * This entity is named "Jurl" for J-url, specifically I am sharing this database
 * with another project that uses the same database, so I am avoiding conflicting names
 */
@Unique(["hashUrl", "isActive"])
@Entity()
export class Jurl {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  url: string;

  @Column({ unique: true })
  hashUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @JoinColumn()
  @ManyToOne(() => User, (jurl) => jurl.id)
  user: User;
}
