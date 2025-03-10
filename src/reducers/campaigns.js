const INITIAL_STATE = {
  campaigns: [],
  homeCategories: [],
  announcements: [],
};

const campaignsReducers = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "GET_ALL_CAMPAIGNS":
      return { ...state, campaigns: [...action.payload] };

    case "UPLOAD_CAMPAIGN":
      return {
        ...state,
        campaigns: [action.payload, ...state.campaigns],
      };
    case "UPDATE_CAMPAIGN":
      const filteredProductsArray = state.campaigns.filter(
        (campaign) => campaign.id !== action.payload.id
      );

      return {
        ...state,
        campaigns: [action.payload, ...filteredProductsArray],
      };
    case "DELETE_CAMPAIGN":
      const updatedProductsArray = state.campaigns.filter(
        (product) => product.id !== action.payload
      );
      return {
        ...state,
        campaigns: [...updatedProductsArray],
      };
    case "GET_ALL_ANNOUNCEMENTS":
      return { ...state, announcements: [...action.payload] };

    case "UPLOAD_ANNOUNCEMENT":
      return {
        ...state,
        announcements: [action.payload, ...state.announcements],
      };
    case "UPDATE_ANNOUNCEMENT":
      const filteredProductsArray3 = state.announcements.filter(
        (announcement) => announcement.id !== action.payload.id
      );

      return {
        ...state,
        announcements: [action.payload, ...filteredProductsArray3],
      };
    case "DELETE_ANNOUNCEMENT":
      const updatedProductsArray3 = state.announcements.filter(
        (product) => product.id !== action.payload
      );
      return {
        ...state,
        announcements: [...updatedProductsArray3],
      };
    case "GET_ALL_HOME_CATEGORIES":
      return { ...state, homeCategories: [...action.payload] };

    case "UPLOAD_HOME_CATEGORY":
      return {
        ...state,
        homeCategories: [action.payload, ...state.homeCategories],
      };
    case "UPDATE_HOME_CATEGORY":
      const filteredProductsArray2 = state.homeCategories.filter(
        (cat) => cat.id !== action.payload.id
      );

      return {
        ...state,
        homeCategories: [action.payload, ...filteredProductsArray2],
      };
    case "DELETE_HOME_CATEGORY":
      const updatedProductsArray2 = state.homeCategories.filter(
        (product) => product.id !== action.payload
      );
      return {
        ...state,
        homeCategories: [...updatedProductsArray2],
      };
    default:
      return { ...state };
  }
};
export default campaignsReducers;
