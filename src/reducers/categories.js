const INITIAL_STATE = {
  categories: [],
};

const categoriesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "GET_ALL_CATEGORIES":
      return { ...state, categories: [...action.payload] };

    case "UPLOAD_CATEGORY":
      return {
        ...state,
        categories: [action.payload, ...state.categories],
      };
    case "UPDATE_CATEGORY":
      const filteredProductsArray = state.categories.filter(
        (category) => category.id !== action.payload.id
      );

      return {
        ...state,
        categories: [action.payload, ...filteredProductsArray],
      };
    case "DELETE_CATEGORY":
      const updatedProductsArray = state.categories.filter(
        (product) => product.id !== action.payload.id
      );
      let categoriesArray = updatedProductsArray.map((category) => {
        if (category.parentCategory == action.payload.id) {
          return { ...category, parentCategory: action.payload.parentId };
        } else {
          return category;
        }
      });
      return {
        ...state,
        categories: [...categoriesArray],
      };
    default:
      return { ...state };
  }
};
export default categoriesReducer;
