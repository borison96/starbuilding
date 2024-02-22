ALTER TABLE organisation ADD address VARCHAR(255) NULL;

ALTER TABLE project ADD parent_project_id BIGINT NULL;

ALTER TABLE project ADD CONSTRAINT FK_PROJECT_ON_PARENT_PROJECT FOREIGN KEY (parent_project_id) REFERENCES project (id);

ALTER TABLE organisation DROP COLUMN latitude;

ALTER TABLE organisation DROP COLUMN longitude;