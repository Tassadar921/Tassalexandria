import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';

export default class extends BaseSchema {
    protected tableName: string = 'subscriptions';

    async up(): Promise<void> {
        this.schema.alterTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.dateTime('end_at').alter();
        });
    }

    async down(): Promise<void> {
        this.schema.alterTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.string('end_at').alter();
        });
    }
}
