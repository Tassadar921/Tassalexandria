import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';
import CardPrintRelatedPrintTypeEnum from '#types/enum/card_related_card_type_enum';

export default class extends BaseSchema {
    protected tableName: string = 'card_related_cards';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.enum('type', Object.values(CardPrintRelatedPrintTypeEnum)).notNullable();
            table.uuid('base_card_id').nullable().references('id').inTable('cards').onDelete('CASCADE');
            table.uuid('related_card_id').nullable().references('id').inTable('cards').onDelete('CASCADE');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
