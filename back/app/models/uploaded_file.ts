import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import File from '#models/file';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import User from '#models/user';
import SerializedUploadedFile from '#types/serialized/serialized_uploaded_file';
import FileTag from '#models/file_tag';
import SerializedFileTag from '#types/serialized/serialized_file_tag';

export default class UploadedFile extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare userId: string;

    @belongsTo((): typeof User => User)
    declare owner: BelongsTo<typeof User>;

    @column()
    declare fileId: string;

    @belongsTo((): typeof File => File)
    declare file: BelongsTo<typeof File>;

    @hasMany((): typeof FileTag => FileTag)
    declare fileTags: HasMany<typeof FileTag>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    public apiSerialize(): SerializedUploadedFile {
        return {
            user: this.owner.apiSerialize(),
            file: this.file.apiSerialize(),
            fileTags: this.fileTags.map((fileTag: FileTag): SerializedFileTag => fileTag.apiSerialize()),
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }
}
