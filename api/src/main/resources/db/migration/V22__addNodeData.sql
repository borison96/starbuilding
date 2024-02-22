create table node_data
(
    id bigserial
        constraint pk_nodedata primary key,
    node_id text not null unique,
    data    text not null,
    version int not null
);