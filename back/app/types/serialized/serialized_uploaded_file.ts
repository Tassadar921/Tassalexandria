import SerializedUser from '#types/serialized/serialized_user';
import SerializedFile from '#types/serialized/serialized_file';
import SerializedFileTag from '#types/serialized/serialized_file_tag';

type SerializedUploadedFile = {
    id: number;
    user: SerializedUser;
    file: SerializedFile;
    fileTags: SerializedFileTag[];
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedUploadedFile;
