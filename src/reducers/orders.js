const INITIAL_STATE = { orders: [], ordersApi: [] };

const setOrdersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SET_ALL_ORDERS":
      return { ...state, orders: [...action.payload] };
    case "GET_ALL_ORDERS":
      return { ...state, orders: action.payload };
    case "UPDATE_ORDER":
      return {
        ...state,
        orders: state.orders.map((order) => {
          if (order.id == action.payload.id) {
            return action.payload;
          } else {
            return order;
          }
        }),
      };
    default:
      return { ...state };
  }
};
export default setOrdersReducer;
