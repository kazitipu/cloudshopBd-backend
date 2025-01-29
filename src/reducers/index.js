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
import reviewsReducer from "./reviews";
import campaignsReducers from "./campaigns";
import partialsReducers from "./partials";
import officesReducer from "./offices";
import cnfsReducer from "./cnfs";
import employeesReducer from "./employee";
import expensesReducer from "./expenses";
import cashInsReducer from "./cashIn";
import setExpressRatesDocumentsReducer from "./expressRatesDocuments";
import setExpressRatesParcelReducer from "./expressRatesParcel";
import loansReducer from "./loans";
import installmentsReducer from "./installments";
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
  reviews: reviewsReducer,
  campaigns: campaignsReducers,
  offices: officesReducer,
  cnfs: cnfsReducer,
  employees: employeesReducer,
  expenses: expensesReducer,
  cashIns: cashInsReducer,
  expressRatesDocuments: setExpressRatesDocumentsReducer,
  expressRatesParcel: setExpressRatesParcelReducer,
  loans: loansReducer,
  installments: installmentsReducer,
});

export default rootReducer;
