create table public.news (
    id text not null,
    category character varying(50) not null,
    title text not null,
    description text null,
    content text null,
    url character varying(500) not null,
    image_url character varying(500) null,
    source_name character varying(100) null,
    published_at timestamp without time zone not null,
    created_at timestamp without time zone null default CURRENT_TIMESTAMP,
    constraint news_pkey primary key (id),
    constraint news_url_key unique (url)
) TABLESPACE pg_default;

create index IF not exists idx_news_category on public.news using btree (category) TABLESPACE pg_default;

create index IF not exists idx_news_published on public.news using btree (published_at desc) TABLESPACE pg_default;


-- Índice para búsqueda rápida por fecha
CREATE INDEX idx_published_at ON news(published_at DESC);