const INITIAL_STATE = {
  products: [],
  productObj: null,
  categoryProducts: [],
  brandProducts: [],
  campaignProducts: [],
};

const setProductsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "GET_ALL_PRODUCTS":
      return { ...state, products: [...action.payload] };
    case "GET_ALL_SINGLE_CATEGORY_PRODUCTS":
      return {
        ...state,
        categoryProducts: [...action.payload.productsArray],
        lastProduct: action.payload.lastProduct,
      };
    case "GET_ALL_SINGLE_BRAND_PRODUCTS":
      return {
        ...state,
        brandProducts: [...action.payload.productsArray],
        lastProductBrand: action.payload.lastProduct,
      };
    case "GET_ALL_SINGLE_CAMPAIGN_PRODUCTS":
      return {
        ...state,
        campaignProducts: [...action.payload.productsArray],
        lastProductBrand: action.payload.lastProduct,
      };
    case "GET_SINGLE_PRODUCT":
      return { ...state, productObj: action.payload };
    case "UPDATE_PRODUCT":
      const updatedProductsArray = state.products.map((product) => {
        if (product.id == action.payload.id) {
          return action.payload;
        } else {
          return product;
        }
      });
      return { ...state, products: [...updatedProductsArray] };
    case "DELETE_PRODUCT":
      const filteredProductsArray = state.products.filter(
        (product) => product.id !== action.payload
      );
      return { ...state, products: [...filteredProductsArray] };

    default:
      return { ...state };
  }
};
export default setProductsReducer;
