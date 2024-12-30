import { Knex } from 'knex';
import { BaseSchema } from '@adonisjs/lucid/schema';
import RoleEnum from '#types/enum/role_enum';

export default class extends BaseSchema {
    protected tableName: string = 'users';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.string('username', 50).notNullable();
            table.string('email', 255).notNullable().unique();
            table.string('password', 255).notNullable();
            table.string('creation_token', 255).nullable();
            table.boolean('enabled').defaultTo(false);
            table.enum('role', Object.values(RoleEnum)).notNullable().defaultTo(RoleEnum.USER);
            table.string('remember_me_token').nullable();
            table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now());
            table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now());
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
