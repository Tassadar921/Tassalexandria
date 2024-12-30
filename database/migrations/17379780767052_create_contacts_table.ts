import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';
import ContactStatusEnum from '#types/enum/contact_status_enum';

export default class extends BaseSchema {
    protected tableName: string = 'contacts';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
            table.string('subject').notNullable();
            table.text('message').notNullable();
            table.enum('status', Object.values(ContactStatusEnum)).defaultTo(ContactStatusEnum.PENDING);
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
