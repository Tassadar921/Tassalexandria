import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';
import SerializedTag from '#types/serialized/serialized_tag';

export default class Tag extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare name: string;

    @column()
    declare color: string;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    public apiSerialize(): SerializedTag {
        return {
            name: this.name,
            color: this.color,
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }
}
