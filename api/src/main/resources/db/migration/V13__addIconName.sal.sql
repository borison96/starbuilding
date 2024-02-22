ALTER TABLE project_node_type ADD icon_name VARCHAR(255);
delete from project_node_type;
INSERT INTO project_node_type (version, label, icon_name) VALUES
(0, 'projet', 'architecture'),
(0, 'organisation', 'organisation' ),
(0, 'equipe', 'equipe'),
(0, 'empty', 'empty');
