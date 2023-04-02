const INITIAL_STATE = {
  payments: [],
  paymentRequestArray: [],
  paymentRequestOrderArray: [],
};

const setPaymentsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SET_ALL_PAYMENTS":
      return { ...state, payments: [...action.payload] };
    case "GET_ALL_PAYMENT_REQUEST":
      return { ...state, paymentRequestArray: [...action.payload] };
    case "GET_ALL_PAYMENT_REQUEST_ORDER":
      return { ...state, paymentRequestOrderArray: [...action.payload] };
    case "UPDATE_PAYMENT_REQUEST_STATUS":
      const newRequestArray = state.paymentRequestArray.map(
        (paymentRequest) => {
          if (paymentRequest.paymentId == action.payload.paymentId) {
            return action.payload;
          } else {
            return paymentRequest;
          }
        }
      );
      return { ...state, paymentRequestArray: [...newRequestArray] };
    case "UPDATE_PAYMENT_REQUEST_ORDER_STATUS":
      const newRequestArray1 = state.paymentRequestOrderArray.map(
        (paymentRequest) => {
          if (paymentRequest.paymentId == action.payload.paymentId) {
            return action.payload;
          } else {
            return paymentRequest;
          }
        }
      );
      return { ...state, paymentRequestOrderArray: [...newRequestArray1] };
    default:
      return { ...state };
  }
};
export default setPaymentsReducer;
