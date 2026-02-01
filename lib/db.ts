import { neon } from '@neondatabase/serverless';

// Create Neon SQL client
const sql = neon(process.env.DATABASE_URL!);

// Query function compatible with existing code
export async function query<T>(sqlQuery: string, params?: unknown[]): Promise<T> {
  try {
    // Convert MySQL-style ? placeholders to PostgreSQL $1, $2, etc.
    let pgQuery = sqlQuery;
    let paramIndex = 1;
    while (pgQuery.includes('?')) {
      pgQuery = pgQuery.replace('?', `$${paramIndex}`);
      paramIndex++;
    }
    
    // Convert MySQL-specific syntax to PostgreSQL
    pgQuery = pgQuery
      .replace(/UUID\(\)/g, 'gen_random_uuid()')
      .replace(/NOW\(\)/g, 'NOW()')
      .replace(/LIMIT \?/g, `LIMIT $${paramIndex - 1}`);
    
    const result = await sql(pgQuery, params as any[]);
    return result as T;
  } catch (error) {
    console.error('[DB Error]', error);
    throw error;
  }
}

// Export sql for direct tagged template usage
export { sql };

export default sql;
