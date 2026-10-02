const defaultSelectionState = {
  selectedMovie: null,
  trailerUrl: '',
  trailerNotFound: false,
  activeListId: null, // MovieList category that currently owns MovieDetail.
};

function selectionReducer(state, { type, payload, meta }) {
  switch (type) {
    case 'SELECT_MOVIE':
      return {
        selectedMovie: payload,
        trailerUrl: '',
        trailerNotFound: false,
        activeListId: meta.listId,
      };
    case 'SET_TRAILER_URL':
      if (state.selectedMovie?.id !== meta.movieId) return state;
      return { ...state, trailerUrl: meta.url };
    case 'SET_TRAILER_NOT_FOUND':
      if (state.selectedMovie?.id !== meta.movieId) return state;
      return { ...state, trailerNotFound: meta.trailerNotFound };
    case 'CLEAR_SELECTION':
      return defaultSelectionState;
    default:
      return state;
  }
}

export { defaultSelectionState, selectionReducer };
