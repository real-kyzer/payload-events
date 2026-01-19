import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`events\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`start_date\` text NOT NULL,
  	\`end_date\` text NOT NULL,
  	\`event_status\` text DEFAULT 'EventScheduled',
  	\`attendance_mode\` text DEFAULT 'OfflineEventAttendanceMode',
  	\`venue_id\` integer NOT NULL,
  	\`organizer_id\` integer NOT NULL,
  	\`additional_info_age_restriction\` text,
  	\`additional_info_dress_code\` text,
  	\`additional_info_parking\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`venue_id\`) REFERENCES \`venues\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`organizer_id\`) REFERENCES \`organizers\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`events_venue_idx\` ON \`events\` (\`venue_id\`);`)
  await db.run(sql`CREATE INDEX \`events_organizer_idx\` ON \`events\` (\`organizer_id\`);`)
  await db.run(sql`CREATE INDEX \`events_updated_at_idx\` ON \`events\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`events_created_at_idx\` ON \`events\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`events_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	\`offers_id\` integer,
  	\`performers_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`offers_id\`) REFERENCES \`offers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`performers_id\`) REFERENCES \`performers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`events_rels_order_idx\` ON \`events_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`events_rels_parent_idx\` ON \`events_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`events_rels_path_idx\` ON \`events_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`events_rels_media_id_idx\` ON \`events_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`events_rels_offers_id_idx\` ON \`events_rels\` (\`offers_id\`);`)
  await db.run(sql`CREATE INDEX \`events_rels_performers_id_idx\` ON \`events_rels\` (\`performers_id\`);`)
  await db.run(sql`CREATE TABLE \`venues\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`address_street_address\` text NOT NULL,
  	\`address_locality\` text NOT NULL,
  	\`address_region\` text NOT NULL,
  	\`address_postal_code\` text NOT NULL,
  	\`address_country\` text NOT NULL,
  	\`geo_latitude\` numeric,
  	\`geo_longitude\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`venues_updated_at_idx\` ON \`venues\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`venues_created_at_idx\` ON \`venues\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`organizers\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`url\` text,
  	\`contact_email\` text,
  	\`contact_telephone\` text,
  	\`contact_contact_type\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`organizers_updated_at_idx\` ON \`organizers\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`organizers_created_at_idx\` ON \`organizers\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`offers\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`price\` numeric NOT NULL,
  	\`currency\` text DEFAULT 'AUD',
  	\`availability\` text DEFAULT 'InStock',
  	\`valid_from\` text,
  	\`url\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`offers_updated_at_idx\` ON \`offers\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`offers_created_at_idx\` ON \`offers\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`performers\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`type\` text DEFAULT 'Person',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`performers_updated_at_idx\` ON \`performers\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`performers_created_at_idx\` ON \`performers\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`events_id\` integer REFERENCES events(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`venues_id\` integer REFERENCES venues(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`organizers_id\` integer REFERENCES organizers(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`offers_id\` integer REFERENCES offers(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`performers_id\` integer REFERENCES performers(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_events_id_idx\` ON \`payload_locked_documents_rels\` (\`events_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_venues_id_idx\` ON \`payload_locked_documents_rels\` (\`venues_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_organizers_id_idx\` ON \`payload_locked_documents_rels\` (\`organizers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_offers_id_idx\` ON \`payload_locked_documents_rels\` (\`offers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_performers_id_idx\` ON \`payload_locked_documents_rels\` (\`performers_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`events\`;`)
  await db.run(sql`DROP TABLE \`events_rels\`;`)
  await db.run(sql`DROP TABLE \`venues\`;`)
  await db.run(sql`DROP TABLE \`organizers\`;`)
  await db.run(sql`DROP TABLE \`offers\`;`)
  await db.run(sql`DROP TABLE \`performers\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
}
