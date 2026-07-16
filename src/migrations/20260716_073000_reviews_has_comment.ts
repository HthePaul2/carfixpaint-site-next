import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "has_comment" boolean DEFAULT false;
    ALTER TABLE "reviews" ALTER COLUMN "text" DROP NOT NULL;

    UPDATE "reviews"
    SET "has_comment" = CASE
      WHEN "text" IS NULL OR btrim("text") = '' THEN false
      WHEN "text" LIKE '[Evaluare Google%' THEN false
      WHEN "text" LIKE '[Evaluare de %' THEN false
      ELSE true
    END;

    UPDATE "reviews"
    SET "text" = NULL
    WHERE "has_comment" = false;

    CREATE INDEX IF NOT EXISTS "reviews_has_comment_idx"
      ON "reviews" USING btree ("has_comment");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "reviews"
    SET "text" = COALESCE("text", '')
    WHERE "text" IS NULL;

    ALTER TABLE "reviews" ALTER COLUMN "text" SET NOT NULL;
    DROP INDEX IF EXISTS "reviews_has_comment_idx";
    ALTER TABLE "reviews" DROP COLUMN IF EXISTS "has_comment";
  `)
}
