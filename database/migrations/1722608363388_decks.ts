import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';
import DeckFormatEnum from '#types/enum/deck_format_enum';

export default class extends BaseSchema {
    protected tableName: string = 'decks';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.specificType('front_id', 'serial').notNullable();
            table.string('name').notNullable();
            table.string('description').nullable();
            table.boolean('public').defaultTo(false);
            table.boolean('enabled').defaultTo(true);
            table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
            table.enum('format', Object.values(DeckFormatEnum)).notNullable().defaultTo(DeckFormatEnum.COMMANDER);
            table.boolean('enable_detailed_categories').notNullable().defaultTo(false);
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
