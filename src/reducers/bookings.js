const INITIAL_STATE = { productRequests: [], shipmentRequests: [] };

const setProductRequestsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "GET_ALL_PRODUCT_REQUESTS":
      return { ...state, productRequests: [...action.payload] };
    case "GET_ALL_SHIPMENT_REQUESTS":
      return { ...state, shipmentRequests: [...action.payload] };
    case "GET_SINGLE_BOOKING":
      return { ...state, bookingObj: action.payload };
    // case "UPLOAD_LOT":
    //   return { ...state, lots: [...state.lots, action.payload] };
    case "UPDATE_PRODUCT_REQUEST":
      const filteredBooking = state.productRequests.map((booking) => {
        if (booking.bookingId === action.payload.bookingId) {
          return action.payload;
        } else {
          return booking;
        }
      });

      return { ...state, productRequests: [...filteredBooking] };
    case "UPDATE_SHIPMENT_REQUEST":
      const filteredBooking2 = state.shipmentRequests.map((booking) => {
        if (booking.bookingId === action.payload.bookingId) {
          return action.payload;
        } else {
          return booking;
        }
      });

      return { ...state, shipmentRequests: [...filteredBooking2] };
    default:
      return { ...state };
  }
};
export default setProductRequestsReducer;
