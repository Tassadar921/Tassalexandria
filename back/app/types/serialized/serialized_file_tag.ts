import SerializedTag from '#types/serialized/serialized_tag';

type SerializedFileTag = {
    tag: SerializedTag;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedFileTag;
