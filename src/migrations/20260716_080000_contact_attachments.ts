import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "contact_attachments" (
      "id" serial PRIMARY KEY NOT NULL,
      "contact_request_id" integer,
      "original_filename" varchar,
      "mime_type" varchar,
      "size_bytes" numeric,
      "width" numeric,
      "height" numeric,
      "uploaded_at" timestamp(3) with time zone NOT NULL,
      "retention_until" timestamp(3) with time zone,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "url" varchar,
      "thumbnail_u_r_l" varchar,
      "filename" varchar,
      "filesize" numeric,
      "focal_x" numeric,
      "focal_y" numeric,
      "sizes_thumbnail_url" varchar,
      "sizes_thumbnail_width" numeric,
      "sizes_thumbnail_height" numeric,
      "sizes_thumbnail_mime_type" varchar,
      "sizes_thumbnail_filesize" numeric,
      "sizes_thumbnail_filename" varchar
    );

    -- Payload also stores upload mime/width/height on the same mime_type/width/height columns.
    -- Ensure those columns exist (already defined above).

    DO $$ BEGIN
      ALTER TABLE "contact_attachments"
        ADD CONSTRAINT "contact_attachments_contact_request_id_contact_requests_id_fk"
        FOREIGN KEY ("contact_request_id") REFERENCES "public"."contact_requests"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "contact_attachments_contact_request_idx"
      ON "contact_attachments" USING btree ("contact_request_id");
    CREATE INDEX IF NOT EXISTS "contact_attachments_updated_at_idx"
      ON "contact_attachments" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "contact_attachments_created_at_idx"
      ON "contact_attachments" USING btree ("created_at");
    CREATE UNIQUE INDEX IF NOT EXISTS "contact_attachments_filename_idx"
      ON "contact_attachments" USING btree ("filename");
    CREATE INDEX IF NOT EXISTS "contact_attachments_sizes_thumbnail_filename_idx"
      ON "contact_attachments" USING btree ("sizes_thumbnail_filename");

    ALTER TABLE "contact_requests" ADD COLUMN IF NOT EXISTS "photo_count" numeric DEFAULT 0;

    ALTER TABLE "contact_requests_rels"
      ADD COLUMN IF NOT EXISTS "contact_attachments_id" integer;

    DO $$ BEGIN
      ALTER TABLE "contact_requests_rels"
        ADD CONSTRAINT "contact_requests_rels_contact_attachments_fk"
        FOREIGN KEY ("contact_attachments_id") REFERENCES "public"."contact_attachments"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "contact_requests_rels_contact_attachments_id_idx"
      ON "contact_requests_rels" USING btree ("contact_attachments_id");

    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "contact_attachments_id" integer;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_contact_attachments_fk"
        FOREIGN KEY ("contact_attachments_id") REFERENCES "public"."contact_attachments"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_contact_attachments_id_idx"
      ON "payload_locked_documents_rels" USING btree ("contact_attachments_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_contact_attachments_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_contact_attachments_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "contact_attachments_id";

    ALTER TABLE "contact_requests_rels"
      DROP CONSTRAINT IF EXISTS "contact_requests_rels_contact_attachments_fk";
    DROP INDEX IF EXISTS "contact_requests_rels_contact_attachments_id_idx";
    ALTER TABLE "contact_requests_rels" DROP COLUMN IF EXISTS "contact_attachments_id";

    ALTER TABLE "contact_requests" DROP COLUMN IF EXISTS "photo_count";

    DROP TABLE IF EXISTS "contact_attachments" CASCADE;
  `)
}
