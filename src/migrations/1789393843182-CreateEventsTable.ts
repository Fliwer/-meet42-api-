import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEventsTable1789393843182 implements MigrationInterface {
    name = 'CreateEventsTable1789393843182'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "source" character varying NOT NULL, "external_id" character varying NOT NULL, "slug" character varying NOT NULL, "title" character varying NOT NULL, "description" text, "category" character varying, "starts_at" TIMESTAMP WITH TIME ZONE NOT NULL, "ends_at" TIMESTAMP WITH TIME ZONE, "venue_name" character varying NOT NULL, "address" character varying, "district" character varying, "latitude" numeric(9,6) NOT NULL, "longitude" numeric(9,6) NOT NULL, "image_url" character varying, "official_url" character varying, "is_free" boolean NOT NULL DEFAULT false, "price_label" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_05bd884c03d3f424e2204bd14cd" UNIQUE ("slug"), CONSTRAINT "UQ_90394569873f662f0b9fba27b3f" UNIQUE ("source", "external_id"), CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_da080c835c9fc4e0aa5e8fe264" ON "events"  ("starts_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_da080c835c9fc4e0aa5e8fe264"`);
        await queryRunner.query(`DROP TABLE "events"`);
    }

}
