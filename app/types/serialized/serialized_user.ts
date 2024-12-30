import RoleEnum from '#types/enum/role_enum';
import SerializedFile from '#types/serialized/serialized_file';

type SerializedUser = {
    username: string;
    email: string;
    role: RoleEnum;
    enabled: boolean;
    profilePicture?: SerializedFile;
    updatedAt?: string;
    createdAt?: string;
};

export default SerializedUser;
