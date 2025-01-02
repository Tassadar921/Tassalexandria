import SerializedUploadedFile from '#types/serialized/serialized_uploaded_file';

type PaginatedUploadedFile = {
    uploadedFiles: SerializedUploadedFile[];
    firstPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    currentPage: number;
};

export default PaginatedUploadedFile;
