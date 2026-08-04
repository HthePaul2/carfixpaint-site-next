import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_contact_attachments_fk";
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_contact_requests_fk";
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_appointments_fk";

    DROP INDEX IF EXISTS "payload_locked_documents_rels_contact_attachments_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_contact_requests_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_appointments_id_idx";

    ALTER TABLE "payload_locked_documents_rels"
      DROP COLUMN IF EXISTS "contact_attachments_id";
    ALTER TABLE "payload_locked_documents_rels"
      DROP COLUMN IF EXISTS "contact_requests_id";
    ALTER TABLE "payload_locked_documents_rels"
      DROP COLUMN IF EXISTS "appointments_id";

    DROP TABLE IF EXISTS "availability_settings_blocked_dates" CASCADE;
    DROP TABLE IF EXISTS "availability_settings" CASCADE;

    DROP TABLE IF EXISTS "appointments_rels" CASCADE;
    DROP TABLE IF EXISTS "appointments" CASCADE;

    DROP TABLE IF EXISTS "contact_requests_rels" CASCADE;
    DROP TABLE IF EXISTS "contact_attachments" CASCADE;
    DROP TABLE IF EXISTS "contact_requests" CASCADE;

    DROP TYPE IF EXISTS "public"."enum_appointments_status";
    DROP TYPE IF EXISTS "public"."enum_contact_requests_status";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    SELECT 1;
  `)
}
