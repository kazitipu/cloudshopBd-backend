const INITIAL_STATE = {
  attributes: [],
  terms: [],
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

    case "GET_ALL_ATTRIBUTE_TERMS":
      return { ...state, terms: [...action.payload] };

    case "UPLOAD_ATTRIBUTE_TERM":
      return {
        ...state,
        terms: [action.payload, ...state.terms],
        attributes: state.attributes.map((attribute) => {
          if (attribute.id == action.payload.parentId) {
            return {
              ...attribute,
              terms: [...attribute.terms, action.payload],
            };
          } else {
            return attribute;
          }
        }),
      };
    case "UPDATE_ATTRIBUTE_TERM":
      const filteredTermsArray = state.terms.filter(
        (term) => term.id !== action.payload.id
      );

      return {
        ...state,
        terms: [action.payload, ...filteredTermsArray],
      };
    case "DELETE_ATTRIBUTE_TERM":
      const updatedTermsArray = state.terms.filter(
        (term) => term.id !== action.payload.id
      );

      return {
        ...state,
        terms: updatedTermsArray,
      };
    default:
      return { ...state };
  }
};

export default attributesReducer;
