import { pgTable, text, timestamp, integer, doublePrecision, uuid, date } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').unique().notNull(),
    name: text('name'),
    imageUrl: text('image_url'),
    themeMode: text('theme_mode').default('dark'),
    notificationsEnabled: integer('notifications_enabled').default(1), // 1 for true, 0 for false
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userProfiles = pgTable('user_profiles', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull().unique(),
    weight: doublePrecision('weight'),
    height: doublePrecision('height'),
    age: integer('age'),
    gender: text('gender'),
    activityLevel: text('activity_level'),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userGoals = pgTable('user_goals', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull().unique(),
    calorieTarget: integer('calorie_target'),
    proteinTarget: integer('protein_target'),
    carbsTarget: integer('carbs_target'),
    fatsTarget: integer('fats_target'),
    waterTarget: integer('water_target'),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const foodLogs = pgTable('food_logs', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    foodName: text('food_name').notNull(),
    calories: integer('calories').notNull(),
    protein: integer('protein'),
    carbs: integer('carbs'),
    fats: integer('fats'),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export const waterLogs = pgTable('water_logs', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    amount: integer('amount').notNull(), // in glasses or ml
    timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export const workoutLogs = pgTable('workout_logs', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    workoutName: text('workout_name').notNull(),
    duration: integer('duration'), // in minutes
    caloriesBurned: integer('calories_burned'),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export const progressPhotos = pgTable('progress_photos', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    imageUrl: text('image_url').notNull(),
    caption: text('caption'),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
});
