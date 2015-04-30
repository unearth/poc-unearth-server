-- while running psql in the terminal,
-- run '\i path/to/schema.sql' to generate db and tables locally

-- ---
-- Drop old tables
-- ---

DROP TABLE IF EXISTS "waypoints";
DROP TABLE IF EXISTS "local_auth";
DROP TABLE IF EXISTS "facebook_auth";
DROP TABLE IF EXISTS "twitter_auth";
DROP TABLE IF EXISTS "google_auth";
DROP TABLE IF EXISTS "users";

-- ---
-- Users Table
-- ---

CREATE TABLE users (
  "user_id" SERIAL,
  "username" TEXT NOT NULL,
  PRIMARY KEY ("user_id")
);

-- ---
-- Waypoints Table
-- ---

CREATE TABLE waypoints (
  "waypoint_id" SERIAL,
  "latitude" REAL NOT NULL,
  "longitude" REAL NOT NULL,
  "user_id" INTEGER NOT NULL,
  PRIMARY KEY ("waypoint_id"),
  FOREIGN KEY ("user_id") REFERENCES users ("user_id") ON DELETE CASCADE
);


-- ---
-- Auth Tables
-- ---

CREATE TABLE local_auth (
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "user_id" INTEGER NOT NULL,
  PRIMARY KEY ("email"),
  FOREIGN KEY ("user_id") REFERENCES users ("user_id") ON DELETE CASCADE
);

CREATE TABLE facebook_auth (
  "facebook_id" TEXT NOT NULL,
  "user_id" INTEGER NOT NULL,
  "token" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  PRIMARY KEY ("facebook_id"),
  FOREIGN KEY ("user_id") REFERENCES users ("user_id") ON DELETE CASCADE
);

CREATE TABLE google_auth (
  "google_id" TEXT NOT NULL,
  "user_id" INTEGER NOT NULL,
  "token" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  PRIMARY KEY ("google_id"),
  FOREIGN KEY ("user_id") REFERENCES users ("user_id") ON DELETE CASCADE
);

CREATE TABLE twitter_auth (
  "twitter_id" TEXT NOT NULL,
  "user_id" INTEGER NOT NULL,
  "token" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  PRIMARY KEY ("twitter_id"),
  FOREIGN KEY ("user_id") REFERENCES users ("user_id") ON DELETE CASCADE
);
