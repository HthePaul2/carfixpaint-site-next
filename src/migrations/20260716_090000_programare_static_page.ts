import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "static_pages" ADD COLUMN IF NOT EXISTS "programare_page_title" varchar;
    ALTER TABLE "static_pages" ADD COLUMN IF NOT EXISTS "programare_page_subtitle" varchar;
    ALTER TABLE "static_pages" ADD COLUMN IF NOT EXISTS "programare_seo_title" varchar;
    ALTER TABLE "static_pages" ADD COLUMN IF NOT EXISTS "programare_seo_description" varchar;
    ALTER TABLE "static_pages" ADD COLUMN IF NOT EXISTS "programare_seo_keywords" varchar;
    ALTER TABLE "static_pages" ADD COLUMN IF NOT EXISTS "programare_og_title" varchar;
    ALTER TABLE "static_pages" ADD COLUMN IF NOT EXISTS "programare_og_description" varchar;
    ALTER TABLE "static_pages" ADD COLUMN IF NOT EXISTS "programare_og_image_id" integer;

    UPDATE "static_pages"
    SET "programare_page_title" = COALESCE(
      NULLIF("programare_page_title", ''),
      'Solicită o programare pentru constatare'
    )
    WHERE "programare_page_title" IS NULL OR "programare_page_title" = '';

    DO $$ BEGIN
      ALTER TABLE "static_pages" ALTER COLUMN "programare_page_title" SET NOT NULL;
    EXCEPTION WHEN others THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "static_pages"
        ADD CONSTRAINT "static_pages_programare_og_image_id_media_id_fk"
        FOREIGN KEY ("programare_og_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "static_pages_programare_programare_og_image_idx"
      ON "static_pages" USING btree ("programare_og_image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "static_pages" DROP CONSTRAINT IF EXISTS "static_pages_programare_og_image_id_media_id_fk";
    DROP INDEX IF EXISTS "static_pages_programare_programare_og_image_idx";
    ALTER TABLE "static_pages" DROP COLUMN IF EXISTS "programare_page_title";
    ALTER TABLE "static_pages" DROP COLUMN IF EXISTS "programare_page_subtitle";
    ALTER TABLE "static_pages" DROP COLUMN IF EXISTS "programare_seo_title";
    ALTER TABLE "static_pages" DROP COLUMN IF EXISTS "programare_seo_description";
    ALTER TABLE "static_pages" DROP COLUMN IF EXISTS "programare_seo_keywords";
    ALTER TABLE "static_pages" DROP COLUMN IF EXISTS "programare_og_title";
    ALTER TABLE "static_pages" DROP COLUMN IF EXISTS "programare_og_description";
    ALTER TABLE "static_pages" DROP COLUMN IF EXISTS "programare_og_image_id";
  `)
}
