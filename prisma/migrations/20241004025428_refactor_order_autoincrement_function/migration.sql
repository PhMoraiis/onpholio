-- AlterTable
CREATE SEQUENCE projects_order_seq;
ALTER TABLE "projects" ALTER COLUMN "order" SET DEFAULT nextval('projects_order_seq');
ALTER SEQUENCE projects_order_seq OWNED BY "projects"."order";
