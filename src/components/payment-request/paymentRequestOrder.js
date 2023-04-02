import React, { Component, Fragment } from "react";
import Breadcrumb from "../common/breadcrumb";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Datatable from "./paymentRequestOrderDatatable";
import { getAllPaymentRequestOrderRedux } from "../../actions/index";
import { Link } from "react-router-dom";
import MakePaymentOrderModal from "./makePaymentOrderModal";
import { connect } from "react-redux";
import { Search } from "react-feather";

class PaymentRequestOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFor: "",
      open: false,
      toggleModal: true,
      payableOrders: [],
      paymentRequest: null,
    };
  }

  componentDidMount = async () => {
    this.props.getAllPaymentRequestOrderRedux();
  };

  startToggleModal = async (paymentRequest, payableOrders) => {
    console.log(payableOrders);
    console.log(payableOrders.length);
    if (payableOrders.length == 0) {
      this.setState({
        toggleModal: true,
        payableOrders: [],
        paymentRequest: null,
      });
    } else {
      this.setState({
        toggleModal: false,
        payableOrders: payableOrders,
        paymentRequest,
      });
    }
  };

  handleSearchBarChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  getPaymentRequestArray = () => {
    if (!this.state.searchFor) {
      return this.props.allPaymentRequests;
    }

    let filterByStatus = this.props.allPaymentRequests.filter(
      (paymentRequest) =>
        paymentRequest.status
          .toLowerCase()
          .includes(this.state.searchFor.toLowerCase())
    );
    let filterByMethod = this.props.allPaymentRequests.filter(
      (paymentRequest) =>
        paymentRequest.method
          .toLowerCase()
          .includes(this.state.searchFor.toLowerCase())
    );
    let filterByDate = this.props.allPaymentRequests.filter((paymentRequest) =>
      paymentRequest.date.includes(this.state.searchFor)
    );
    return [...filterByStatus, ...filterByMethod, ...filterByDate];
  };

  render() {
    const { open } = this.state;

    return (
      <Fragment>
        <MakePaymentOrderModal
          toggleModal={this.state.toggleModal}
          startToggleModal={this.startToggleModal}
          payableOrders={this.state.payableOrders}
          paymentRequestObj={this.state.paymentRequest}
        />
        <Breadcrumb title="Payment Request" parent="Payment" />
        {/* <!-- Container-fluid starts--> */}
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div
                  className="card-header"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <h5>
                    {" "}
                    <i
                      className="fas fa-money-check-alt"
                      style={{
                        fontSize: "180%",
                        marginRight: "5px",
                        marginTop: "5px",
                        color: "#ff8084",
                      }}
                    ></i>
                    Payment Request
                  </h5>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    {" "}
                    <li
                      style={{
                        border: "1px solid gainsboro",
                        borderRadius: "5rem",
                        padding: "0px 20px",
                        background: "whitesmoke",
                        marginRight: "20px",
                      }}
                    >
                      <form
                        className="form-inline search-form"
                        onSubmit={this.handleSubmit}
                      >
                        <div
                          // className="form-group"
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around",
                          }}
                        >
                          <input
                            className={
                              "form-control-plaintext " +
                              (this.state.searchbar ? "open" : "")
                            }
                            name="searchFor"
                            value={this.state.searchFor}
                            type="search"
                            placeholder="Search Payment Request"
                            onChange={this.handleSearchBarChange}
                          />
                          <span
                          // className="d-sm-none mobile-search"
                          >
                            <Search
                              style={{
                                marginTop: "5px",
                                borderLeft: "1px solid gainsboro",
                                paddingLeft: "7px",
                                color: "gray",
                              }}
                            />
                          </span>
                        </div>
                      </form>
                    </li>
                    <li></li>
                  </div>
                </div>
                <div className="card-body">
                  <div className="clearfix"></div>
                  <div id="basicScenario" className="product-physical">
                    <Datatable
                      startToggleModal={this.startToggleModal}
                      history={this.props.history}
                      multiSelectOption={false}
                      myData={this.getPaymentRequestArray()}
                      pageSize={100}
                      pagination={true}
                      class="-striped -highlight"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
        {/* <!-- Container-fluid Ends--> */}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allPaymentRequests: state.payments.paymentRequestOrderArray,
    allUser: state.users.users,
  };
};

export default connect(mapStateToProps, {
  getAllPaymentRequestOrderRedux,
})(PaymentRequestOrder);
