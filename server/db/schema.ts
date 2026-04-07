import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";

export const sensors = sqliteTable("sensors", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  location: text("location", { mode: 'json' }).$type<{ lat: number, lng: number, zone: string }>().notNull(),
  battery: integer("battery").notNull(),
  lastUpdate: integer("last_update", { mode: 'timestamp' }).notNull(),
  signalStrength: integer("signal_strength").notNull(),
});

export const incidents = sqliteTable("incidents", {
  id: text("id").primaryKey(),
  sensorId: text("sensor_id").notNull().references(() => sensors.id),
  sensorType: text("sensor_type").notNull(),
  priority: text("priority").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location", { mode: 'json' }).$type<{ lat: number, lng: number, zone: string }>().notNull(),
  timestamp: integer("timestamp", { mode: 'timestamp' }).notNull(),
  resolved: integer("resolved", { mode: 'boolean' }).default(false).notNull(),
});

export const zones = sqliteTable("zones", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  coordinates: text("coordinates", { mode: 'json' }).$type<[number, number][]>().notNull(),
  color: text("color").notNull(),
});
