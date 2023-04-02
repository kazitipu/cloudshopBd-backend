import React, { Component, Fragment } from "react";
import Breadcrumb from "../common/breadcrumb";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Datatable from "./datatable.jsx";
import { getAllOrdersApiRedux } from "../../actions/index";
import { Link } from "react-router-dom";
import UpdateRequestModal from "./updateRequestModal";

import { connect } from "react-redux";
import { Search } from "react-feather";

export class New extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      searchFor: "",
      toggleModal: true,
      toggleDeleteModal: true,
      order: null,
    };
  }

  componentDidMount = async () => {
    if (this.props.match.params.orderStatus === "new") {
      this.props.getAllOrdersApiRedux("pending");
    } else if (this.props.match.params.orderStatus === "paid") {
      this.props.getAllOrdersApiRedux("approved");
    } else if (this.props.match.params.orderStatus === "ordered") {
      this.props.getAllOrdersApiRedux("ordered");
    } else if (this.props.match.params.orderStatus === "delivered") {
      this.props.getAllOrdersApiRedux("delivered");
    }
  };

  componentWillReceiveProps = (nextProps) => {
    if (
      this.props.match.params.orderStatus !== nextProps.match.params.orderStatus
    ) {
      if (nextProps.match.params.orderStatus === "new") {
        this.props.getAllOrdersApiRedux("pending");
      } else if (nextProps.match.params.orderStatus === "paid") {
        this.props.getAllOrdersApiRedux("approved");
      } else if (nextProps.match.params.orderStatus === "ordered") {
        this.props.getAllOrdersApiRedux("ordered");
      } else if (nextProps.match.params.orderStatus === "delivered") {
        this.props.getAllOrdersApiRedux("delivered");
      }
    }
  };

  startToggleModal = async (order) => {
    if (order == null) {
      this.setState({
        toggleModal: !this.state.toggleModal,
        order: null,
      });
    } else {
      this.setState({
        toggleModal: !this.state.toggleModal,
        order,
      });
    }
  };

  handleSearchBarChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    const { open } = this.state;
    console.log(this.props);
    return (
      <Fragment>
        <UpdateRequestModal
          toggleModal={this.state.toggleModal}
          startToggleModal={this.startToggleModal}
          order={this.state.order}
        />

        <Breadcrumb
          title={this.props.match.params.orderStatus}
          parent="1688/tabao Orders"
        />
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
                  <h5>{this.props.match.params.orderStatus} Orders</h5>
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
                            placeholder="Search Orders"
                            style={{ paddingLeft: 10 }}
                            onChange={this.handleSearchBarChange}
                          />
                          <span
                          // className="d-sm-none mobile-search"
                          // onClick={() => this.handleSearchClick()}
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
                      startDeleteToggleModal={this.startDeleteToggleModal}
                      history={this.props.history}
                      multiSelectOption={false}
                      myData={
                        !this.state.searchFor
                          ? this.props.ordersApi
                          : this.props.ordersApi.filter(
                              (order) =>
                                (order.orderedDate &&
                                  order.orderedDate.includes(
                                    this.state.searchFor.toLowerCase()
                                  )) ||
                                (order.trackingNo &&
                                  order.trackingNo
                                    .toLowerCase()
                                    .includes(
                                      this.state.searchFor.toLowerCase()
                                    )) ||
                                (order.orderId &&
                                  order.orderId
                                    .toString()
                                    .includes(this.state.searchFor)) ||
                                (order.orderNumber &&
                                  order.orderNumber
                                    .toLowerCase()
                                    .includes(
                                      this.state.searchFor.toLowerCase()
                                    ))
                            )
                      }
                      pageSize={50}
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
    ordersApi: state.orders.ordersApi,
  };
};

export default connect(mapStateToProps, { getAllOrdersApiRedux })(New);
