CREATE TABLE project_knowledge_base (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
   version INTEGER,
   project_id BIGINT,
   content JSONB,
   CONSTRAINT pk_projectknowledgebase PRIMARY KEY (id)
);

ALTER TABLE project ADD latitude DOUBLE PRECISION NULL;

ALTER TABLE project ADD longitude DOUBLE PRECISION NULL;

ALTER TABLE project ADD picture VARCHAR(255) NULL;

ALTER TABLE project_knowledge_base ADD CONSTRAINT FK_PROJECTKNOWLEDGEBASE_ON_PROJECT FOREIGN KEY (project_id) REFERENCES project (id);

ALTER TABLE project DROP CONSTRAINT fk_project_on_project_node;

ALTER TABLE project_node DROP CONSTRAINT fk_projectnode_on_creator;

ALTER TABLE project_node DROP CONSTRAINT fk_projectnode_on_node_type;

ALTER TABLE project_node_relation DROP CONSTRAINT fk_projectnoderelation_on_end;

ALTER TABLE project_node_relation DROP CONSTRAINT fk_projectnoderelation_on_start;

DROP TABLE project_node CASCADE;

DROP TABLE project_node_relation CASCADE;

ALTER TABLE project DROP COLUMN project_node;