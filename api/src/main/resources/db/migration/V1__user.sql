create table seeder
(
    id         bigserial
        constraint pk_seeder primary key,
    version int not null,
    table_name text not null,
    status     bool not null default false
);

create table users
(
    id                bigserial
        constraint pk_users primary key,
        version int not null,
    first_name        text,
    last_name         text,
    password          text      not null,
    email             text      not null,
    phone             text,
    role              text,
    phone_fixed       text,
    portfolio_url     text,
    user_type         text      not null,
    email_verified_at timestamp,
    created_at        timestamp not null default CURRENT_TIMESTAMP,
    updated_at        timestamp not null default CURRENT_TIMESTAMP,
    unique (email)
);


create table domaine
(
    id          bigserial
        constraint pk_domaine primary key,
        version int not null,
    code_rome   text not null,
    appellation text not null
);

create table competence
(
    id          bigserial
        constraint pk_competence primary key,
        version int not null,
    domaine_id   bigint not null,
    code_rome   text   not null,
    appellation text   not null,
    constraint fk_competence_domain foreign key (domaine_id) references domaine (id)
);

create table profession
(
    id            bigserial
        constraint pk_profession primary key,
        version int not null,
    competence_id bigint not null,
    code_rome     text   not null,
    appellation   text   not null,
    code_ogr      text   not null,
    constraint fk_prof_competence foreign key (competence_id) references competence(id)
);