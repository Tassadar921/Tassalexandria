import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';
import StripeProductIntervalEnum from '#types/enum/stripe_product_interval_enum';
import StripeProductPriceModeEnum from '#types/enum/stripe_product_price_mode_enum';

export default class extends BaseSchema {
    protected tableName: string = 'subscription_products';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.decimal('price').notNullable();
            table.enum('interval', Object.values(StripeProductIntervalEnum)).notNullable();
            table.integer('interval_count').notNullable();
            table.enum('mode', Object.values(StripeProductPriceModeEnum)).notNullable().defaultTo(StripeProductPriceModeEnum.RECURRING);
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
