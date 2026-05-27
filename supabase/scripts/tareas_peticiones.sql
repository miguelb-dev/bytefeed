-- Habilitar pg_cron para programar tareas
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Habilitar pg_net para hacer peticiones HTTP desde PostgreSQL
CREATE EXTENSION IF NOT EXISTS pg_net;