import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "page_slug" varchar;
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "hero_title" varchar;
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "hero_subtitle" varchar;
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "intro" varchar;
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "when_needed_title" varchar DEFAULT 'Când este recomandat acest serviciu';
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "process_title" varchar DEFAULT 'Cum lucrăm';
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "cta_title" varchar;
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "cta_description" varchar;
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "cta_primary_label" varchar DEFAULT 'Trimite poze pentru evaluare';
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "cta_secondary_label" varchar DEFAULT 'Solicită o programare';
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "og_image_id" integer;

    UPDATE "services" SET "page_slug" = "slug" WHERE "page_slug" IS NULL;

    DO $$ BEGIN
      ALTER TABLE "services" ALTER COLUMN "page_slug" SET NOT NULL;
    EXCEPTION WHEN others THEN NULL;
    END $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "services_page_slug_idx" ON "services" USING btree ("page_slug");

    DO $$ BEGIN
      ALTER TABLE "services"
        ADD CONSTRAINT "services_og_image_id_media_id_fk"
        FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "services_og_image_idx"
      ON "services" USING btree ("og_image_id");

    CREATE TABLE IF NOT EXISTS "services_when_needed_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "item" varchar NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "services_when_needed_items"
        ADD CONSTRAINT "services_when_needed_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "services_when_needed_items_order_idx"
      ON "services_when_needed_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "services_when_needed_items_parent_id_idx"
      ON "services_when_needed_items" USING btree ("_parent_id");

    CREATE TABLE IF NOT EXISTS "services_process_steps" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "description" varchar NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "services_process_steps"
        ADD CONSTRAINT "services_process_steps_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "services_process_steps_order_idx"
      ON "services_process_steps" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "services_process_steps_parent_id_idx"
      ON "services_process_steps" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "services_process_steps" CASCADE;
    DROP TABLE IF EXISTS "services_when_needed_items" CASCADE;

    ALTER TABLE "services" DROP CONSTRAINT IF EXISTS "services_og_image_id_media_id_fk";
    DROP INDEX IF EXISTS "services_og_image_idx";
    DROP INDEX IF EXISTS "services_page_slug_idx";

    ALTER TABLE "services" DROP COLUMN IF EXISTS "page_slug";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "hero_title";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "hero_subtitle";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "intro";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "when_needed_title";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "process_title";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "cta_title";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "cta_description";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "cta_primary_label";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "cta_secondary_label";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "og_image_id";
  `)
}
