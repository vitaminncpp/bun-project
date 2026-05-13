-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."action" AS ENUM('SUPER_USER', 'INSERT_USER', 'DELETE_USER', 'UPDATE_USER');--> statement-breakpoint
CREATE TYPE "public"."file" AS ENUM('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h');--> statement-breakpoint
CREATE TYPE "public"."game_piece" AS ENUM('PAWN', 'KNIGHT', 'BISHOP', 'ROOK', 'QUEEN', 'KING');--> statement-breakpoint
CREATE TYPE "public"."game_result" AS ENUM('WHITE_WIN', 'BLACK_WIN', 'DRAW', 'WHITE_WIN_BY_RESIGNATION', 'BLACK_WIN_BY_RESIGNATION', 'WHITE_WIN_ON_TIME', 'BLACK_WIN_ON_TIME', 'DRAW_INSUFFICIENT_MATERIAL', 'DRAW_STALEMATE', 'DRAW_THREEFOLD_REPETITION', 'DRAW_FIFTY_MOVE_RULE', 'DRAW_AGREEMENT', 'ABORTED', 'PENDING');--> statement-breakpoint
CREATE TYPE "public"."game_status" AS ENUM('PENDING', 'ACTIVE', 'FINISHED', 'ABORTED', 'INVALID', 'CANCELED');--> statement-breakpoint
CREATE TYPE "public"."move_type" AS ENUM('NOT_APPLICABLE', 'ILLEGAL_MOVE', 'WRONG_PLAYER', 'REGULAR_MOVE', 'CAPTURE_MOVE', 'PROMOTION_MOVE', 'EN_PASSANT_MOVE', 'LONG_CASTLE', 'SHORT_CASTLE', 'CHECK_MOVE', 'CHECKMATE_MOVE', 'RESIGNATION_MOVE', 'STALEMATE_MOVE', 'THREEFOLD_REPETITION_MOVE', 'FIFTY_MOVE_RULE_MOVE', 'AGREEMENT_MOVE');--> statement-breakpoint
CREATE TYPE "public"."player" AS ENUM('WHITE', 'BLACK');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_w" uuid NOT NULL,
	"player_b" uuid NOT NULL,
	"status" "game_status" DEFAULT 'PENDING' NOT NULL,
	"result" "game_result" DEFAULT 'PENDING' NOT NULL,
	"rating_change_w" integer DEFAULT 0 NOT NULL,
	"rating_change_b" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone DEFAULT now(),
	"time_control" integer DEFAULT 600 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "moves" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"move_number" integer NOT NULL,
	"player" "player" NOT NULL,
	"from_file" "file" NOT NULL,
	"from_rank" smallint NOT NULL,
	"to_file" "file" NOT NULL,
	"to_rank" smallint NOT NULL,
	"piece" "game_piece" NOT NULL,
	"move_type" "move_type" NOT NULL,
	"captured_piece" "game_piece",
	"promotion" "game_piece",
	"notation" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"rating" integer DEFAULT 400 NOT NULL,
	"games_played" integer DEFAULT 0 NOT NULL,
	"wins" integer DEFAULT 0 NOT NULL,
	"losses" integer DEFAULT 0 NOT NULL,
	"draws" integer DEFAULT 0 NOT NULL,
	"bio" varchar(255),
	"avatar_url" varchar(255),
	CONSTRAINT "profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"icon" varchar,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rolename" varchar(255) NOT NULL,
	"description" varchar(255),
	"is_deleted" boolean DEFAULT false NOT NULL,
	CONSTRAINT "roles_rolename_unique" UNIQUE("rolename")
);
--> statement-breakpoint
CREATE TABLE "role_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_id" uuid NOT NULL,
	"action" "action" NOT NULL,
	"description" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"description" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_player_w_users_id_fk" FOREIGN KEY ("player_w") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_player_b_users_id_fk" FOREIGN KEY ("player_b") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "moves" ADD CONSTRAINT "moves_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "role_actions" ADD CONSTRAINT "role_actions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE cascade;
*/