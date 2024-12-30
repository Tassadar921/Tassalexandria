import { DateTime } from 'luxon';
import {BaseModel, belongsTo, column} from '@adonisjs/lucid/orm';
import type {BelongsTo} from "@adonisjs/lucid/types/relations";
import Tag from "#models/tag";
import UploadedFile from "#models/uploaded_file";
import SerializedFileTag from "#types/serialized/serialized_file_tag";

export default class FileTag extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare tagId: string | null;

    @belongsTo((): typeof Tag => Tag)
    declare tag: BelongsTo<typeof Tag>;

    @column()
    declare uploadedFileId: string | null;

    @belongsTo((): typeof UploadedFile => UploadedFile)
    declare uploadedFile: BelongsTo<typeof UploadedFile>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    public apiSerialize(): SerializedFileTag {
        return {
            tag: this.tag.apiSerialize(),
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }
}
