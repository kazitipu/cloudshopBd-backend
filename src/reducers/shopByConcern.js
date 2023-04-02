const INITIAL_STATE = {
  tags: [],
};

const tagsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "GET_ALL_TAGS":
      return { ...state, tags: [...action.payload] };

    case "UPLOAD_TAG":
      return {
        ...state,
        tags: [action.payload, ...state.tags],
      };
    case "UPDATE_TAG":
      const filteredProductsArray = state.tags.filter(
        (tag) => tag.id !== action.payload.id
      );

      return {
        ...state,
        tags: [action.payload, ...filteredProductsArray],
      };
    case "DELETE_TAG":
      const updatedProductsArray = state.tags.filter(
        (product) => product.id !== action.payload.id
      );

      return {
        ...state,
        tags: updatedProductsArray,
      };
    default:
      return { ...state };
  }
};
export default tagsReducer;
