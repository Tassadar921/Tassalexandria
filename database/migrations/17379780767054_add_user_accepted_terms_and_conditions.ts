import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';

export default class extends BaseSchema {
    protected tableName: string = 'users';

    async up(): Promise<void> {
        this.schema.alterTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.boolean('accepted_terms_and_conditions').defaultTo(false);
        });
    }

    async down(): Promise<void> {
        this.schema.alterTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.dropColumn('accepted_terms_and_conditions');
        });
    }
}
