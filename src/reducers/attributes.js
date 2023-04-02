const INITIAL_STATE = {
  attributes: [],
};

const attributesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "GET_ALL_ATTRIBUTES":
      return { ...state, attributes: [...action.payload] };

    case "UPLOAD_ATTRIBUTE":
      return {
        ...state,
        attributes: [action.payload, ...state.attributes],
      };
    case "UPDATE_ATTRIBUTE":
      const filteredProductsArray = state.attributes.filter(
        (attribute) => attribute.id !== action.payload.id
      );

      return {
        ...state,
        attributes: [action.payload, ...filteredProductsArray],
      };
    case "DELETE_ATTRIBUTE":
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
export default attributesReducer;
