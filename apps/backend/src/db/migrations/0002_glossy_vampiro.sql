ALTER TABLE "device" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "device" ALTER COLUMN "session_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "fcm_token" ADD COLUMN "session_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fcm_token" ADD CONSTRAINT "fcm_token_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fcm_token_session_idx" ON "fcm_token" USING btree ("session_id");