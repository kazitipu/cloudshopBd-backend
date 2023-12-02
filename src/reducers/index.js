import { combineReducers } from "redux";
import setAdminsReducer from "./admins";
import setOrdersReducer from "./orders";
import setPaymentsReducer from "./payments";
import setProductsReducer from "./products";
import setProductRequestsReducer from "./bookings";
import setUsersReducer from "./users";
import chatsReducer from "./chats";
import brandsReducer from "./brands";
import categoriesReducer from "./categories";
import tagsReducer from "./shopByConcern";
import attributesReducer from "./attributes";
import couponsReducers from "./coupons";
const rootReducer = combineReducers({
  orders: setOrdersReducer,
  payments: setPaymentsReducer,
  admins: setAdminsReducer,
  products: setProductsReducer,
  productRequests: setProductRequestsReducer,
  users: setUsersReducer,
  chats: chatsReducer,
  brands: brandsReducer,
  coupons: couponsReducers,
  categories: categoriesReducer,
  tags: tagsReducer,
  attributes: attributesReducer,
});

export default rootReducer;
