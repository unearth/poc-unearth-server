-- while running psql in the terminal,
-- run '\i path/to/schema.sql' to generate db and tables locally

-- ---
-- Drop old tables
-- ---

DROP TABLE IF EXISTS "group_join";
DROP TABLE IF EXISTS "group_pending";

DROP TABLE IF EXISTS "facebook_auth";
DROP TABLE IF EXISTS "twitter_auth";
DROP TABLE IF EXISTS "google_auth";

DROP TABLE IF EXISTS "waypoints";
DROP TABLE IF EXISTS "markers";
DROP TABLE IF EXISTS "users";
DROP TABLE IF EXISTS "groups";


-- ---
-- Users Table
-- ---

CREATE TABLE users (
  "user_id" SERIAL,
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "token" TEXT,
  PRIMARY KEY ("user_id")
);

-- ---
-- Waypoints Table
-- ---

CREATE TABLE waypoints (
  "waypoint_id" SERIAL,
  "user_id" INTEGER NOT NULL,
  "location" POINT NOT NULL,
  PRIMARY KEY ("waypoint_id"),
  FOREIGN KEY ("user_id") REFERENCES users ("user_id") ON DELETE CASCADE
);

-- ---
-- Group Tables
-- ---

CREATE TABLE groups (
  "group_id" SERIAL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  PRIMARY KEY ("group_id")
);

CREATE TABLE group_join (
  "group_id" INTEGER NOT NULL,
  "user_id" INTEGER NOT NULL,
  FOREIGN KEY ("group_id") REFERENCES groups ("group_id"),
  FOREIGN KEY ("user_id") REFERENCES users ("user_id")
);

CREATE TABLE group_pending (
  "group_id" INTEGER NOT NULL,
  "sender_id" INTEGER NOT NULL,
  "receiver_id" INTEGER NOT NULL,
  FOREIGN KEY ("group_id") REFERENCES groups ("group_id"),
  FOREIGN KEY ("sender_id") REFERENCES users ("user_id"),
  FOREIGN KEY ("receiver_id") REFERENCES users ("user_id")
);


-- ---
-- Marker Tables
-- ---
CREATE TABLE markers (
  "group_id" INTEGER NOT NULL,
  "user_id" INTEGER NOT NULL,
  "location" POINT NOT NULL,
  "description" TEXT,
  "image_url" TEXT,
  "name" TEXT NOT NULL,
  FOREIGN KEY ("group_id") REFERENCES groups ("group_id"),
  FOREIGN KEY ("user_id") REFERENCES users ("user_id")
);


-- ---
-- Auth Tables
-- ---

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
  "display_name" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  PRIMARY KEY ("twitter_id"),
  FOREIGN KEY ("user_id") REFERENCES users ("user_id") ON DELETE CASCADE
);
