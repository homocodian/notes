ALTER TYPE "device_type" ADD VALUE 'TABLET';--> statement-breakpoint
ALTER TABLE "device" ADD COLUMN "id" serial NOT NULL;