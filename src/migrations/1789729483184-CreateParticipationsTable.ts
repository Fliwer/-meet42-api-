import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateParticipationsTable1789729483184 implements MigrationInterface {
    name = 'CreateParticipationsTable1789729483184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "participations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "present_at" TIMESTAMP WITH TIME ZONE, "userId" uuid, "eventId" uuid, CONSTRAINT "UQ_c248eb19ce0407bf1e48c175b47" UNIQUE ("userId", "eventId"), CONSTRAINT "PK_7aa63b8dcd3d6f8aef8a98bb14a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1e3058117599dfa285d5a2de4f" ON "participations"  ("eventId") `);
        await queryRunner.query(`ALTER TABLE "participations" ADD CONSTRAINT "FK_b96d1e076744a3081adbb791c48" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "participations" ADD CONSTRAINT "FK_1e3058117599dfa285d5a2de4f2" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participations" DROP CONSTRAINT "FK_1e3058117599dfa285d5a2de4f2"`);
        await queryRunner.query(`ALTER TABLE "participations" DROP CONSTRAINT "FK_b96d1e076744a3081adbb791c48"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1e3058117599dfa285d5a2de4f"`);
        await queryRunner.query(`DROP TABLE "participations"`);
    }

}
