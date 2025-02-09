import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "./index.scss";
import App from "./components/app";
import { ScrollContext } from "react-router-scroll-4";
import { Provider } from "react-redux";

// Components
import store from "./store";
import Dashboard from "./components/dashboard";

// Products physical
import AllProducts from "./components/products/physical/allProducts";
import AllProductsByCategory from "./components/products/physical/allProductsByCategory";
import AllProductsByBrand from "./components/products/physical/allProductsByBrand";
import AllCoupons from "./components/products/physical/allCoupons";
import Sub_category from "./components/products/physical/sub-category";
import Product_list from "./components/products/physical/product-list";
import Add_product from "./components/products/physical/add-product";
import Edit_product from "./components/products/physical/edit-product";
import Add_Aliexpress_product from "./components/products/physical/add-aliexpress-product";
import Update_product from "./components/products/physical/update-product";
import Product_detail from "./components/products/physical/product-detail";
import Brands from "./components/products/physical/brands";
import Categories from "./components/products/physical/categories";
import HomeCategories from "./components/products/physical/homeCategories";
import Banners from "./components/products/physical/banner";
import ShopByConcern from "./components/products/physical/shopByConcern";
import Attributes from "./components/products/physical/attributes";
import AttributeTerms from "./components/products/physical/attributeTerms";

//Sales
import Orders from "./components/sales/orders";
import PendingOrders from "./components/sales/pendingOrders";
import PaymentApproved from "./components/sales/paymentApproved";
import Ordered from "./components/sales/ordered";
import ChinaWarehouse from "./components/sales/chinaWarehouse";
import InShipment from "./components/sales/inShipment";
import InStock from "./components/sales/inStock";
import Delivered from "./components/sales/delivered";
import UpdateOrder from "./components/sales/updateOrder";

//Coupons
import UnverifiedPayments from "./components/payments/unVerifiedPayments";
import VerifiedPayments from "./components/payments/verifiedPayments";
import Create_coupons from "./components/payments/create-coupons";

//Pages
import ProductToOrder from "./components/pages/product-to-order";
import Create_page from "./components/pages/create-page";
import Media from "./components/media/media";
import List_menu from "./components/menus/list-menu";
import Create_menu from "./components/menus/create-menu";
import List_user from "./components/users/list-user";
import Create_user from "./components/users/create-user";
import ListSuppliers from "./components/suppliers/list-suppliers";
import DetailUser from "./components/users/detail-user";
import Currency from "./components/localization/currency";
import Taxes from "./components/localization/taxes";
import Add_Product_Tax from "./components/localization/add_product_tax";
import Update_Product_Tax from "./components/localization/update-product-tax";
import Profile from "./components/settings/profile";
import Reports from "./components/reports/report";

import Datatable from "./components/common/datatable";
import Login from "./components/auth/login";
import SearchedOrder from "./components/searched-order/searched-order";
import PaymentRequest from "./components/payment-request/paymentRequest";
// Product Reqeust
import New from "./components/product-requests/new";
import NewShipmentRequest from "./components/shipment-request/new";
import OrdersApi from "./components/1688-taobao-orders/new";
import PaymentRequestOrder from "./components/payment-request/paymentRequestOrder";
import Message from "./components/messages/App";
import Reviews from "./components/products/physical/reviews";
import Campaigns from "./components/products/physical/allCampaigns";
import Announcements from "./components/products/physical/allAnnouncements";
import Invoice from "./components/1688-taobao-orders/invoice";
import MonthlyExpense from "./components/expense-history/monthly-expense/monthlyexpense";
import DailyExpense from "./components/expense/daily-expense";
import SalaryMonth from "./components/expense-history/salary/monthlyexpense";
import Salaries from "./components/expense-history/salary/monthlyexpenseByMonth";
import Refunds from "./components/expense-history/refund/monthlyexpenseByMonth";
import RefundsMonth from "./components/expense-history/refund/monthlyexpense";
import CommisionMonth from "./components/expense-history/agent-commision/monthlyexpense";
import Commisions from "./components/expense-history/agent-commision/monthlyexpenseByMonth";
import OrderMonth from "./components/expense-history/order/monthlyexpense";
import Order from "./components/expense-history/order/monthlyexpenseByMonth";
import BoostingMonth from "./components/expense-history/boostings/monthlyexpense";
import Boostings from "./components/expense-history/boostings/monthlyexpenseByMonth";
import ShippingMonth from "./components/expense-history/shippings/monthlyexpense";
import Shippings from "./components/expense-history/shippings/monthlyexpenseByMonth";
import LotTransportMonth from "./components/expense-history/lot-transport/monthlyexpense";
import OfficeCostsLotTransport from "./components/expense-history/lot-transport/monthlyexpenseByMonth";
import Loans from "./components/expense-history/loan/monthlyexpense";
import Customers from "./components/expense-history/loan/customer";
import Customers2 from "./components/expense-history/customer-due/customer.js";
import OnlyInvoiceToPrint2 from "./components/expense-history/customer-due/invoice-by-order.js";
import SingleCustomer from "./components/expense-history/loan/singleCustomer";
import Office from "./components/expense-history/office/office";
import OfficeMonth from "./components/expense-history/office/monthlyexpense";
import OfficeExpenses from "./components/expense-history/office/monthlyexpenseByMonth";
import CustomersInstallments from "./components/expense-history/monthly-installment/customer";
import SingleCustomerInstallments from "./components/expense-history/monthly-installment/singleCustomer";
import ApproveExpense from "./components/expense-history/approve-expense/approveExpense";
import ExpenseByDay from "./components/expense-history/approve-expense/daily-expense";
import Cnf from "./components/expense-history/cnf/cnf";
import CnfExpenses from "./components/expense-history/cnf/monthlyexpenseByMonth";
import CnfMonth from "./components/expense-history/cnf/monthlyexpense";

import OfficeCostMonth from "./components/expense-history/daily-cost/monthlyexpense";
import OfficeCosts from "./components/expense-history/daily-cost/monthlyexpenseByMonth";
import Employee from "./components/expense-history/employee/employee";
import EmployeeMonth from "./components/expense-history/employee/monthlyexpense";
import EmployeeExpenses from "./components/expense-history/employee/monthlyexpenseByMonth";
import Fund from "./components/expense-history/fund/fund.js";
import CashSummary from "./components/expense-history/cash-summary/monthlyexpense";
import CashSummaryByMonth from "./components/expense-history/cash-summary/monthlyexpenseByMonth";
import CashSummaryByDate from "./components/expense-history/cash-summary/daily-expense";
import MonthlyExpenseByMonth from "./components/expense-history/monthly-expense/monthlyexpenseByMonth";
import LoanMonthly from "./components/expense-history/loan/monthlyexpenseByMonth";
import Screenshots from "./components/products/physical/screenshots.js";

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentAdmin: null,
    };
  }

  setCurrentAdmin = (adminObj) => {
    this.setState({ currentAdmin: adminObj });
    console.log(this.state.currentAdmin);
  };

  render() {
    const { currentAdmin } = this.state;
    return (
      <Provider store={store}>
        <BrowserRouter basename={"/"}>
          <ScrollContext>
            <Switch>
              <Route
                exact
                path={`${process.env.PUBLIC_URL}/`}
                component={() => (
                  <Login
                    setCurrentAdmin={this.setCurrentAdmin}
                    currentAdmin={currentAdmin}
                  />
                )}
              />
              {/* <Route exact path={`${process.env.PUBLIC_URL}/auth/login`} component={Login} /> */}

              <App>
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/dashboard`}
                  component={Dashboard}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/messages`}
                  component={Message}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/searched-order/:orderId`}
                  component={SearchedOrder}
                />

                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/products/physical/all-products`}
                  component={AllProducts}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/coupons/physical/all-coupons`}
                  component={AllCoupons}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/products/physical/brands`}
                  component={Brands}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/products/physical/categories`}
                  component={Categories}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/products/physical/categories/:id`}
                  component={AllProductsByCategory}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/products/physical/brands/:id`}
                  component={AllProductsByBrand}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/products/physical/campaigns`}
                  component={Campaigns}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/products/physical/announcements`}
                  component={Announcements}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/products/physical/categories-2/homescreen`}
                  component={HomeCategories}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/products/physical/banners`}
                  component={Banners}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/products/physical/shop-by-concern`}
                  component={ShopByConcern}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/products/physical/attributes`}
                  component={Attributes}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/products/physical/reviews`}
                  component={Reviews}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/products/physical/reviews-screenshot`}
                  component={Screenshots}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/products/physical/attributes/:id`}
                  component={AttributeTerms}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/products/physical/sub-category`}
                  component={() =>
                    currentAdmin ? <Sub_category /> : <Redirect to="/" />
                  }
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/products/physical/product-list`}
                  component={() =>
                    currentAdmin ? <Product_list /> : <Redirect to="/" />
                  }
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/products/physical/product-detail`}
                  component={() =>
                    currentAdmin ? <Product_detail /> : <Redirect to="/" />
                  }
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/products/physical/add-product`}
                  component={() => <Add_product />}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/products/physical/add-product/:id`}
                  component={Edit_product}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/products/physical/add-aliexpress-product`}
                  component={() => <Add_Aliexpress_product />}
                />
                {/* <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/products/physical/add-product/:id`}
                  component={(props) => <Update_product {...props} />}
                /> */}

                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/sales/orders`}
                  component={Orders}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/sales/orders/update-status/:orderId`}
                  component={(props) => <UpdateOrder {...props} />}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/sales/order_pending`}
                  component={(props) => <PendingOrders {...props} />}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/sales/payment_approved`}
                  component={(props) => <PaymentApproved {...props} />}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/sales/ordered`}
                  component={(props) => <Ordered {...props} />}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/sales/china_warehouse`}
                  component={(props) => <ChinaWarehouse {...props} />}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/sales/in-shipping`}
                  component={(props) => <InShipment {...props} />}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/sales/in_stock`}
                  component={(props) => <InStock {...props} />}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/sales/delivered`}
                  component={(props) => <Delivered {...props} />}
                />

                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/payments/unVerified`}
                  component={UnverifiedPayments}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/payments/verified`}
                  component={VerifiedPayments}
                />

                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/pages/product-to-order`}
                  component={ProductToOrder}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/pages/create-page`}
                  component={() =>
                    currentAdmin ? <Create_page /> : <Redirect to="/" />
                  }
                />

                {/* <Route exact epath={`${process.env.PUBLIC_URL}/media`} component={Media} /> */}

                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/menus/list-menu`}
                  component={() =>
                    currentAdmin ? <List_menu /> : <Redirect to="/" />
                  }
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/menus/create-menu`}
                  component={() =>
                    currentAdmin ? <Create_menu /> : <Redirect to="/" />
                  }
                />

                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/users/list-user`}
                  component={List_user}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/users/list-user/:userId`}
                  component={DetailUser}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/users/create-user`}
                  component={() =>
                    currentAdmin ? <Create_user /> : <Redirect to="/" />
                  }
                />

                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/suppliers/list_suppliers`}
                  component={() => <ListSuppliers />}
                />

                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/localization/currency-rates`}
                  component={Currency}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/localization/shipping-charges`}
                  component={Taxes}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/localization/shipping-charge/add-product`}
                  component={Add_Product_Tax}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/localization/shipping-charges/add-product/:id`}
                  component={Update_Product_Tax}
                />

                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/settings/profile`}
                  component={Profile}
                />

                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/product-request/:bookingStatus`}
                  component={New}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/shipment-request/:bookingStatus`}
                  component={NewShipmentRequest}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/orders/:orderStatus`}
                  component={OrdersApi}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/payment-request/pending`}
                  component={PaymentRequest}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/payment-request-order/pending`}
                  component={PaymentRequestOrder}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/invoice/:orderId`}
                  component={Invoice}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/data-table`}
                  component={() =>
                    currentAdmin ? <Datatable /> : <Redirect to="/" />
                  }
                />

                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/expense-history`}
                  component={MonthlyExpense}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/expense-history/:month`}
                  component={MonthlyExpenseByMonth}
                />

                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/salary`}
                  component={SalaryMonth}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/salary/:month`}
                  component={Salaries}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/daily-expense`}
                  component={DailyExpense}
                />

                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/refunds`}
                  component={RefundsMonth}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/refunds/:month`}
                  component={Refunds}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/buy-products`}
                  component={CommisionMonth}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/buy-products/:month`}
                  component={Commisions}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/order`}
                  component={OrderMonth}
                />

                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/order/:month`}
                  component={Order}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/boosting`}
                  component={BoostingMonth}
                />

                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/boosting/:month`}
                  component={Boostings}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/shipping`}
                  component={ShippingMonth}
                />

                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/shipping/:month`}
                  component={Shippings}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/lot-transport`}
                  component={LotTransportMonth}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/lot-transport/:month`}
                  component={OfficeCostsLotTransport}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/loans`}
                  component={Loans}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/loans/:month`}
                  component={LoanMonthly}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/loans-by-customers`}
                  component={Customers}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/loans-by-customers2/pdf`}
                  component={OnlyInvoiceToPrint2}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/loans-by-customers2`}
                  component={Customers2}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/loans-by-customers/:customer`}
                  component={SingleCustomer}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/office`}
                  component={Office}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/office/:name`}
                  component={OfficeMonth}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/singleOffice/office/:month`}
                  component={OfficeExpenses}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/monthly-installment`}
                  component={CustomersInstallments}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/installments-by-customers/:customer`}
                  component={SingleCustomerInstallments}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/approve-expense`}
                  component={ApproveExpense}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/approve-expense/:date`}
                  component={ExpenseByDay}
                />

                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/cnf`}
                  component={Cnf}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/cnf/:name`}
                  component={CnfExpenses}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expenses/cnf/:month`}
                  component={CnfMonth}
                />

                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/daily-cost`}
                  component={OfficeCostMonth}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/daily-cost/:month`}
                  component={OfficeCosts}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/employee`}
                  component={Employee}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/employee/:name`}
                  component={EmployeeMonth}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/employees/:month`}
                  component={EmployeeExpenses}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/expense/fund`}
                  component={Fund}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/cash-summary`}
                  component={CashSummary}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/cash-summary/:month`}
                  component={CashSummaryByMonth}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/cash-summary-by-day/:date`}
                  component={CashSummaryByDate}
                />
              </App>
            </Switch>
          </ScrollContext>
        </BrowserRouter>
      </Provider>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById("root"));
