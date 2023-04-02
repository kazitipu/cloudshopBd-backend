const INITIAL_STATE = {
  brands: [],
};

const brandsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "GET_ALL_BRANDS":
      return { ...state, brands: [...action.payload] };

    case "UPLOAD_BRAND":
      return {
        ...state,
        brands: [action.payload, ...state.brands],
      };
    case "UPDATE_BRAND":
      const filteredProductsArray = state.brands.filter(
        (brand) => brand.id !== action.payload.id
      );

      return {
        ...state,
        brands: [action.payload, ...filteredProductsArray],
      };
    case "DELETE_BRAND":
      const updatedProductsArray = state.brands.filter(
        (product) => product.id !== action.payload.id
      );
      let brandsArray = updatedProductsArray.map((brand) => {
        if (brand.parentBrand == action.payload.id) {
          return { ...brand, parentBrand: action.payload.parentId };
        } else {
          return brand;
        }
      });
      return {
        ...state,
        brands: [...brandsArray],
      };
    default:
      return { ...state };
  }
};
export default brandsReducer;
