import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';

export default class extends BaseSchema {
    protected tableName: string = 'card_prints';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.string('scryfall_id').notNullable();
            table.string('artist').notNullable();
            table.string('collector_number').notNullable();
            table.string('scryfall_uri').notNullable();
            table.string('scryfall_api_uri').notNullable();
            table.uuid('set_id').notNullable().references('id').inTable('sets').onDelete('CASCADE');
            table.uuid('card_id').notNullable().references('id').inTable('cards').onDelete('CASCADE');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
