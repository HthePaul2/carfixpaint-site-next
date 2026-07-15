import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "portfolio_projects" ADD COLUMN IF NOT EXISTS "og_image_id" integer;
    ALTER TABLE "_portfolio_projects_v" ADD COLUMN IF NOT EXISTS "version_og_image_id" integer;

    DO $$ BEGIN
      ALTER TABLE "portfolio_projects"
        ADD CONSTRAINT "portfolio_projects_og_image_id_media_id_fk"
        FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_portfolio_projects_v"
        ADD CONSTRAINT "_portfolio_projects_v_version_og_image_id_media_id_fk"
        FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "portfolio_projects_og_image_idx"
      ON "portfolio_projects" USING btree ("og_image_id");
    CREATE INDEX IF NOT EXISTS "_portfolio_projects_v_version_version_og_image_idx"
      ON "_portfolio_projects_v" USING btree ("version_og_image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "portfolio_projects" DROP CONSTRAINT IF EXISTS "portfolio_projects_og_image_id_media_id_fk";
    ALTER TABLE "_portfolio_projects_v" DROP CONSTRAINT IF EXISTS "_portfolio_projects_v_version_og_image_id_media_id_fk";
    DROP INDEX IF EXISTS "portfolio_projects_og_image_idx";
    DROP INDEX IF EXISTS "_portfolio_projects_v_version_version_og_image_idx";
    ALTER TABLE "portfolio_projects" DROP COLUMN IF EXISTS "og_image_id";
    ALTER TABLE "_portfolio_projects_v" DROP COLUMN IF EXISTS "version_og_image_id";
  `)
}
