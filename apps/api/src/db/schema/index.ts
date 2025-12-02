import { relations } from "drizzle-orm";
import {
	bigint,
	boolean,
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
});

export const sessions = pgTable("sessions", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("accounts", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
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

export const verifications = pgTable("verifications", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at"),
	updatedAt: timestamp("updated_at"),
});

export const squirrels = pgTable("squirrels", {
	id: bigint({ mode: "number" }).generatedAlwaysAsIdentity().primaryKey(),
	scientificName: text().notNull(),
	commonName: text().notNull(),
	description: text().notNull(),
	femaleSize: text().notNull(),
	maleSize: text().notNull(),
	distribution: text().notNull(),
	variations: jsonb().notNull().default("[]").$type<string[]>(),
	conservation: text().notNull(),
	populationTrend: text().notNull(),
	habitat: text().notNull(),
	general: text(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
});

export const squirrelRelations = relations(squirrels, ({ many }) => ({
	assets: many(assets),
}));

export const assets = pgTable(
	"assets",
	{
		id: bigint({ mode: "number" }).generatedAlwaysAsIdentity().primaryKey(),
		squirrelId: bigint({ mode: "number" })
			.notNull()
			.references(() => squirrels.id, { onDelete: "cascade" }),
		url: text().notNull(),
		description: text(),
		order: integer().notNull().default(0),
		createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(table) => [index().on(table.squirrelId)],
);

export const assetsRelations = relations(assets, ({ one }) => ({
	squirrels: one(squirrels, {
		fields: [assets.squirrelId],
		references: [squirrels.id],
	}),
}));

export const $ = {
	user: createSelectSchema(users, {
		id: z
			.string()
			.min(1)
			.meta({
				description: "User ID",
				examples: ["abcdef1234"],
			}),
		name: z
			.string()
			.min(1)
			.max(256)
			.meta({
				description: "Full name of the user",
				examples: ["John Doe"],
			}),
		email: z.email().meta({
			description: "Email address of the user",
			examples: ["johndoe@example.com"],
		}),
		emailVerified: z.boolean().meta({
			description: "Whether the user's email is verified",
			examples: [true],
		}),
		image: z
			.url()
			.nullable()
			.meta({
				description: "Profile image URL of the user",
				examples: ["https://example.com/images/johndoe.jpg"],
			}),
		createdAt: z.date().meta({
			description: "Timestamp when the user was created",
			examples: [new Date("2023-01-15T10:00:00Z")],
		}),
		updatedAt: z.date().meta({
			description: "Timestamp when the user was last updated",
			examples: [new Date("2023-01-15T10:00:00Z")],
		}),
	}).meta({
		description: "A user entity",
	}),
	squirrel: createSelectSchema(squirrels, {
		id: z
			.number()
			.int()
			.meta({
				description: "ID of the entry",
				examples: ["abc123"],
			}),
		scientificName: z
			.string()
			.min(1)
			.meta({
				description: "Scientific name of the species",
				examples: ["Sciurus anomalus"],
			}),
		commonName: z
			.string()
			.min(1)
			.meta({
				description: "Common name of the species",
				examples: ["Caucasian squirrel"],
			}),
		description: z
			.string()
			.min(1)
			.meta({
				description: "Description of the species",
				examples: [
					"The Caucasian squirrel (Sciurus anomalus) is a tree squirrel...",
				],
			}),
		femaleSize: z
			.string()
			.min(1)
			.meta({
				description: "Average size of female squirrels",
				examples: ["213mm"],
			}),
		maleSize: z
			.string()
			.min(1)
			.meta({
				description: "Average size of male squirrels",
				examples: ["216mm"],
			}),
		distribution: z
			.string()
			.min(1)
			.meta({
				description: "Geographical distribution of the species",
				examples: ["Turkey, Georgia, Armenia, Azerbaijan, Iran, Russia"],
			}),
		variations: z
			.array(
				z
					.string()
					.min(1)
					.meta({
						description: "Known variations of the species",
						examples: ["S. a. anomalus", "S. a. pallescens", "S. a. syriacus"],
					}),
			)
			.min(0)
			.max(10)
			.meta({
				description: "List of known variations of the species",
				examples: [["S. a. anomalus", "S. a. pallescens", "S. a. syriacus"]],
			}),
		conservation: z
			.string()
			.min(1)
			.meta({
				description: "Conservation status of the species (IUCN)",
				examples: ["Least Concern"],
			}),
		populationTrend: z
			.string()
			.min(1)
			.meta({
				description: "Population trend of the species",
				examples: ["Decreasing"],
			}),
		habitat: z
			.string()
			.min(1)
			.meta({
				description: "Natural habitat of the species",
				examples: ["Deciduous forests, mixed forests"],
			}),
		general: z
			.string()
			.min(1)
			.nullable()
			.meta({
				description: "General information about the species",
				examples: [
					"The Caucasian squirrel is a tree squirrel found in the Caucasus region...",
				],
			}),
		createdAt: z.date().meta({
			description: "Timestamp when the entry was created",
			examples: [new Date("2023-01-15T10:00:00Z")],
		}),
		updatedAt: z.date().meta({
			description: "Timestamp when the entry was last updated",
			examples: [new Date("2023-01-15T10:00:00Z")],
		}),
	}),
	asset: createSelectSchema(assets, {
		id: z
			.number()
			.int()
			.meta({
				description: "Asset ID",
				examples: [123456],
			}),
		squirrelId: z
			.number()
			.int()
			.min(1)
			.meta({
				description: "ID of the associated squirrel",
				examples: ["abc123"],
			}),
		url: z.url().meta({
			description: "URL of the asset",
			examples: ["https://example.com/assets/image.jpg"],
		}),
		description: z
			.string()
			.max(512)
			.nullable()
			.meta({
				description: "Description of the asset",
				examples: ["A Caucasian Squirrel"],
			}),
		order: z
			.number()
			.int()
			.min(0)
			.max(64)
			.meta({
				description:
					"Order of the asset among other assets for the same entity",
				examples: [0],
			}),
		createdAt: z.date().meta({
			description: "Timestamp when the asset was created",
			examples: [new Date("2023-01-15T10:00:00Z")],
		}),
		updatedAt: z.date().meta({
			description: "Timestamp when the asset was last updated",
			examples: [new Date("2023-01-15T10:00:00Z")],
		}),
	}).meta({
		description: "An asset entity",
	}),
};

export const $insert = {
	user: createInsertSchema(users),
	account: createInsertSchema(accounts),
	asset: createInsertSchema(assets),
	squirrel: createInsertSchema(squirrels),
};
