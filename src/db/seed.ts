import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from 'dotenv';
import postgres from 'postgres';

// Load env files in priority order (Next.js convention):
// .env.local > .env.development/.env.production > .env
config({ path: '.env.local' });
config({ path: '.env.development' });
config({ path: '.env.production' });
config({ path: '.env' });

async function runSqlFile(sql: postgres.Sql, relativePath: string) {
  const fullPath = path.resolve(process.cwd(), relativePath);
  const sqlContent = await fs.readFile(fullPath, 'utf8');
  console.info(`[db:seed] Running ${relativePath}...`);
  await sql.unsafe(sqlContent);
}

async function main() {
  const databaseUrl =
    process.env.DATABASE_URL_DIRECT ?? process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL_DIRECT or DATABASE_URL is not set');
  }

  const sql = postgres(databaseUrl, {
    max: 1,
    onnotice: () => {},
  });

  try {
    await runSqlFile(sql, 'docs/sql/triggers.sql');
    await runSqlFile(sql, 'docs/sql/views.sql');
    await runSqlFile(sql, 'docs/sql/functions.sql');
    await runSqlFile(sql, 'docs/sql/seed.letters.sql');
    await runSqlFile(sql, 'docs/sql/seed.articulations.sql');
    await runSqlFile(sql, 'docs/sql/seed.traits.sql');
    await runSqlFile(sql, 'docs/sql/seed.references.sql');
    await runSqlFile(sql, 'docs/sql/seed.tajwid.sql');
    await runSqlFile(sql, 'docs/sql/seed.questions.sql');

    console.info('[db:seed] Refreshing mv_playground_data...');
    await sql.unsafe(
      'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_playground_data;',
    );

    console.info('[db:seed] Refreshing mv_tajwid_reference...');
    await sql.unsafe(
      'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_tajwid_reference;',
    );

    const [summary] = await sql`
      SELECT
        (SELECT count(*)::int FROM hij_letters) AS letters,
        (SELECT count(*)::int FROM hij_letters WHERE parent_letter_slug IS NULL) AS root_letters,
        (SELECT count(*)::int FROM hij_articulation_points) AS articulation_points,
        (SELECT count(*)::int FROM hij_letter_articulations) AS letter_articulations,
        (SELECT count(*)::int FROM hij_traits) AS traits,
        (SELECT count(*)::int FROM hij_letter_traits) AS letter_traits,
        (SELECT count(*)::int FROM ref_verses) AS ref_verses,
        (SELECT count(*)::int FROM taj_rules) AS taj_rules,
        (SELECT count(*)::int FROM taj_rule_definitions) AS taj_rule_definitions,
        (SELECT count(*)::int FROM taj_examples) AS taj_examples,
        (SELECT count(*)::int FROM cur_questions) AS cur_questions
    `;

    console.info('[db:seed] Database seeded successfully:', summary);
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error('[db:seed] Failed:', error);
  process.exitCode = 1;
});
