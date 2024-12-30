import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';

export default class extends BaseSchema {
    protected tableName: string = 'card_prints';

    async up(): Promise<void> {
        this.schema.alterTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.specificType('key_words', 'TEXT[]');
        });
    }

    async down(): Promise<void> {
        this.schema.alterTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.dropColumn('key_words');
        });
    }
}
