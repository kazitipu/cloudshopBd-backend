const INITIAL_STATE = {
  reviews: [],
};

const reviewsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "GET_ALL_REVIEWS":
      return { ...state, reviews: [...action.payload] };

    case "UPDATE_REVIEW":
      const filteredProductsArray = state.reviews.map((review) => {
        if (review.id == action.payload.id) {
          return action.payload;
        } else {
          return review;
        }
      });
      return {
        ...state,
        reviews: filteredProductsArray,
      };
    case "DELETE_REVIEW":
      const updatedProductsArray = state.attributes.filter(
        (product) => product.id !== action.payload.id
      );

      return {
        ...state,
        attributes: updatedProductsArray,
      };
    default:
      return { ...state };
  }
};

export default reviewsReducer;
