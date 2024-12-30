import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';
import SerializedFile from '#types/serialized/serialized_file';

export default class File extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare name: string;

    @column()
    declare path: string;

    @column()
    declare extension: string;

    @column()
    declare mimeType: string;

    // File size in bytes
    @column()
    declare size: number;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    private bytesToMegabytes(bytes: number): number {
        return Math.round((bytes * 100) / 1024 / 1024) / 100;
    }

    public apiSerialize(): SerializedFile {
        return {
            name: this.name,
            path: this.path,
            extension: this.extension,
            mimeType: this.mimeType,
            size: this.bytesToMegabytes(this.size),
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }
}
