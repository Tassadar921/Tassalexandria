import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';
import SubscriptionStatusEnum from '#types/enum/subscription_status_enum';

export default class extends BaseSchema {
    protected tableName: string = 'subscriptions';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table
                .uuid('subscription_product_id')
                .references('id')
                .inTable('subscription_products')
                .onDelete('CASCADE')
                .withKeyName('subscription_product_to_products_fk1');
            table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').withKeyName('subscription_to_users_fk1');
            table.string('stripe_checkout_session_id').nullable();
            table.string('stripe_subscription_id').nullable();
            table.dateTime('end_at').nullable();
            table.enum('status', Object.values(SubscriptionStatusEnum)).defaultTo(SubscriptionStatusEnum.ACTIVE);
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
