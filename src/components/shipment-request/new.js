import React, { Component, Fragment } from "react";
import Breadcrumb from "../common/breadcrumb";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Datatable from "./datatable.jsx";
import { getAllShipmentRequestsRedux } from "../../actions/index";
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
      singleRequest: null,
    };
  }

  componentDidMount = async () => {
    if (this.props.match.params.bookingStatus === "new") {
      this.props.getAllShipmentRequestsRedux("Pending");
    } else if (this.props.match.params.bookingStatus === "rates-given") {
      this.props.getAllShipmentRequestsRedux("Rates Provided");
    } else if (
      this.props.match.params.bookingStatus === "received-in-warehouse"
    ) {
      this.props.getAllShipmentRequestsRedux("Received in Warehouse");
    } else if (this.props.match.params.bookingStatus === "delivered") {
      this.props.getAllShipmentRequestsRedux("Delivered");
    }
  };

  componentWillReceiveProps = (nextProps) => {
    if (
      this.props.match.params.bookingStatus !==
      nextProps.match.params.bookingStatus
    ) {
      if (nextProps.match.params.bookingStatus === "new") {
        this.props.getAllShipmentRequestsRedux("Pending");
      } else if (nextProps.match.params.bookingStatus === "rates-given") {
        this.props.getAllShipmentRequestsRedux("Rates Provided");
      } else if (
        nextProps.match.params.bookingStatus === "received-in-warehouse"
      ) {
        this.props.getAllShipmentRequestsRedux("Received in Warehouse");
      } else if (nextProps.match.params.bookingStatus === "delivered") {
        this.props.getAllShipmentRequestsRedux("Delivered");
      } else if (nextProps.match.params.bookingStatus === "paid") {
        this.props.getAllShipmentRequestsRedux("Paid");
      }
    }
  };

  startToggleModal = async (requestObj) => {
    if (requestObj == null) {
      this.setState({
        toggleModal: !this.state.toggleModal,
        singleRequest: null,
      });
    } else {
      console.log(requestObj);
      this.setState({
        toggleModal: !this.state.toggleModal,
        singleRequest: requestObj,
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
          singleRequest={this.state.singleRequest}
        />

        <Breadcrumb
          title={this.props.match.params.bookingStatus}
          parent="Shipment Requests"
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
                  <h5>
                    {this.props.match.params.bookingStatus} Shipment Requests
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
                            placeholder="Search Shipment Request"
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
                          ? this.props.allShipmentRequests
                          : this.props.allShipmentRequests.filter(
                              (productObj) =>
                                productObj.date.includes(
                                  this.state.searchFor.toLowerCase()
                                ) ||
                                (productObj.trackingNo &&
                                  productObj.trackingNo
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
    allShipmentRequests: state.productRequests.shipmentRequests,
  };
};

export default connect(mapStateToProps, { getAllShipmentRequestsRedux })(New);
