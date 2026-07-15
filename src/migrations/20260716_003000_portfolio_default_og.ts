import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "portfolio_default_og_image_id" integer;

    DO $$ BEGIN
      ALTER TABLE "site_settings"
        ADD CONSTRAINT "site_settings_portfolio_default_og_image_id_media_id_fk"
        FOREIGN KEY ("portfolio_default_og_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "site_settings_portfolio_default_og_image_idx"
      ON "site_settings" USING btree ("portfolio_default_og_image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings"
      DROP CONSTRAINT IF EXISTS "site_settings_portfolio_default_og_image_id_media_id_fk";
    DROP INDEX IF EXISTS "site_settings_portfolio_default_og_image_idx";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "portfolio_default_og_image_id";
  `)
}
