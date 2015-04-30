-- while running psql in the terminal,
-- run '\i path/to/schema.sql' to generate db and tables locally

-- ---
-- Drop old tables
-- ---

DROP TABLE IF EXISTS "waypoints";
DROP TABLE IF EXISTS "users";

-- ---
-- Table 'Users'
-- ---

CREATE TABLE users (
  "user_id" SERIAL,
  "username" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  PRIMARY KEY ("user_id")
);

-- ---
-- Table 'Waypoints'
-- ---

CREATE TABLE waypoints (
  "waypoint_id" SERIAL,
  "latitude" REAL NOT NULL,
  "longitude" REAL NOT NULL,
  "user_id" INTEGER NOT NULL,
  PRIMARY KEY ("waypoint_id"),
  FOREIGN KEY ("user_id") REFERENCES users ("user_id") ON DELETE CASCADE
);
