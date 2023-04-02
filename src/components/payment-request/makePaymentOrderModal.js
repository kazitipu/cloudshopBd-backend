import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
  makePaymentRedux,
  updatePaymentRequestOrderStatusRedux,
} from "../../actions/index";
import "./makePaymentModal.css";
import { Link } from "react-router-dom";

import { CircleLoader } from "react-spinners";
import Currency from "../localization/currency";
class MakePaymentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      termsAndCondition: false,
      loader: false,
    };
  }

  handleSubmit = async () => {
    const { userObj, admin, paymentRequestObj, rechargeUser, payableOrders } =
      this.props;

    // admin payment korle admin jabe, user payment korle user jabe
    this.setState({
      loader: true,
    });

    await this.props.updatePaymentRequestOrderStatusRedux({
      ...paymentRequestObj,
      status: "approved",
    });
    this.setState({
      loader: false,
    });
    toast.success("Payment is successful");

    this.props.startToggleModal(null, []);
  };
  handleChange = (event) => {
    const { value, name } = event.target;

    this.setState({ [name]: value });
  };

  render = () => {
    const { payableOrders, currency } = this.props;

    console.log(payableOrders);
    let total = 0;

    payableOrders.forEach((order) => {
      return (total += order.orderTotal);
    });

    console.log(total);
    return (
      <>
        <div
          className={
            this.props.toggleModal
              ? "modal fade show"
              : "modal fade show visible-modal"
          }
          id="request_make_payment_popup"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered request_popup"
            role="document"
          >
            <div
              className="modal-content login-modal order-details-modal-container"
              style={{ backgroundColor: "white" }}
            >
              <div className="modal-body p-0">
                <section className="pos-rel bg-light-gray">
                  <div className="container-fluid p-3 order-details-main-container">
                    <a
                      id="modal-close-icon-payment-modal"
                      onClick={() => this.props.startToggleModal(null, [])}
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <i
                        className="icofont-close-line"
                        style={{ color: "black", fontWeight: "bolder" }}
                      ></i>
                    </a>
                    <div className="d-lg-flex justify-content-end no-gutters mb-spacer-md">
                      <div className="col">
                        <div className="order-details-container">
                          <h2 className="h2-xl mb-2 fw-6 pb-2 order-details-header">
                            Order Details
                          </h2>
                          <div style={{ marginTop: "20px" }}></div>
                          <div className="table-responsive-md">
                            <table className="table">
                              <thead style={{ position: "sticky", top: -3 }}>
                                <tr className="table-light">
                                  <th scope="col">Order Id</th>
                                  <th scope="col">Product</th>
                                  <th
                                    scope="col"
                                    style={{ textAlign: "center" }}
                                  >
                                    Details
                                  </th>
                                  <th scope="col">Quantity</th>
                                  <th scope="col">Unit Price</th>

                                  <th scope="col">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {payableOrders.length > 0 &&
                                  payableOrders.map((order) =>
                                    order.items.map((item) =>
                                      item.skus.map((sku) => {
                                        return (
                                          <tr
                                            className="table-light"
                                            key={sku.sku_id}
                                          >
                                            <th scope="row">{order.orderId}</th>
                                            <td>
                                              <img
                                                src={item.picture}
                                                style={{
                                                  height: 60,
                                                  width: 60,
                                                }}
                                              />
                                            </td>
                                            <td>
                                              color:{sku.color}, size:{sku.size}
                                            </td>
                                            <td>{sku.totalQuantity}</td>
                                            <td>
                                              {parseInt(
                                                parseFloat(sku.price) *
                                                  parseFloat(currency.taka)
                                              )}
                                              Tk
                                            </td>
                                            <td>
                                              {parseInt(
                                                parseFloat(sku.price) *
                                                  parseFloat(currency.taka)
                                              ) * sku.totalQuantity}
                                              Tk
                                            </td>
                                          </tr>
                                        );
                                      })
                                    )
                                  )}

                                <tr className="table-light">
                                  <th scope="row"></th>
                                  <td></td>
                                  <td className="result-td"></td>
                                  <td className="result-td"></td>
                                  <td className="result-td">Grand Total</td>
                                  <td className="result-td">{total}Tk</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div
                            style={{ display: "flex", flexDirectioin: "row" }}
                          >
                            <input
                              className="terms-condition-checkbox"
                              style={{ marginLeft: 10 }}
                              type="checkbox"
                              name="termsAndCondition"
                              checked={this.state.termsAndCondition}
                              onChange={(e) =>
                                this.setState({
                                  termsAndCondition:
                                    !this.state.termsAndCondition,
                                })
                              }
                            ></input>
                            <div className="agree-terms-condition">
                              I checked and paying the invoices.
                              <span
                                style={{ color: "#ff8084", cursor: "pointer" }}
                              >
                                &nbsp; For any kind of fault
                              </span>
                              &nbsp;
                              <span
                                style={{ color: "#ff8084", cursor: "pointer" }}
                              >
                                I will be responsible.
                              </span>
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "flex-end",
                            }}
                          >
                            {this.state.termsAndCondition && (
                              <div className="procced-to-checkout">
                                <button
                                  onClick={() => {
                                    this.handleSubmit();
                                  }}
                                  className="mt-3 btn btn-secondary "
                                  data-dismiss="modal"
                                  data-toggle="modal"
                                  data-target="#request_payment_popup"
                                  style={{ minWidth: 120, minHeight: 40 }}
                                >
                                  {!this.state.loader && <>Approve Payment</>}
                                  <CircleLoader
                                    loading={this.state.loader}
                                    color="white"
                                    size={15}
                                  />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
}
const mapStateToProps = (state, ownProps) => {
  console.log(ownProps.paymentRequestObj);
  return {
    allUsers: state.users.users,
    rechargeUser: ownProps.paymentRequestObj
      ? state.users.users.find(
          (user) => user.uid === ownProps.paymentRequestObj.userId
        )
      : null,
    admin: state.admins.currentAdmin,
    currency: state.users.currency,
  };
};
export default withRouter(
  connect(mapStateToProps, {
    makePaymentRedux,
    updatePaymentRequestOrderStatusRedux,
  })(MakePaymentModal)
);
