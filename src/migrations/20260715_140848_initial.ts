import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_media_category" AS ENUM('blog', 'portfolio-before', 'portfolio-after', 'general');
  CREATE TYPE "public"."enum_services_icon" AS ENUM('Hammer', 'PaintBrush', 'Wrench', 'ComputerTower', 'Shield', 'Car', 'Lightning', 'CheckCircle', 'Phone', 'Clock');
  CREATE TYPE "public"."enum_portfolio_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__portfolio_projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_blog_posts_category" AS ENUM('guides', 'tips', 'insurance', 'maintenance', 'general');
  CREATE TYPE "public"."enum_blog_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__blog_posts_v_version_category" AS ENUM('guides', 'tips', 'insurance', 'maintenance', 'general');
  CREATE TYPE "public"."enum__blog_posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_faqs_category" AS ENUM('services', 'insurance', 'pricing', 'general');
  CREATE TYPE "public"."enum_contact_requests_status" AS ENUM('new', 'contacted', 'scheduled', 'closed', 'spam');
  CREATE TYPE "public"."enum_homepage_benefits_icon" AS ENUM('Lightning', 'CheckCircle', 'Shield', 'Car', 'Hammer', 'PaintBrush', 'Wrench', 'Clock');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"category" "enum_media_category",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "services_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"icon" "enum_services_icon" NOT NULL,
  	"short_description" varchar,
  	"description" varchar NOT NULL,
  	"featured" boolean DEFAULT false,
  	"active" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "portfolio_projects_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "portfolio_projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"legacy_id" varchar,
  	"description" varchar,
  	"before_image_id" integer,
  	"after_image_id" integer,
  	"legacy_before_image_url" varchar,
  	"legacy_after_image_url" varchar,
  	"duration" varchar,
  	"vehicle_brand" varchar,
  	"vehicle_model" varchar,
  	"featured" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"order" numeric DEFAULT 0,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_portfolio_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "portfolio_projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "_portfolio_projects_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_legacy_id" varchar,
  	"version_description" varchar,
  	"version_before_image_id" integer,
  	"version_after_image_id" integer,
  	"version_legacy_before_image_url" varchar,
  	"version_legacy_after_image_url" varchar,
  	"version_duration" varchar,
  	"version_vehicle_brand" varchar,
  	"version_vehicle_model" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_published_at" timestamp(3) with time zone,
  	"version_order" numeric DEFAULT 0,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__portfolio_projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_portfolio_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "blog_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"legacy_id" varchar,
  	"excerpt" varchar,
  	"cover_image_id" integer,
  	"legacy_cover_image_url" varchar,
  	"body" jsonb,
  	"legacy_markdown" varchar,
  	"published_at" timestamp(3) with time zone,
  	"read_time" varchar,
  	"category" "enum_blog_posts_category" DEFAULT 'general',
  	"featured" boolean DEFAULT false,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_blog_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_blog_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_legacy_id" varchar,
  	"version_excerpt" varchar,
  	"version_cover_image_id" integer,
  	"version_legacy_cover_image_url" varchar,
  	"version_body" jsonb,
  	"version_legacy_markdown" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_read_time" varchar,
  	"version_category" "enum__blog_posts_v_version_category" DEFAULT 'general',
  	"version_featured" boolean DEFAULT false,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__blog_posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seed_key" varchar,
  	"name" varchar NOT NULL,
  	"rating" numeric NOT NULL,
  	"text" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"service_id" integer,
  	"service_label" varchar,
  	"approved" boolean DEFAULT false,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seed_key" varchar,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"category" "enum_faqs_category",
  	"published" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contact_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar,
  	"car_brand" varchar,
  	"license_plate" varchar,
  	"service_id" integer,
  	"service_type" varchar,
  	"message" varchar,
  	"gdpr_consent" boolean DEFAULT false NOT NULL,
  	"status" "enum_contact_requests_status" DEFAULT 'new' NOT NULL,
  	"source" varchar DEFAULT 'website',
  	"submitted_at" timestamp(3) with time zone NOT NULL,
  	"ip" varchar,
  	"user_agent" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contact_requests_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"services_id" integer,
  	"portfolio_projects_id" integer,
  	"blog_posts_id" integer,
  	"reviews_id" integer,
  	"faqs_id" integer,
  	"contact_requests_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_name" varchar DEFAULT 'CarFix Paint' NOT NULL,
  	"tagline" varchar DEFAULT 'Service Auto Premium Brașov',
  	"phone" varchar NOT NULL,
  	"whatsapp_number" varchar,
  	"whatsapp_message" varchar,
  	"email" varchar,
  	"address" varchar,
  	"schedule" varchar,
  	"google_maps_url" varchar,
  	"coordinates_lat" numeric,
  	"coordinates_lng" numeric,
  	"facebook" varchar,
  	"instagram" varchar,
  	"canonical_domain" varchar,
  	"default_og_image_id" integer,
  	"cta_phone_label" varchar DEFAULT 'Sună Acum',
  	"cta_quote_label" varchar DEFAULT 'Cere Ofertă Gratuită',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_homepage_benefits_icon" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_damage_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_badge" varchar DEFAULT 'Service Auto Premium Brașov',
  	"hero_title" varchar DEFAULT 'Reparații Auto Profesionale',
  	"hero_accent_text" varchar DEFAULT 'Cu Decontare Directă',
  	"hero_description" varchar,
  	"hero_cta_phone_label" varchar DEFAULT 'Sună Acum',
  	"hero_cta_quote_label" varchar DEFAULT 'Cere Ofertă Gratuită',
  	"services_section_title" varchar DEFAULT 'Serviciile Noastre',
  	"services_section_subtitle" varchar,
  	"portfolio_section_title" varchar DEFAULT 'Portofoliu Lucrări',
  	"reviews_section_title" varchar DEFAULT 'Ce Spun Clienții Noștri',
  	"services_limit" numeric DEFAULT 6,
  	"portfolio_limit" numeric DEFAULT 3,
  	"reviews_limit" numeric DEFAULT 6,
  	"damage_process_title" varchar DEFAULT 'Cum Funcționează Procesul de Daune',
  	"final_cta_title" varchar DEFAULT 'Ai Nevoie de Reparații Auto?',
  	"final_cta_description" varchar,
  	"final_cta_button_label" varchar DEFAULT 'Contactează-ne Acum',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "legal_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"privacy_title" varchar DEFAULT 'Politică de Confidențialitate',
  	"privacy_content" jsonb,
  	"privacy_seo_title" varchar,
  	"privacy_seo_description" varchar,
  	"cookies_title" varchar DEFAULT 'Politică Cookies',
  	"cookies_content" jsonb,
  	"cookies_seo_title" varchar,
  	"cookies_seo_description" varchar,
  	"terms_title" varchar DEFAULT 'Termeni și Condiții',
  	"terms_content" jsonb,
  	"terms_seo_title" varchar,
  	"terms_seo_description" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_features" ADD CONSTRAINT "services_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_gallery" ADD CONSTRAINT "portfolio_projects_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_projects_gallery" ADD CONSTRAINT "portfolio_projects_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects" ADD CONSTRAINT "portfolio_projects_before_image_id_media_id_fk" FOREIGN KEY ("before_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_projects" ADD CONSTRAINT "portfolio_projects_after_image_id_media_id_fk" FOREIGN KEY ("after_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_projects_rels" ADD CONSTRAINT "portfolio_projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_rels" ADD CONSTRAINT "portfolio_projects_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_version_gallery" ADD CONSTRAINT "_portfolio_projects_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_version_gallery" ADD CONSTRAINT "_portfolio_projects_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v" ADD CONSTRAINT "_portfolio_projects_v_parent_id_portfolio_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v" ADD CONSTRAINT "_portfolio_projects_v_version_before_image_id_media_id_fk" FOREIGN KEY ("version_before_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v" ADD CONSTRAINT "_portfolio_projects_v_version_after_image_id_media_id_fk" FOREIGN KEY ("version_after_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_rels" ADD CONSTRAINT "_portfolio_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_rels" ADD CONSTRAINT "_portfolio_projects_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_parent_id_blog_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_requests" ADD CONSTRAINT "contact_requests_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_requests_rels" ADD CONSTRAINT "contact_requests_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."contact_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_requests_rels" ADD CONSTRAINT "contact_requests_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolio_projects_fk" FOREIGN KEY ("portfolio_projects_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_requests_fk" FOREIGN KEY ("contact_requests_id") REFERENCES "public"."contact_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_benefits" ADD CONSTRAINT "homepage_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_damage_process_steps" ADD CONSTRAINT "homepage_damage_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "services_features_order_idx" ON "services_features" USING btree ("_order");
  CREATE INDEX "services_features_parent_id_idx" ON "services_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "portfolio_projects_gallery_order_idx" ON "portfolio_projects_gallery" USING btree ("_order");
  CREATE INDEX "portfolio_projects_gallery_parent_id_idx" ON "portfolio_projects_gallery" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_gallery_image_idx" ON "portfolio_projects_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "portfolio_projects_slug_idx" ON "portfolio_projects" USING btree ("slug");
  CREATE INDEX "portfolio_projects_before_image_idx" ON "portfolio_projects" USING btree ("before_image_id");
  CREATE INDEX "portfolio_projects_after_image_idx" ON "portfolio_projects" USING btree ("after_image_id");
  CREATE INDEX "portfolio_projects_updated_at_idx" ON "portfolio_projects" USING btree ("updated_at");
  CREATE INDEX "portfolio_projects_created_at_idx" ON "portfolio_projects" USING btree ("created_at");
  CREATE INDEX "portfolio_projects__status_idx" ON "portfolio_projects" USING btree ("_status");
  CREATE INDEX "portfolio_projects_rels_order_idx" ON "portfolio_projects_rels" USING btree ("order");
  CREATE INDEX "portfolio_projects_rels_parent_idx" ON "portfolio_projects_rels" USING btree ("parent_id");
  CREATE INDEX "portfolio_projects_rels_path_idx" ON "portfolio_projects_rels" USING btree ("path");
  CREATE INDEX "portfolio_projects_rels_services_id_idx" ON "portfolio_projects_rels" USING btree ("services_id");
  CREATE INDEX "_portfolio_projects_v_version_gallery_order_idx" ON "_portfolio_projects_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_version_gallery_parent_id_idx" ON "_portfolio_projects_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_version_gallery_image_idx" ON "_portfolio_projects_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_portfolio_projects_v_parent_idx" ON "_portfolio_projects_v" USING btree ("parent_id");
  CREATE INDEX "_portfolio_projects_v_version_version_slug_idx" ON "_portfolio_projects_v" USING btree ("version_slug");
  CREATE INDEX "_portfolio_projects_v_version_version_before_image_idx" ON "_portfolio_projects_v" USING btree ("version_before_image_id");
  CREATE INDEX "_portfolio_projects_v_version_version_after_image_idx" ON "_portfolio_projects_v" USING btree ("version_after_image_id");
  CREATE INDEX "_portfolio_projects_v_version_version_updated_at_idx" ON "_portfolio_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_portfolio_projects_v_version_version_created_at_idx" ON "_portfolio_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_portfolio_projects_v_version_version__status_idx" ON "_portfolio_projects_v" USING btree ("version__status");
  CREATE INDEX "_portfolio_projects_v_created_at_idx" ON "_portfolio_projects_v" USING btree ("created_at");
  CREATE INDEX "_portfolio_projects_v_updated_at_idx" ON "_portfolio_projects_v" USING btree ("updated_at");
  CREATE INDEX "_portfolio_projects_v_latest_idx" ON "_portfolio_projects_v" USING btree ("latest");
  CREATE INDEX "_portfolio_projects_v_rels_order_idx" ON "_portfolio_projects_v_rels" USING btree ("order");
  CREATE INDEX "_portfolio_projects_v_rels_parent_idx" ON "_portfolio_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_portfolio_projects_v_rels_path_idx" ON "_portfolio_projects_v_rels" USING btree ("path");
  CREATE INDEX "_portfolio_projects_v_rels_services_id_idx" ON "_portfolio_projects_v_rels" USING btree ("services_id");
  CREATE UNIQUE INDEX "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");
  CREATE INDEX "blog_posts_cover_image_idx" ON "blog_posts" USING btree ("cover_image_id");
  CREATE INDEX "blog_posts_og_image_idx" ON "blog_posts" USING btree ("og_image_id");
  CREATE INDEX "blog_posts_updated_at_idx" ON "blog_posts" USING btree ("updated_at");
  CREATE INDEX "blog_posts_created_at_idx" ON "blog_posts" USING btree ("created_at");
  CREATE INDEX "blog_posts__status_idx" ON "blog_posts" USING btree ("_status");
  CREATE INDEX "_blog_posts_v_parent_idx" ON "_blog_posts_v" USING btree ("parent_id");
  CREATE INDEX "_blog_posts_v_version_version_slug_idx" ON "_blog_posts_v" USING btree ("version_slug");
  CREATE INDEX "_blog_posts_v_version_version_cover_image_idx" ON "_blog_posts_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_blog_posts_v_version_version_og_image_idx" ON "_blog_posts_v" USING btree ("version_og_image_id");
  CREATE INDEX "_blog_posts_v_version_version_updated_at_idx" ON "_blog_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_blog_posts_v_version_version_created_at_idx" ON "_blog_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_blog_posts_v_version_version__status_idx" ON "_blog_posts_v" USING btree ("version__status");
  CREATE INDEX "_blog_posts_v_created_at_idx" ON "_blog_posts_v" USING btree ("created_at");
  CREATE INDEX "_blog_posts_v_updated_at_idx" ON "_blog_posts_v" USING btree ("updated_at");
  CREATE INDEX "_blog_posts_v_latest_idx" ON "_blog_posts_v" USING btree ("latest");
  CREATE UNIQUE INDEX "reviews_seed_key_idx" ON "reviews" USING btree ("seed_key");
  CREATE INDEX "reviews_service_idx" ON "reviews" USING btree ("service_id");
  CREATE INDEX "reviews_updated_at_idx" ON "reviews" USING btree ("updated_at");
  CREATE INDEX "reviews_created_at_idx" ON "reviews" USING btree ("created_at");
  CREATE UNIQUE INDEX "faqs_seed_key_idx" ON "faqs" USING btree ("seed_key");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "contact_requests_service_idx" ON "contact_requests" USING btree ("service_id");
  CREATE INDEX "contact_requests_updated_at_idx" ON "contact_requests" USING btree ("updated_at");
  CREATE INDEX "contact_requests_created_at_idx" ON "contact_requests" USING btree ("created_at");
  CREATE INDEX "contact_requests_rels_order_idx" ON "contact_requests_rels" USING btree ("order");
  CREATE INDEX "contact_requests_rels_parent_idx" ON "contact_requests_rels" USING btree ("parent_id");
  CREATE INDEX "contact_requests_rels_path_idx" ON "contact_requests_rels" USING btree ("path");
  CREATE INDEX "contact_requests_rels_media_id_idx" ON "contact_requests_rels" USING btree ("media_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_portfolio_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("portfolio_projects_id");
  CREATE INDEX "payload_locked_documents_rels_blog_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_posts_id");
  CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("reviews_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_contact_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_requests_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_default_og_image_idx" ON "site_settings" USING btree ("default_og_image_id");
  CREATE INDEX "homepage_benefits_order_idx" ON "homepage_benefits" USING btree ("_order");
  CREATE INDEX "homepage_benefits_parent_id_idx" ON "homepage_benefits" USING btree ("_parent_id");
  CREATE INDEX "homepage_damage_process_steps_order_idx" ON "homepage_damage_process_steps" USING btree ("_order");
  CREATE INDEX "homepage_damage_process_steps_parent_id_idx" ON "homepage_damage_process_steps" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "services_features" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "portfolio_projects_gallery" CASCADE;
  DROP TABLE "portfolio_projects" CASCADE;
  DROP TABLE "portfolio_projects_rels" CASCADE;
  DROP TABLE "_portfolio_projects_v_version_gallery" CASCADE;
  DROP TABLE "_portfolio_projects_v" CASCADE;
  DROP TABLE "_portfolio_projects_v_rels" CASCADE;
  DROP TABLE "blog_posts" CASCADE;
  DROP TABLE "_blog_posts_v" CASCADE;
  DROP TABLE "reviews" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "contact_requests" CASCADE;
  DROP TABLE "contact_requests_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "homepage_benefits" CASCADE;
  DROP TABLE "homepage_damage_process_steps" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "legal_pages" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_media_category";
  DROP TYPE "public"."enum_services_icon";
  DROP TYPE "public"."enum_portfolio_projects_status";
  DROP TYPE "public"."enum__portfolio_projects_v_version_status";
  DROP TYPE "public"."enum_blog_posts_category";
  DROP TYPE "public"."enum_blog_posts_status";
  DROP TYPE "public"."enum__blog_posts_v_version_category";
  DROP TYPE "public"."enum__blog_posts_v_version_status";
  DROP TYPE "public"."enum_faqs_category";
  DROP TYPE "public"."enum_contact_requests_status";
  DROP TYPE "public"."enum_homepage_benefits_icon";`)
}
