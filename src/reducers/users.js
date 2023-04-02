const INITIAL_STATE = { users: [], currency: null };

const setUsersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "GET_ALL_USERS":
      return { ...state, users: [...action.payload] };
    case "GET_CURRENCY_REDUX":
      return { ...state, currency: action.payload };
    default:
      return { ...state };
  }
};
export default setUsersReducer;
