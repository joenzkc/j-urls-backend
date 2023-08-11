import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

/**
 * This entity is named "Jurl" for J-url, specifically I am sharing this database
 * with another project that uses the same database, so I am avoiding conflicting names
 */
@Entity()
export class Jurl {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  actualUrl: string;

  @Column({ unique: true })
  hashUrl: string;

  @JoinColumn()
  @ManyToOne(() => User, (jurl) => jurl.id)
  user: User;
}
