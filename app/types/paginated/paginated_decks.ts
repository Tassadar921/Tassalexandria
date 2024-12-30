import SerializedDeckLight from '#types/serialized/serialized_deck_light';

type PaginatedDecks = {
    decks: SerializedDeckLight[];
    firstPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    currentPage: number;
};

export default PaginatedDecks;
