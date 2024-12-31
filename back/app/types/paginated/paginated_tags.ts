import SerializedTag from '#types/serialized/serialized_tag';

type PaginatedTags = {
    tags: SerializedTag[];
    firstPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    currentPage: number;
};

export default PaginatedTags;
