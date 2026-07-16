import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "contact_attachments" ADD COLUMN IF NOT EXISTS "appointment_id" integer;

    DO $$ BEGIN
      ALTER TABLE "contact_attachments"
        ADD CONSTRAINT "contact_attachments_appointment_id_appointments_id_fk"
        FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "contact_attachments_appointment_idx"
      ON "contact_attachments" USING btree ("appointment_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "contact_attachments"
      DROP CONSTRAINT IF EXISTS "contact_attachments_appointment_id_appointments_id_fk";
    DROP INDEX IF EXISTS "contact_attachments_appointment_idx";
    ALTER TABLE "contact_attachments" DROP COLUMN IF EXISTS "appointment_id";
  `)
}
