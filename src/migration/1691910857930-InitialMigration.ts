import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1691910857930 implements MigrationInterface {
    name = 'InitialMigration1691910857930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "jurl" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "hash_url" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "UQ_3c47ceb3ad7493263dbe52d7ad8" UNIQUE ("hash_url"), CONSTRAINT "PK_b56c74a2b1002aa39d32b3a934f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "jurl" ADD CONSTRAINT "FK_e5c4c3e3edc1c68b0c2ad9e1522" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jurl" DROP CONSTRAINT "FK_e5c4c3e3edc1c68b0c2ad9e1522"`);
        await queryRunner.query(`DROP TABLE "jurl"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
