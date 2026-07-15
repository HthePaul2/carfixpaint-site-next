import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "homepage" ADD COLUMN "og_image_id" integer;
  ALTER TABLE "static_pages" ADD COLUMN "servicii_og_image_id" integer;
  ALTER TABLE "static_pages" ADD COLUMN "daune_og_image_id" integer;
  ALTER TABLE "static_pages" ADD COLUMN "portofoliu_og_image_id" integer;
  ALTER TABLE "static_pages" ADD COLUMN "despre_og_image_id" integer;
  ALTER TABLE "static_pages" ADD COLUMN "recenzii_og_image_id" integer;
  ALTER TABLE "static_pages" ADD COLUMN "faq_og_image_id" integer;
  ALTER TABLE "static_pages" ADD COLUMN "blog_og_image_id" integer;
  ALTER TABLE "static_pages" ADD COLUMN "contact_og_image_id" integer;
  ALTER TABLE "legal_pages" ADD COLUMN "privacy_og_image_id" integer;
  ALTER TABLE "legal_pages" ADD COLUMN "cookies_og_image_id" integer;
  ALTER TABLE "legal_pages" ADD COLUMN "terms_og_image_id" integer;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "static_pages" ADD CONSTRAINT "static_pages_servicii_og_image_id_media_id_fk" FOREIGN KEY ("servicii_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "static_pages" ADD CONSTRAINT "static_pages_daune_og_image_id_media_id_fk" FOREIGN KEY ("daune_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "static_pages" ADD CONSTRAINT "static_pages_portofoliu_og_image_id_media_id_fk" FOREIGN KEY ("portofoliu_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "static_pages" ADD CONSTRAINT "static_pages_despre_og_image_id_media_id_fk" FOREIGN KEY ("despre_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "static_pages" ADD CONSTRAINT "static_pages_recenzii_og_image_id_media_id_fk" FOREIGN KEY ("recenzii_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "static_pages" ADD CONSTRAINT "static_pages_faq_og_image_id_media_id_fk" FOREIGN KEY ("faq_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "static_pages" ADD CONSTRAINT "static_pages_blog_og_image_id_media_id_fk" FOREIGN KEY ("blog_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "static_pages" ADD CONSTRAINT "static_pages_contact_og_image_id_media_id_fk" FOREIGN KEY ("contact_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legal_pages" ADD CONSTRAINT "legal_pages_privacy_og_image_id_media_id_fk" FOREIGN KEY ("privacy_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legal_pages" ADD CONSTRAINT "legal_pages_cookies_og_image_id_media_id_fk" FOREIGN KEY ("cookies_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legal_pages" ADD CONSTRAINT "legal_pages_terms_og_image_id_media_id_fk" FOREIGN KEY ("terms_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "homepage_og_image_idx" ON "homepage" USING btree ("og_image_id");
  CREATE INDEX "static_pages_servicii_servicii_og_image_idx" ON "static_pages" USING btree ("servicii_og_image_id");
  CREATE INDEX "static_pages_daune_daune_og_image_idx" ON "static_pages" USING btree ("daune_og_image_id");
  CREATE INDEX "static_pages_portofoliu_portofoliu_og_image_idx" ON "static_pages" USING btree ("portofoliu_og_image_id");
  CREATE INDEX "static_pages_despre_despre_og_image_idx" ON "static_pages" USING btree ("despre_og_image_id");
  CREATE INDEX "static_pages_recenzii_recenzii_og_image_idx" ON "static_pages" USING btree ("recenzii_og_image_id");
  CREATE INDEX "static_pages_faq_faq_og_image_idx" ON "static_pages" USING btree ("faq_og_image_id");
  CREATE INDEX "static_pages_blog_blog_og_image_idx" ON "static_pages" USING btree ("blog_og_image_id");
  CREATE INDEX "static_pages_contact_contact_og_image_idx" ON "static_pages" USING btree ("contact_og_image_id");
  CREATE INDEX "legal_pages_privacy_og_image_idx" ON "legal_pages" USING btree ("privacy_og_image_id");
  CREATE INDEX "legal_pages_cookies_og_image_idx" ON "legal_pages" USING btree ("cookies_og_image_id");
  CREATE INDEX "legal_pages_terms_og_image_idx" ON "legal_pages" USING btree ("terms_og_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "homepage" DROP CONSTRAINT "homepage_og_image_id_media_id_fk";
  
  ALTER TABLE "static_pages" DROP CONSTRAINT "static_pages_servicii_og_image_id_media_id_fk";
  
  ALTER TABLE "static_pages" DROP CONSTRAINT "static_pages_daune_og_image_id_media_id_fk";
  
  ALTER TABLE "static_pages" DROP CONSTRAINT "static_pages_portofoliu_og_image_id_media_id_fk";
  
  ALTER TABLE "static_pages" DROP CONSTRAINT "static_pages_despre_og_image_id_media_id_fk";
  
  ALTER TABLE "static_pages" DROP CONSTRAINT "static_pages_recenzii_og_image_id_media_id_fk";
  
  ALTER TABLE "static_pages" DROP CONSTRAINT "static_pages_faq_og_image_id_media_id_fk";
  
  ALTER TABLE "static_pages" DROP CONSTRAINT "static_pages_blog_og_image_id_media_id_fk";
  
  ALTER TABLE "static_pages" DROP CONSTRAINT "static_pages_contact_og_image_id_media_id_fk";
  
  ALTER TABLE "legal_pages" DROP CONSTRAINT "legal_pages_privacy_og_image_id_media_id_fk";
  
  ALTER TABLE "legal_pages" DROP CONSTRAINT "legal_pages_cookies_og_image_id_media_id_fk";
  
  ALTER TABLE "legal_pages" DROP CONSTRAINT "legal_pages_terms_og_image_id_media_id_fk";
  
  DROP INDEX "homepage_og_image_idx";
  DROP INDEX "static_pages_servicii_servicii_og_image_idx";
  DROP INDEX "static_pages_daune_daune_og_image_idx";
  DROP INDEX "static_pages_portofoliu_portofoliu_og_image_idx";
  DROP INDEX "static_pages_despre_despre_og_image_idx";
  DROP INDEX "static_pages_recenzii_recenzii_og_image_idx";
  DROP INDEX "static_pages_faq_faq_og_image_idx";
  DROP INDEX "static_pages_blog_blog_og_image_idx";
  DROP INDEX "static_pages_contact_contact_og_image_idx";
  DROP INDEX "legal_pages_privacy_og_image_idx";
  DROP INDEX "legal_pages_cookies_og_image_idx";
  DROP INDEX "legal_pages_terms_og_image_idx";
  ALTER TABLE "homepage" DROP COLUMN "og_image_id";
  ALTER TABLE "static_pages" DROP COLUMN "servicii_og_image_id";
  ALTER TABLE "static_pages" DROP COLUMN "daune_og_image_id";
  ALTER TABLE "static_pages" DROP COLUMN "portofoliu_og_image_id";
  ALTER TABLE "static_pages" DROP COLUMN "despre_og_image_id";
  ALTER TABLE "static_pages" DROP COLUMN "recenzii_og_image_id";
  ALTER TABLE "static_pages" DROP COLUMN "faq_og_image_id";
  ALTER TABLE "static_pages" DROP COLUMN "blog_og_image_id";
  ALTER TABLE "static_pages" DROP COLUMN "contact_og_image_id";
  ALTER TABLE "legal_pages" DROP COLUMN "privacy_og_image_id";
  ALTER TABLE "legal_pages" DROP COLUMN "cookies_og_image_id";
  ALTER TABLE "legal_pages" DROP COLUMN "terms_og_image_id";`)
}
