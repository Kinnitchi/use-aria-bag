import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", ["admin", "customer"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "confirmed", "shipped", "delivered", "cancelled"]);
export const stockMovementTypeEnum = pgEnum("stock_movement_type", ["in", "out", "adjustment"]);

// ─── Users ────────────────────────────────────────────────────────────────────

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("customer"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Sessions ─────────────────────────────────────────────────────────────────

export const sessionsTable = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Bag Models ───────────────────────────────────────────────────────────────

export const modelsTable = pgTable("models", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  fullDescription: text("full_description").notNull(),
  image: text("image").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Colors ───────────────────────────────────────────────────────────────────

export const colorsTable = pgTable("colors", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  hexCode: text("hex_code").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Products (Model + Color variant) ─────────────────────────────────────────

export const productsTable = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  modelId: uuid("model_id")
    .notNull()
    .references(() => modelsTable.id, { onDelete: "cascade" }),
  colorId: uuid("color_id")
    .notNull()
    .references(() => colorsTable.id, { onDelete: "restrict" }),
  name: text("name").notNull(),
  priceInCents: integer("price_in_cents").notNull(),
  stock: integer("stock").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Stock Movements (audit) ──────────────────────────────────────────────────

export const stockMovementsTable = pgTable("stock_movements", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => productsTable.id, { onDelete: "cascade" }),
  type: stockMovementTypeEnum("type").notNull(),
  quantity: integer("quantity").notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Carousel Slides ──────────────────────────────────────────────────────────

export const slidesTable = pgTable("slides", {
  id: uuid("id").defaultRandom().primaryKey(),
  modelId: uuid("model_id").references(() => modelsTable.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Orders ───────────────────────────────────────────────────────────────────

export const ordersTable = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  guestEmail: text("guest_email"),
  guestName: text("guest_name"),
  status: orderStatusEnum("status").notNull().default("pending"),
  totalInCents: integer("total_in_cents").notNull(),
  shippingAddress: text("shipping_address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Order Items ──────────────────────────────────────────────────────────────

export const orderItemsTable = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => ordersTable.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => productsTable.id, { onDelete: "restrict" }),
  quantity: integer("quantity").notNull(),
  priceAtTimeInCents: integer("price_at_time_in_cents").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(usersTable, ({ many }) => ({
  sessions: many(sessionsTable),
  orders: many(ordersTable),
}));

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

export const modelsRelations = relations(modelsTable, ({ many }) => ({
  products: many(productsTable),
  slides: many(slidesTable),
}));

export const colorsRelations = relations(colorsTable, ({ many }) => ({
  products: many(productsTable),
}));

export const productsRelations = relations(productsTable, ({ one, many }) => ({
  model: one(modelsTable, {
    fields: [productsTable.modelId],
    references: [modelsTable.id],
  }),
  color: one(colorsTable, {
    fields: [productsTable.colorId],
    references: [colorsTable.id],
  }),
  stockMovements: many(stockMovementsTable),
  orderItems: many(orderItemsTable),
}));

export const stockMovementsRelations = relations(stockMovementsTable, ({ one }) => ({
  product: one(productsTable, {
    fields: [stockMovementsTable.productId],
    references: [productsTable.id],
  }),
}));

export const slidesRelations = relations(slidesTable, ({ one }) => ({
  model: one(modelsTable, {
    fields: [slidesTable.modelId],
    references: [modelsTable.id],
  }),
}));

export const ordersRelations = relations(ordersTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [ordersTable.userId],
    references: [usersTable.id],
  }),
  items: many(orderItemsTable),
}));

export const orderItemsRelations = relations(orderItemsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [orderItemsTable.orderId],
    references: [ordersTable.id],
  }),
  product: one(productsTable, {
    fields: [orderItemsTable.productId],
    references: [productsTable.id],
  }),
}));

// ─── Better Auth Tables ────────────────────────────────────────────────────────

export const authUserTable = pgTable("auth_user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: userRoleEnum("role").notNull().default("customer"),
  // ── Shipping address ───────────────────────────────────────────────────────
  phone: text("phone"),
  addressZipCode: text("address_zip_code"),
  addressStreet: text("address_street"),
  addressNumber: text("address_number"),
  addressComplement: text("address_complement"),
  addressNeighborhood: text("address_neighborhood"),
  addressCity: text("address_city"),
  addressState: text("address_state"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const authSessionTable = pgTable("auth_session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => authUserTable.id, { onDelete: "cascade" }),
});

export const authAccountTable = pgTable("auth_account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => authUserTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const authVerificationTable = pgTable("auth_verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
