ALTER TABLE project ADD parent_id BIGINT;

ALTER TABLE project DROP CONSTRAINT fk_project_on_parent_project;

ALTER TABLE project DROP COLUMN parent_project_id;