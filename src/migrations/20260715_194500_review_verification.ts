import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_reviews_source" AS ENUM('google', 'facebook', 'direct', 'other');
    ALTER TABLE "reviews" ADD COLUMN "source" "enum_reviews_source";
    ALTER TABLE "reviews" ADD COLUMN "source_url" varchar;
    ALTER TABLE "reviews" ADD COLUMN "consent_confirmed" boolean DEFAULT false;
    ALTER TABLE "reviews" ADD COLUMN "verified" boolean DEFAULT false;
    ALTER TABLE "reviews" ADD COLUMN "verified_at" timestamp(3) with time zone;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "reviews" DROP COLUMN "source";
    ALTER TABLE "reviews" DROP COLUMN "source_url";
    ALTER TABLE "reviews" DROP COLUMN "consent_confirmed";
    ALTER TABLE "reviews" DROP COLUMN "verified";
    ALTER TABLE "reviews" DROP COLUMN "verified_at";
    DROP TYPE "public"."enum_reviews_source";
  `)
}
