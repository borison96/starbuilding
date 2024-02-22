CREATE TABLE IF NOT EXISTS seeder (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    version INT NULL,
    table_name VARCHAR(100) NOT NULL,
    status bool NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    version INT NULL,
    firstname VARCHAR(256) NULL,
    lastname VARCHAR(256) NULL,
    password VARCHAR(256) NOT NULL,
    email VARCHAR(256) NOT NULL,
    phone VARCHAR(256) NULL,
    role VARCHAR(100) NULL,
    phone_fixed VARCHAR(256) NULL,
    portfolio_url VARCHAR(256) NULL,
    user_type VARCHAR(100) NOT NULL,
    email_verified_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(email)
);

CREATE TABLE IF NOT EXISTS domaine (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    version INT NULL,
    code_rome VARCHAR(100) NOT NULL,
    appellation VARCHAR(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS competence (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    version INT NULL,
    domain_id INT NOT NULL,
    code_rome VARCHAR(100) NOT NULL,
    appellation VARCHAR(256) NOT NULL,
    CONSTRAINT fk_competence_domain FOREIGN KEY(domain_id) REFERENCES domaine(id)
);

CREATE TABLE IF NOT EXISTS profession (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    version INT NULL,
    competence_id INT NOT NULL,
    code_rome VARCHAR(100) NOT NULL,
    appellation VARCHAR(256) NOT NULL,
    code_ogr VARCHAR(100) NULL,
    CONSTRAINT fk_prof_competence FOREIGN KEY(competence_id) REFERENCES competence(id)
);
