import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';

export default class extends BaseSchema {
    protected tableName: string = 'card_print_translations';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.string('name', 255).notNullable();
            table.string('type_line').nullable();
            table.text('text').nullable();
            table.uuid('card_print_id').nullable().references('id').inTable('card_prints').onDelete('CASCADE');
            table.uuid('card_print_face_id').nullable().references('id').inTable('card_print_faces').onDelete('CASCADE');
            table.uuid('language_id').nullable().references('id').inTable('languages').onDelete('CASCADE');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
