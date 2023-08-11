import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Jurl } from "./jurl.entity";

@Entity()
export class User {
  // ...
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Jurl, (jurl) => jurl.user)
  urls: Jurl[];
}
