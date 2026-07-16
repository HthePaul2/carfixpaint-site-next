import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Creates appointments collection + availability-settings global scaffolding.
 * For local/dev DBs that use schema push, this is still useful on staging/production.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_appointments_status" AS ENUM(
        'pending',
        'confirmed',
        'reschedule-proposed',
        'cancelled',
        'rejected',
        'completed',
        'no-show'
      );
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS "appointments" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "phone" varchar NOT NULL,
      "email" varchar,
      "service_id" integer NOT NULL,
      "car_brand" varchar,
      "car_model" varchar,
      "license_plate" varchar,
      "requested_start" timestamp(3) with time zone NOT NULL,
      "requested_end" timestamp(3) with time zone NOT NULL,
      "timezone" varchar DEFAULT 'Europe/Bucharest' NOT NULL,
      "slot_key" varchar NOT NULL,
      "status" "enum_appointments_status" DEFAULT 'pending' NOT NULL,
      "customer_message" varchar,
      "admin_notes" varchar,
      "source" varchar DEFAULT 'website',
      "submitted_at" timestamp(3) with time zone NOT NULL,
      "confirmed_at" timestamp(3) with time zone,
      "cancelled_at" timestamp(3) with time zone,
      "cancellation_reason" varchar,
      "cancel_token_hash" varchar,
      "ip" varchar,
      "user_agent" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "appointments"
        ADD CONSTRAINT "appointments_service_id_services_id_fk"
        FOREIGN KEY ("service_id") REFERENCES "public"."services"("id")
        ON DELETE restrict ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "appointments_slot_key_idx" ON "appointments" USING btree ("slot_key");
    CREATE INDEX IF NOT EXISTS "appointments_service_idx" ON "appointments" USING btree ("service_id");
    CREATE INDEX IF NOT EXISTS "appointments_updated_at_idx" ON "appointments" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "appointments_created_at_idx" ON "appointments" USING btree ("created_at");

    CREATE TABLE IF NOT EXISTS "appointments_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "contact_attachments_id" integer
    );

    DO $$ BEGIN
      ALTER TABLE "appointments_rels"
        ADD CONSTRAINT "appointments_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."appointments"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "appointments_rels"
        ADD CONSTRAINT "appointments_rels_contact_attachments_fk"
        FOREIGN KEY ("contact_attachments_id") REFERENCES "public"."contact_attachments"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "appointments_rels_order_idx" ON "appointments_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "appointments_rels_parent_idx" ON "appointments_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "appointments_rels_path_idx" ON "appointments_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "appointments_rels_contact_attachments_id_idx"
      ON "appointments_rels" USING btree ("contact_attachments_id");

    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "appointments_id" integer;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_appointments_fk"
        FOREIGN KEY ("appointments_id") REFERENCES "public"."appointments"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_appointments_id_idx"
      ON "payload_locked_documents_rels" USING btree ("appointments_id");

    CREATE TABLE IF NOT EXISTS "availability_settings_blocked_dates" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "date" timestamp(3) with time zone NOT NULL,
      "reason" varchar
    );

    CREATE TABLE IF NOT EXISTS "availability_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "timezone" varchar DEFAULT 'Europe/Bucharest' NOT NULL,
      "slot_duration_minutes" numeric DEFAULT 30 NOT NULL,
      "min_notice_hours" numeric DEFAULT 2 NOT NULL,
      "max_advance_days" numeric DEFAULT 60 NOT NULL,
      "capacity_per_slot" numeric DEFAULT 1 NOT NULL,
      "break_start" varchar DEFAULT '12:00',
      "break_end" varchar DEFAULT '13:00',
      "confirmation_text" varchar,
      "notification_email" varchar,
      "monday_enabled" boolean DEFAULT true,
      "monday_start" varchar DEFAULT '08:00',
      "monday_end" varchar DEFAULT '17:00',
      "tuesday_enabled" boolean DEFAULT true,
      "tuesday_start" varchar DEFAULT '08:00',
      "tuesday_end" varchar DEFAULT '17:00',
      "wednesday_enabled" boolean DEFAULT true,
      "wednesday_start" varchar DEFAULT '08:00',
      "wednesday_end" varchar DEFAULT '17:00',
      "thursday_enabled" boolean DEFAULT true,
      "thursday_start" varchar DEFAULT '08:00',
      "thursday_end" varchar DEFAULT '17:00',
      "friday_enabled" boolean DEFAULT true,
      "friday_start" varchar DEFAULT '08:00',
      "friday_end" varchar DEFAULT '17:00',
      "saturday_enabled" boolean DEFAULT false,
      "saturday_start" varchar DEFAULT '09:00',
      "saturday_end" varchar DEFAULT '13:00',
      "sunday_enabled" boolean DEFAULT false,
      "sunday_start" varchar DEFAULT '09:00',
      "sunday_end" varchar DEFAULT '13:00',
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    DO $$ BEGIN
      ALTER TABLE "availability_settings_blocked_dates"
        ADD CONSTRAINT "availability_settings_blocked_dates_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."availability_settings"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "availability_settings_blocked_dates_order_idx"
      ON "availability_settings_blocked_dates" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "availability_settings_blocked_dates_parent_id_idx"
      ON "availability_settings_blocked_dates" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "availability_settings_blocked_dates" CASCADE;
    DROP TABLE IF EXISTS "availability_settings" CASCADE;
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_appointments_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_appointments_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "appointments_id";
    DROP TABLE IF EXISTS "appointments_rels" CASCADE;
    DROP TABLE IF EXISTS "appointments" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_appointments_status";
  `)
}
