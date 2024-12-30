import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';

export default class extends BaseSchema {
    protected tableName: string = 'sets';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.string('name').nullable();
            table.string('code').nullable();
            table.string('release_date').nullable();
            table.string('type').nullable();
            table.integer('card_count').defaultTo(0);
            table.string('icon_svg_uri').nullable();
            table.string('scryfall_uri').nullable();
            table.string('scryfall_api_uri').nullable();
            table.string('uri').nullable();
            table.boolean('foil_only').defaultTo(false);
            table.boolean('non_foil_only').defaultTo(false);
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
