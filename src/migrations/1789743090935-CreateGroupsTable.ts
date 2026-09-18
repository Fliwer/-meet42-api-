import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGroupsTable1789743090935 implements MigrationInterface {
    name = 'CreateGroupsTable1789743090935'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "meeting_point" character varying NOT NULL, "max_participants" smallint NOT NULL DEFAULT '6', "emblem_emoji" character varying, "emblem_color" character varying, "eventId" uuid, CONSTRAINT "CHK_ff6f296f2431b190d3a4ef59fb" CHECK ("max_participants" BETWEEN 4 AND 8), CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_23e4846f2b252c597e2b4f0112" ON "groups"  ("eventId") `);
        await queryRunner.query(`CREATE TABLE "group_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" character varying NOT NULL DEFAULT 'member', "intro" character varying NOT NULL, "confirmed_at" TIMESTAMP WITH TIME ZONE, "joined_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "groupId" uuid, "userId" uuid, CONSTRAINT "UQ_53f644f66a416c1542b743c0295" UNIQUE ("groupId", "userId"), CONSTRAINT "CHK_ee414a509a820bddb5b1207dc2" CHECK ("role" IN ('host', 'member')), CONSTRAINT "PK_86446139b2c96bfd0f3b8638852" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fdef099303bcf0ffd9a4a7b18f" ON "group_members"  ("userId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_803b2d1daafac398372d45343a" ON "group_members"  ("groupId") WHERE role = 'host'`);
        await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "FK_23e4846f2b252c597e2b4f01127" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_members" ADD CONSTRAINT "FK_1aa8d31831c3126947e7a713c2b" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_members" ADD CONSTRAINT "FK_fdef099303bcf0ffd9a4a7b18f5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_members" DROP CONSTRAINT "FK_fdef099303bcf0ffd9a4a7b18f5"`);
        await queryRunner.query(`ALTER TABLE "group_members" DROP CONSTRAINT "FK_1aa8d31831c3126947e7a713c2b"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_23e4846f2b252c597e2b4f01127"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_803b2d1daafac398372d45343a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fdef099303bcf0ffd9a4a7b18f"`);
        await queryRunner.query(`DROP TABLE "group_members"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_23e4846f2b252c597e2b4f0112"`);
        await queryRunner.query(`DROP TABLE "groups"`);
    }

}
