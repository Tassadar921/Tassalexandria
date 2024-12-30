import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';

export default class extends BaseSchema {
    protected tableName: string = 'card_print_prices';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.decimal('usd', 10).nullable();
            table.decimal('usd_foil', 10).nullable();
            table.decimal('eur', 10).nullable();
            table.decimal('eur_foil', 10).nullable();
            table.uuid('card_print_id').nullable().references('id').inTable('card_prints').onDelete('CASCADE');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
