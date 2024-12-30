import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';

export default class extends BaseSchema {
    protected tableName: string = 'sets';

    async up(): Promise<void> {
        this.schema.alterTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.datetime('released_at').nullable();
            table.dropColumn('release_date');
        });
    }

    async down(): Promise<void> {
        this.schema.alterTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.dropColumn('released_at');
            table.datetime('release_date').nullable();
        });
    }
}
