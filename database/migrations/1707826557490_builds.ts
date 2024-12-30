import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';
import BuildExtensionEnum from '#types/enum/build_extension_enum';

export default class extends BaseSchema {
    protected tableName: string = 'builds';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.string('name').notNullable();
            table.string('version').notNullable();
            table.integer('downloads').notNullable().defaultTo(0);
            table.enum('extension', Object.values(BuildExtensionEnum)).notNullable();
            table.integer('size').notNullable().defaultTo(0);
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
