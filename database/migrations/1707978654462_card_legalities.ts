import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';
import CardLegalityEnum from '#types/enum/card_legality_enum';

export default class extends BaseSchema {
    protected tableName: string = 'card_legalities';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.enum('standard', Object.values(CardLegalityEnum)).notNullable().defaultTo(CardLegalityEnum.NOT_LEGAL);
            table.enum('pioneer', Object.values(CardLegalityEnum)).notNullable().defaultTo(CardLegalityEnum.NOT_LEGAL);
            table.enum('modern', Object.values(CardLegalityEnum)).notNullable().defaultTo(CardLegalityEnum.NOT_LEGAL);
            table.enum('legacy', Object.values(CardLegalityEnum)).notNullable().defaultTo(CardLegalityEnum.NOT_LEGAL);
            table.enum('pauper', Object.values(CardLegalityEnum)).notNullable().defaultTo(CardLegalityEnum.NOT_LEGAL);
            table.enum('vintage', Object.values(CardLegalityEnum)).notNullable().defaultTo(CardLegalityEnum.NOT_LEGAL);
            table.enum('commander', Object.values(CardLegalityEnum)).notNullable().defaultTo(CardLegalityEnum.NOT_LEGAL);
            table.enum('pauper_commander', Object.values(CardLegalityEnum)).notNullable().defaultTo(CardLegalityEnum.NOT_LEGAL);
            table.enum('duel', Object.values(CardLegalityEnum)).notNullable().defaultTo(CardLegalityEnum.NOT_LEGAL);
            table.uuid('card_id').nullable().references('id').inTable('cards').onDelete('CASCADE');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
