import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';

export default class extends BaseSchema {
    protected tableName: string = 'cards';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.string('oracle_id').notNullable().unique();
            table.string('layout').nullable();
            table.string('mana_cost').nullable();
            table.float('cmc').nullable();
            table.specificType('colors', 'TEXT[]');
            table.specificType('color_identity', 'TEXT[]');
            table.string('rarity').nullable();
            table.specificType('key_words', 'TEXT[]');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
