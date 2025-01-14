const formatFileSize = (size) => {
    return Math.floor(size / 10) / 100;
};

const getUnitNotation = (size) => {
    if (size >= 1000000000000) {
        return 'common.size.tb';
    } else if (size >= 1000000000) {
        return 'common.size.gb';
    } else if (size >= 1000000) {
        return 'common.size.mb';
    } else if (size >= 1000) {
        return 'common.size.Kb';
    } else {
        return 'common.size.b';
    }
};

export { formatFileSize, getUnitNotation };
