DROP DATABASE IF EXISTS foodfy;
CREATE DATABASE foodfy;

-- to run seeds
DELETE FROM users;
DELETE FROM chefs;
DELETE FROM recipes;
DELETE FROM files;
DELETE FROM recipe_files;

-- restart sequence auto_increment from tales ids
ALTER SEQUENCE chefs_id_seq RESTART WITH 1;
ALTER SEQUENCE recipes_id_seq RESTART WITH 1;
ALTER SEQUENCE files_id_seq RESTART WITH 1;
ALTER SEQUENCE recipe_files_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "reset_token" TEXT,
  "reset_token_expires" TEXT,
  "is_admin" BOOLEAN DEFAULT false,
  "created_at" TIMESTAMP DEFAULT(now()),
  "updated_at" TIMESTAMP DEFAULT(now())
);

CREATE TABLE "files" (
"id" SERIAL PRIMARY KEY,
"name" text NOT NULL,
"path" text NOT NULL
);

CREATE TABLE "chefs" (
"id" SERIAL PRIMARY KEY,
"name" text NOT NULL,
"file_id" integer NOT NULL REFERENCES "files" (id),
"created_at" timestamp DEFAULT (now()),
"updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "recipes" (
"id" SERIAL PRIMARY KEY,
"chef_id" integer NOT NULL REFERENCES "chefs"(id),
"user_id" integer NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
"title" text NOT NULL,
"ingredients" text NOT NULL,
"preparation" text NOT NULL,
"information" text NOT NULL,
"created_at" timestamp DEFAULT (now()),
"updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "recipe_files" (
"id" SERIAL PRIMARY KEY,
"recipe_id" integer REFERENCES recipes(id) ON DELETE CASCADE,
"file_id" integer REFERENCES files(id)
);

CREATE TABLE "session" (
"sid" varchar NOT NULL COLLATE "default",
"sess" json NOT NULL,
"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session"
ADD CONSTRAINT "session_pkey"
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

--create procedure
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--auto updated_at recipes
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

--auto updated_at chefs
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON chefs
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

--auto updated_at users
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- user cascade function
CREATE OR REPLACE FUNCTION delete_files_when_recipe_files_row_was_deleted()
RETURNS TRIGGER AS $$
BEGIN
EXECUTE ('DELETE FROM files
WHERE id = $1')
USING OLD.file_id;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- user cascade trigger
CREATE TRIGGER delete_recipe_files
AFTER DELETE ON recipe_files
FOR EACH ROW
EXECUTE PROCEDURE delete_files_when_recipe_files_row_was_deleted();

-- DELETE CASCADE
ALTER TABLE "recipe_files"
DROP CONSTRAINT recipe_files_recipe_id_fkey,
ADD CONSTRAINT recipe_files_recipe_id_fkey
FOREIGN KEY ("recipe_id")
REFERENCES recipes("id")
ON DELETE CASCADE;

ALTER TABLE "recipe_files"
DROP CONSTRAINT recipe_files_file_id_fkey,
ADD CONSTRAINT recipe_files_file_id_fkey
FOREIGN KEY ("file_id")
REFERENCES files("id")
ON DELETE CASCADE