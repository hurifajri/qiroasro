import { jsonb, pgMaterializedView } from 'drizzle-orm/pg-core';

// MATERIALIZED VIEW
// Note: defining it as a view for strict typing in Drizzle
export const mvPlaygroundData = pgMaterializedView('mv_playground_data', {
  data: jsonb('data'),
}).existing();
