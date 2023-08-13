import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { join } from "path";
import { config } from "dotenv";
import { Jurl } from "./entities/jurl.entity";
import { User } from "./entities/user.entity";
config();
export class Database {
  public static AppDataSource: DataSource;

  public static createPostgresDataSource(options: PostgresConnectionOptions) {
    return new DataSource(options);
  }

  public static async setupDb() {
    let DB_OPTIONS: PostgresConnectionOptions = {
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: process.env.NODE_ENV === "local" ? true : false,
      // synchronize: false,
      logging: false,
      entities: [join(__dirname, "/../**/**.entity{.ts,.js}")],
      namingStrategy: new SnakeNamingStrategy(),
    };

    this.AppDataSource = this.createPostgresDataSource(DB_OPTIONS);

    try {
      await this.AppDataSource.initialize();
      console.log("Database connection established");
    } catch (error) {
      console.error("Error while connecting to the database", error);
      throw error;
    }
  }
}

// this is used for migrations
const MigrationDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // entities: [join(__dirname, "/../**/**.entity{.ts,.js}")]
  entities: [Jurl, User],
  namingStrategy: new SnakeNamingStrategy(),

  migrations: ["src/migration/*"],
});

export default MigrationDataSource;
