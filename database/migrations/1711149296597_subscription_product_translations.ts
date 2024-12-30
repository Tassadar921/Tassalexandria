import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';

export default class extends BaseSchema {
    protected tableName: string = 'subscription_product_translations';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.string('name').notNullable();
            table.string('description').notNullable();
            table.boolean('enabled').defaultTo(true);
            table.string('stripe_price_id').notNullable();
            table.uuid('language_id').references('id').inTable('languages').onDelete('CASCADE').onUpdate('CASCADE');
            table
                .uuid('subscription_product_id')
                .references('id')
                .inTable('subscription_products')
                .onUpdate('CASCADE')
                .onDelete('CASCADE')
                .withKeyName('product_id');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
