import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';

export default class extends BaseSchema {
    protected tableName: string = 'deck_cards';

    async up(): Promise<void> {
        this.schema.alterTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.specificType('front_id', 'serial').notNullable();
        });
    }

    async down(): Promise<void> {
        this.schema.alterTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.dropColumn('front_id');
        });
    }
}
