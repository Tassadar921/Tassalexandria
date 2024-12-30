import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';

export default class extends BaseSchema {
    protected tableName: string = 'card_print_image_uris';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.string('small').nullable();
            table.string('normal').nullable();
            table.string('large').nullable();
            table.string('png').nullable();
            table.string('art_crop').nullable();
            table.uuid('card_print_id').nullable().references('id').inTable('card_prints').onDelete('CASCADE');
            table.uuid('card_print_face_id').nullable().references('id').inTable('card_print_faces').onDelete('CASCADE');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
