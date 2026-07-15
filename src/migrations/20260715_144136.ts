import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_static_pages_daune_highlights_icon" AS ENUM('Hammer', 'PaintBrush', 'Wrench', 'ComputerTower', 'Shield', 'Car', 'Lightning', 'CheckCircle', 'Phone', 'Clock');
  CREATE TABLE "site_settings_footer_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_navigation_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"path" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "static_pages_daune_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_static_pages_daune_highlights_icon" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "static_pages_daune_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "static_pages_despre_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "static_pages_despre_why_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "static_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"servicii_page_title" varchar NOT NULL,
  	"servicii_page_subtitle" varchar,
  	"servicii_seo_title" varchar,
  	"servicii_seo_description" varchar,
  	"servicii_seo_keywords" varchar,
  	"servicii_og_title" varchar,
  	"servicii_og_description" varchar,
  	"daune_page_title" varchar NOT NULL,
  	"daune_page_subtitle" varchar,
  	"daune_process_title" varchar,
  	"daune_cta_title" varchar,
  	"daune_cta_description" varchar,
  	"daune_cta_contact_label" varchar,
  	"daune_seo_title" varchar,
  	"daune_seo_description" varchar,
  	"daune_seo_keywords" varchar,
  	"daune_og_title" varchar,
  	"daune_og_description" varchar,
  	"portofoliu_page_title" varchar NOT NULL,
  	"portofoliu_page_subtitle" varchar,
  	"portofoliu_seo_title" varchar,
  	"portofoliu_seo_description" varchar,
  	"portofoliu_seo_keywords" varchar,
  	"portofoliu_og_title" varchar,
  	"portofoliu_og_description" varchar,
  	"despre_page_title" varchar NOT NULL,
  	"despre_intro" varchar,
  	"despre_why_title" varchar,
  	"despre_mission_title" varchar,
  	"despre_mission_text" varchar,
  	"despre_values_title" varchar,
  	"despre_values_content" jsonb,
  	"despre_seo_title" varchar,
  	"despre_seo_description" varchar,
  	"despre_seo_keywords" varchar,
  	"despre_og_title" varchar,
  	"despre_og_description" varchar,
  	"recenzii_page_title" varchar NOT NULL,
  	"recenzii_page_subtitle" varchar,
  	"recenzii_seo_title" varchar,
  	"recenzii_seo_description" varchar,
  	"recenzii_seo_keywords" varchar,
  	"recenzii_og_title" varchar,
  	"recenzii_og_description" varchar,
  	"faq_page_title" varchar NOT NULL,
  	"faq_page_subtitle" varchar,
  	"faq_seo_title" varchar,
  	"faq_seo_description" varchar,
  	"faq_seo_keywords" varchar,
  	"faq_og_title" varchar,
  	"faq_og_description" varchar,
  	"blog_page_title" varchar NOT NULL,
  	"blog_page_subtitle" varchar,
  	"blog_seo_title" varchar,
  	"blog_seo_description" varchar,
  	"blog_seo_keywords" varchar,
  	"blog_og_title" varchar,
  	"blog_og_description" varchar,
  	"contact_page_title" varchar NOT NULL,
  	"contact_page_subtitle" varchar,
  	"contact_contact_card_title" varchar,
  	"contact_fast_response_title" varchar,
  	"contact_fast_response_text" varchar,
  	"contact_seo_title" varchar,
  	"contact_seo_description" varchar,
  	"contact_seo_keywords" varchar,
  	"contact_og_title" varchar,
  	"contact_og_description" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "homepage_benefits" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_homepage_benefits_icon";
  CREATE TYPE "public"."enum_homepage_benefits_icon" AS ENUM('Hammer', 'PaintBrush', 'Wrench', 'ComputerTower', 'Shield', 'Car', 'Lightning', 'CheckCircle', 'Phone', 'Clock');
  ALTER TABLE "homepage_benefits" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_homepage_benefits_icon" USING "icon"::"public"."enum_homepage_benefits_icon";
  ALTER TABLE "site_settings" ADD COLUMN "logo_abbreviation" varchar DEFAULT 'CF';
  ALTER TABLE "site_settings" ADD COLUMN "footer_description" varchar DEFAULT 'Service auto multimarcă în Brașov. Tinichigerie, vopsitorie profesională și gestionare daune RCA/CASCO.';
  ALTER TABLE "site_settings" ADD COLUMN "copyright_text" varchar DEFAULT '© 2026 CarFix Paint. Toate drepturile rezervate.';
  ALTER TABLE "homepage" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "homepage" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "homepage" ADD COLUMN "seo_keywords" varchar;
  ALTER TABLE "homepage" ADD COLUMN "og_title" varchar;
  ALTER TABLE "homepage" ADD COLUMN "og_description" varchar;
  ALTER TABLE "site_settings_footer_services" ADD CONSTRAINT "site_settings_footer_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_navigation_items" ADD CONSTRAINT "site_settings_navigation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "static_pages_daune_highlights" ADD CONSTRAINT "static_pages_daune_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."static_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "static_pages_daune_process_steps" ADD CONSTRAINT "static_pages_daune_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."static_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "static_pages_despre_stats" ADD CONSTRAINT "static_pages_despre_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."static_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "static_pages_despre_why_items" ADD CONSTRAINT "static_pages_despre_why_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."static_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_footer_services_order_idx" ON "site_settings_footer_services" USING btree ("_order");
  CREATE INDEX "site_settings_footer_services_parent_id_idx" ON "site_settings_footer_services" USING btree ("_parent_id");
  CREATE INDEX "site_settings_navigation_items_order_idx" ON "site_settings_navigation_items" USING btree ("_order");
  CREATE INDEX "site_settings_navigation_items_parent_id_idx" ON "site_settings_navigation_items" USING btree ("_parent_id");
  CREATE INDEX "static_pages_daune_highlights_order_idx" ON "static_pages_daune_highlights" USING btree ("_order");
  CREATE INDEX "static_pages_daune_highlights_parent_id_idx" ON "static_pages_daune_highlights" USING btree ("_parent_id");
  CREATE INDEX "static_pages_daune_process_steps_order_idx" ON "static_pages_daune_process_steps" USING btree ("_order");
  CREATE INDEX "static_pages_daune_process_steps_parent_id_idx" ON "static_pages_daune_process_steps" USING btree ("_parent_id");
  CREATE INDEX "static_pages_despre_stats_order_idx" ON "static_pages_despre_stats" USING btree ("_order");
  CREATE INDEX "static_pages_despre_stats_parent_id_idx" ON "static_pages_despre_stats" USING btree ("_parent_id");
  CREATE INDEX "static_pages_despre_why_items_order_idx" ON "static_pages_despre_why_items" USING btree ("_order");
  CREATE INDEX "static_pages_despre_why_items_parent_id_idx" ON "static_pages_despre_why_items" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_settings_footer_services" CASCADE;
  DROP TABLE "site_settings_navigation_items" CASCADE;
  DROP TABLE "static_pages_daune_highlights" CASCADE;
  DROP TABLE "static_pages_daune_process_steps" CASCADE;
  DROP TABLE "static_pages_despre_stats" CASCADE;
  DROP TABLE "static_pages_despre_why_items" CASCADE;
  DROP TABLE "static_pages" CASCADE;
  ALTER TABLE "homepage_benefits" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_homepage_benefits_icon";
  CREATE TYPE "public"."enum_homepage_benefits_icon" AS ENUM('Lightning', 'CheckCircle', 'Shield', 'Car', 'Hammer', 'PaintBrush', 'Wrench', 'Clock');
  ALTER TABLE "homepage_benefits" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_homepage_benefits_icon" USING "icon"::"public"."enum_homepage_benefits_icon";
  ALTER TABLE "site_settings" DROP COLUMN "logo_abbreviation";
  ALTER TABLE "site_settings" DROP COLUMN "footer_description";
  ALTER TABLE "site_settings" DROP COLUMN "copyright_text";
  ALTER TABLE "homepage" DROP COLUMN "seo_title";
  ALTER TABLE "homepage" DROP COLUMN "seo_description";
  ALTER TABLE "homepage" DROP COLUMN "seo_keywords";
  ALTER TABLE "homepage" DROP COLUMN "og_title";
  ALTER TABLE "homepage" DROP COLUMN "og_description";
  DROP TYPE "public"."enum_static_pages_daune_highlights_icon";`)
}
