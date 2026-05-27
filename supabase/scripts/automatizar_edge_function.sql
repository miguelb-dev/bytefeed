SELECT cron.schedule(
  'fetch-gnews-every-6-hours',    -- Nombre del cron job
  '0 */6 * * *',                  -- Se ejecutará cada 6 horas
  $$
  SELECT net.http_post(
    url := 'https://TU_PROYECTO_ID.supabase.co/functions/v1/fetch-gnews',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization': 'Bearer TU_SERVICE_ROLE_KEY'),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

-- TU_PROYECTO_ID: En Dashboard → Project Settings → API → Project URL (es lo que está antes de .supabase.co)

-- TU_SERVICE_ROLE_KEY: En Dashboard → Project Settings → API → service_role key
