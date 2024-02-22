ALTER TABLE project_role ADD description VARCHAR(255);

ALTER TABLE project ADD invitations JSONB;

INSERT INTO project_role (version, name, description) VALUES
(0, 'administrateur', 'Recommandé pour les personnes qui ont besoin d''un accès complet au projet, y compris les actions sensibles et destructrices telles que la gestion de l''accès ou la suppression du projet'),
(0, 'membre', 'Recommandé pour les contributeurs qui travaillent activement sur votre projet'),
(0, 'observateur', 'Recommandé pour les contributeurs non actifs qui souhaitent voir ou discuter de votre projet');
