import { integer, pgTable, varchar, numeric, date } from "drizzle-orm/pg-core";

export const usersTable = pgTable("expenses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  label: varchar({ length: 255 }).notNull(),
  note: varchar({ length: 255 }).notNull(),
  category: varchar({ length: 255 }).notNull(),
  type: varchar({ length: 50 }).notNull(), 
  amount: numeric().notNull(),  
  date: date().notNull()
});
