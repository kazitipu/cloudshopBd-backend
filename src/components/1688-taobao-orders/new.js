import React, { Component, Fragment } from "react";
import Breadcrumb from "../common/breadcrumb";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import { uploadImageRechargeRequest } from "../../firebase/firebase.utils";
import { getAllOrdersRedux, updateOrderRedux } from "../../actions/index";
import { Search } from "react-feather";
import { sendNotifications } from "../../firebase/fcmRestApi";
export class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      toggleModal: true,
      singleLot: null,
      expenseObj: null,
      loader: false,
      type: "upload",
      checkedValues: [],
      checkedValues2: [],
      id: "",
      name: "",
      quantity: "",
      amount: "",
      description: "",
      searchFor: "",
      orderObj: null,
      loading: false,
      imageUrl: "",
      file: "",
      type: "",
      customer: "",
      customerUid: "",
      cursor: -1,
      shippingCost: "",
      agentCost: "",
      status: "",
      warehouse: "",
      orderStatus: "",
    };
  }

  componentDidMount = async () => {
    const { orderStatus } = this.props.match.params;
    const { getAllOrdersRedux } = this.props;
    console.log(orderStatus);
    getAllOrdersRedux(orderStatus);
  };
  UNSAFE_componentWillReceiveProps = async (nextProps) => {
    const { orderStatus } = this.props.match.params;
    const orderStatus2 = nextProps.match.params.orderStatus;
    if (orderStatus !== orderStatus2) {
      const { getAllOrdersRedux } = this.props;
      console.log(orderStatus);
      getAllOrdersRedux(orderStatus2);
    }
  };

  componentWillReceiveProps = async (nextProps) => {
    // const { status } = this.props.match.params;
    // const status2 = nextProps.match.params.status;
    // const { getAllP2PRedux, getAllDeliveryWarehoueProductsp2pRedux } =
    //   this.props;
    // if (status !== status2) {
    //   this.setState({
    //     checkedValues: [],
    //     checkedValues2: [],
    //   });
    //   if (status2.includes("warehouse")) {
    //     await getAllDeliveryWarehoueProductsp2pRedux(status2);
    //   } else {
    //     await getAllP2PRedux(status2);
    //   }
    // }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleSearchBarChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  _handleImgChange = async (e, i) => {
    e.preventDefault();
    const { currentAdmin } = this.props;

    let reader = new FileReader();
    let file = e.target.files[0];
    const { imageUrl } = this.state;

    reader.onloadend = () => {
      // imageUrl = reader.result;
      this.setState({
        file: file,
        imageUrl,
      });
    };
    if (file) {
      this.setState({ loading: true });
      reader.readAsDataURL(file);
      const imgUrl = await uploadImageRechargeRequest(file);

      this.setState({
        imageUrl: imgUrl,
      });

      this.setState({ loading: false });
    }
  };

  clickActive = (event) => {
    document.querySelector(".nav-link").classList.remove("show");
    event.target.classList.add("show");
  };

  createNotification = (order) => {
    let msg;
    console.log(order);

    if (order.orderStatus === "Processing") {
      msg = {
        title: "Order Processing",
        body: `We are processing your order.One of our team member is assigned for your order. OrderId:-${order.id}.`,
      };
      return msg;
    }
    if (order.orderStatus === "Confirmed") {
      msg = {
        title: "Order Confirmed",
        body: `Your order is confirmed. OrderId:-${order.id}.`,
      };
      return msg;
    }
    if (order.orderStatus === "Packing") {
      msg = {
        title: "Reday for delivery",
        body: `We are packaging your order. OrderId:-${order.id}.`,
      };
      return msg;
    }
    if (order.orderStatus === "Delivered") {
      msg = {
        title: "Order delivered successfully",
        body: `Your order is delivered. OrderId:-${order.id}. Thank you`,
      };
      return msg;
    }
    if (order.orderStatus === "Cancelled") {
      msg = {
        title: "Sorry. Order cancelled",
        body: `Your order is cancelled. OrderId:-${order.id}.Contact our customer service to get detail info.Thanks`,
      };
      return msg;
    }
  };

  handleSubmit = async () => {
    console.log("Handle submit is getting called!");
    let orderObj = {
      ...this.state.orderObj,
      orderStatus: this.state.orderStatus,
      [`${this.state.orderStatus.toLowerCase()}Date`]: new Date()
        .getTime()
        .toString(),
      orderStatusScore:
        this.state.orderStatus == "Processing"
          ? 2
          : this.state.orderStatus == "Confirmed"
          ? 3
          : this.state.orderStatus == "Packing"
          ? 4
          : this.state.orderStatus == "Delivered"
          ? 5
          : 0,
    };

    await this.props.updateOrderRedux(orderObj);
    const msg = this.createNotification(orderObj);
    const message = {
      title: msg.title,
      body: msg.body,
    };
    if (
      orderObj &&
      orderObj.currentUser &&
      orderObj.currentUser.deviceToken &&
      orderObj.currentUser.deviceToken.length > 0
    ) {
      orderObj.currentUser.deviceToken.map((token) => {
        console.log(token);
        sendNotifications(token, message);
      });
    }
    this.setState({
      name: "",
      quantity: "",
      amount: "",
      description: "",
      orderObj: null,
      loading: false,
      imageUrl: "",
      file: "",
      shippingCost: "",
      agentCost: "",
      status: "",
      warehouse: "",
      orderStatus: "",
    });
  };
  handleReceive = async () => {
    let date = new Date();
    if (!this.state.warehouse) {
      alert("Please select an warehouse first.");
    }
    let bookings = this.props.p2p.filter((product) =>
      this.state.checkedValues.includes(product.id)
    );

    for (let i = 0; i < bookings.length; i++) {
      await this.props.updateOrderRedux({
        ...bookings[i],
        status: this.state.warehouse,
        toWarehouse: this.state.warehouse,
        toWarehouseReceiveDate: date.toLocaleDateString("en-GB"),
        deliveryWarehouse: true,
      });
    }
    this.setState({
      warehouse: "",
      checkedValues: [],
    });
  };
  handleDelivery = async () => {
    let date = new Date();
    let bookings = this.props.p2p.filter((product) =>
      this.state.checkedValues.includes(product.id)
    );

    for (let i = 0; i < bookings.length; i++) {
      await this.props.updateOrderRedux({
        ...bookings[i],
        status: "delivered",
        deliveryDate: date.toLocaleDateString("en-GB"),
      });
    }
    this.setState({
      warehouse: "",
      checkedValues: [],
    });
  };

  getUserName = (agentId) => {
    const { users } = this.props;
    if (users.length > 0) {
      const agentName = users.find((user) => user.uid === agentId);
      if (agentName) {
        return agentName.displayName;
      } else {
        return "";
      }
    } else {
      return "";
    }
  };

  selectRow = (e, i) => {
    if (!e.target.checked) {
      this.setState({
        checkedValues: this.state.checkedValues.filter((item, j) => i !== item),
      });
    } else {
      this.setState({
        checkedValues: [...this.state.checkedValues, i],
      });
    }
  };
  selectRow2 = (e, i) => {
    if (!e.target.checked) {
      this.setState({
        checkedValues2: this.state.checkedValues2.filter(
          (item, j) => i !== item
        ),
      });
    } else {
      this.setState({
        checkedValues2: [...this.state.checkedValues2, i],
      });
    }
  };

  getMonthName = () => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const d = new Date();
    return `${monthNames[d.getMonth()]},${d.getFullYear()}`;
  };

  singleProductTotal = (product) => {
    let total = parseInt(this.getPrice2(product)) * product.quantity;
    return total;
  };

  getPrice2 = (product) => {
    if (product.selectedVariation.id) {
      if (product.selectedVariation.salePrice == 0) {
        return product.selectedVariation.price;
      } else {
        return product.selectedVariation.salePrice;
      }
    } else {
      if (product.product) {
        if (product.product.salePrice == 0) {
          return product.product.price;
        } else {
          return product.product.salePrice;
        }
      } else {
        return 0;
      }
    }
  };
  getPrice3 = (product) => {
    if (product.selectedVariation.id) {
      if (product.selectedVariation.salePrice == 0) {
        return "";
      } else {
        return `৳ ${product.selectedVariation.price}`;
      }
    } else {
      if (product.product) {
        if (product.product.salePrice == 0) {
          return "";
        } else {
          return `৳ ${product.product.price}`;
        }
      } else {
        return 0;
      }
    }
  };

  handleCashOut = async (p2pArray) => {
    const { currentAdmin } = this.props;
    let date = new Date();
    if (p2pArray.length == 0) {
      alert("Please select at least one p2p agent to pay");
      return;
    }
    for (let i = 0; i < p2pArray.length; i++) {
      const p2pObj = p2pArray[i];
      console.log(date.getTime().toString());
      console.log(p2pObj);
      await this.props.handleP2pAgentPayRedux({
        ...p2pObj,
        paymentId: `${date.getTime().toString()}${i}`,
        month: this.getMonthName(),
        date: date.toLocaleDateString("en-GB"),
        receiveBy: currentAdmin.name,
      });
    }
    this.setState({
      checkedValues2: [],
    });
  };

  render() {
    const { orderObj } = this.state;
    const { orders } = this.props;
    const { orderStatus } = this.props.match.params;
    let renderableOrders = orders;
    if (this.state.searchFor) {
      renderableOrders = renderableOrders.filter(
        (order) =>
          (order &&
            order.id
              .toLowerCase()
              .includes(this.state.searchFor.toLowerCase())) ||
          order.currentUser.displayName
            .toLowerCase()
            .includes(this.state.searchFor.toLowerCase())
      );
    }
    let deliveryAddress = null;
    if (
      orderObj &&
      orderObj.currentUser &&
      orderObj.currentUser.address &&
      orderObj.currentUser.address.length > 0
    ) {
      deliveryAddress = orderObj.currentUser.address.find(
        (address) => address.defaultShipping
      );
    }
    return (
      <Fragment>
        <Breadcrumb title={orderStatus} parent="Orders" />
        {/* <!-- Container-fluid starts--> */}
        <div className="container-fluid">
          <div className="row" style={{ justifyContent: "center" }}>
            <div className="col-sm-12">
              <div className="card">
                <div
                  className="card-header"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottom: "1px solid gainsboro",
                  }}
                >
                  <h5>
                    <i
                      className="icofont-money"
                      style={{
                        fontSize: "130%",
                        marginRight: "5px",
                        color: "#00254c",
                      }}
                    ></i>
                    {orderStatus}
                  </h5>
                  <li
                    style={{
                      border: "1px solid gainsboro",
                      borderRadius: "5rem",
                      padding: "0px 20px",
                      background: "whitesmoke",
                      marginRight: "20px",
                    }}
                  >
                    <form className="form-inline search-form">
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
                          placeholder="Search Order"
                          onChange={this.handleSearchBarChange}
                        />
                        <span>
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
                </div>
                <div className="card-body">
                  <div className="clearfix"></div>
                  <div id="basicScenario" className="product-physical">
                    <table className="table table-bordered table-striped table-hover">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            style={{
                              padding: "30px 15px",
                              color: "white",
                              backgroundColor: "#00254c",
                            }}
                          >
                            #
                          </th>
                          <th
                            scope="col"
                            style={{
                              padding: "30px 15px",
                              color: "white",
                              backgroundColor: "#00254c",
                            }}
                          >
                            Order Id
                          </th>
                          <th
                            scope="col"
                            style={{
                              padding: "30px 15px",
                              color: "white",
                              backgroundColor: "#00254c",
                            }}
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            style={{
                              padding: "30px 15px",
                              color: "white",
                              backgroundColor: "#00254c",
                            }}
                          >
                            Customer
                          </th>
                          <th
                            scope="col"
                            style={{
                              padding: "30px 15px",
                              color: "white",
                              backgroundColor: "#00254c",
                            }}
                          >
                            Products
                          </th>

                          <th
                            scope="col"
                            style={{
                              padding: "30px 15px",
                              color: "white",
                              backgroundColor: "#00254c",
                            }}
                          >
                            Order Total
                          </th>

                          <th
                            scope="col"
                            style={{
                              padding: "30px 15px",
                              color: "white",
                              backgroundColor: "#00254c",
                            }}
                          >
                            Order Status
                          </th>

                          <th
                            scope="col"
                            style={{
                              padding: "30px 15px",
                              color: "white",
                              backgroundColor: "#00254c",
                            }}
                          >
                            <div
                              data-toggle="modal"
                              data-target="#receiveModal"
                            >
                              Action
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {renderableOrders.map((order, index) => (
                          <tr key={index}>
                            <th
                              scope="row"
                              data-toggle="modal"
                              data-target="#detailInfoModal"
                              onClick={() => {
                                this.setState({
                                  orderObj: order,
                                });
                              }}
                            >
                              {index + 1}
                            </th>
                            <td
                              scope="row"
                              data-toggle="modal"
                              data-target="#detailInfoModal"
                              onClick={() => {
                                this.setState({
                                  orderObj: order,
                                });
                              }}
                            >
                              {order.id}
                            </td>
                            <td
                              data-toggle="modal"
                              data-target="#detailInfoModal"
                              onClick={() => {
                                this.setState({
                                  orderObj: order,
                                });
                              }}
                            >
                              {new Date(
                                Number(order.date)
                              ).toLocaleDateString()}
                            </td>
                            <td
                              data-toggle="modal"
                              data-target="#detailInfoModal"
                              onClick={() => {
                                this.setState({
                                  orderObj: order,
                                });
                              }}
                            >
                              {order.currentUser.displayName}
                            </td>

                            <td
                              data-toggle="modal"
                              data-target="#detailInfoModal"
                              onClick={() => {
                                this.setState({
                                  orderObj: order,
                                });
                              }}
                            >
                              <div
                                style={{
                                  color: "white",
                                  padding: "3px 10px",
                                  borderRadius: 5,
                                  backgroundColor: "cadetblue",
                                  textAlign: "center",
                                  cursor: "pointer",
                                  display: "inline-block",
                                  alignItems: "center",
                                }}
                              >
                                View
                              </div>
                            </td>

                            <td
                              data-toggle="modal"
                              data-target="#detailInfoModal"
                              onClick={() => {
                                this.setState({
                                  orderObj: order,
                                });
                              }}
                            >
                              ৳{" "}
                              {order.subTotal +
                                order.deliveryCharge -
                                order.discountApplied -
                                (order.couponApplied
                                  ? order.couponApplied.discount
                                  : 0)}
                            </td>

                            <td
                              data-toggle="modal"
                              data-target="#detailInfoModal"
                              onClick={() => {
                                this.setState({
                                  orderObj: order,
                                });
                              }}
                            >
                              <div
                                style={{
                                  color: "white",
                                  padding: "3px 10px",
                                  borderRadius: 5,
                                  backgroundColor:
                                    order.orderStatus == "Processing"
                                      ? "#0f0fd9"
                                      : order.orderStatus == "Confirmed"
                                      ? "orange"
                                      : order.orderStatus == "Packing"
                                      ? "darkorange"
                                      : order.orderStatus == "Delivered"
                                      ? "green"
                                      : "red",
                                  textAlign: "center",
                                  cursor: "pointer",
                                  display: "inline-block",
                                }}
                              >
                                {order.orderStatus}
                              </div>
                            </td>
                            <td>
                              <div
                                className="row"
                                style={{ justifyContent: "center" }}
                              >
                                <i
                                  className="icofont-edit"
                                  data-toggle="modal"
                                  data-target="#personalInfoModal"
                                  onClick={() => {
                                    this.setState({
                                      orderObj: order,
                                      orderStatus: order.orderStatus,
                                    });
                                  }}
                                  style={{
                                    color: "green",
                                    marginRight: 8,
                                    cursor: "pointer",
                                  }}
                                />
                                <i
                                  className="icofont-trash"
                                  data-toggle="modal"
                                  data-target="#personalInfoModal"
                                  onClick={() => {
                                    this.setState({
                                      orderObj: order,
                                    });
                                  }}
                                  style={{
                                    color: "red",
                                    marginLeft: 8,
                                    cursor: "pointer",
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
        {/* <!-- Container-fluid Ends--> */}
        <div
          className="modal fade"
          id="personalInfoModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            className="modal-dialog"
            role="document"
            style={{ margin: "auto" }}
          >
            <div
              className="modal-content"
              style={{ top: 10, width: "100%", margin: "auto" }}
            >
              <div
                className="modal-header"
                style={{
                  backgroundColor: "rgb(0, 37, 76)",
                  paddingTop: 20,
                  paddingBottom: 20,
                }}
              >
                <div
                  className="modal-title"
                  style={{
                    fontWeight: "bold",
                    fontSize: 17,
                    color: "white",
                  }}
                  id="exampleModalLabel"
                >
                  Update Status
                </div>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  id="personal-info-close"
                >
                  <span aria-hidden="true" style={{ color: "white" }}>
                    &times;
                  </span>
                </button>
              </div>
              {orderObj && (
                <div className="modal-body">
                  <div style={{ padding: "10px 15px" }}>
                    <div className="form-group">
                      <label
                        style={{
                          fontWeight: "bold",
                          color: "#505050",
                          marginBottom: 5,
                        }}
                      >
                        Status
                      </label>
                      <select
                        title="Please choose a package"
                        required
                        name="orderStatus"
                        className="custom-select"
                        aria-required="true"
                        aria-invalid="false"
                        onChange={this.handleChange}
                        value={this.state.orderStatus}
                      >
                        <option value="">Select Status</option>
                        <option value="Processing">Processing</option>
                        <option
                          value="Confirmed"
                          disabled={orderObj.date ? false : true}
                        >
                          Confirmed
                        </option>
                        <option
                          value="Packing"
                          disabled={orderObj.confirmedDate ? false : true}
                        >
                          Packing
                        </option>
                        <option
                          value="Delivered"
                          disabled={orderObj.packingDate ? false : true}
                        >
                          Delivered
                        </option>
                        <option value="Cancelled"> Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn "
                  data-dismiss="modal"
                  style={{
                    backgroundColor: "darkorange",
                    color: "white",
                    padding: 8,
                    borderRadius: 5,
                    fontWeight: "lighter",
                  }}
                  onClick={() => {
                    this.handleSubmit();
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="detailInfoModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            className="modal-dialog"
            role="document"
            style={{
              margin: "auto",
              minWidth: "60%",
              maxHeight: "80%",
              overflowY: "scroll",
            }}
          >
            <div className="modal-content" style={{ top: 10, margin: "auto" }}>
              <div
                className="modal-header"
                style={{
                  backgroundColor: "rgb(0, 37, 76)",
                  paddingTop: 20,
                  paddingBottom: 20,
                }}
              >
                <div
                  className="modal-title"
                  style={{
                    fontWeight: "bold",
                    fontSize: 17,
                    color: "white",
                  }}
                  id="exampleModalLabel"
                >
                  Order Id: {orderObj && orderObj.id}
                </div>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  id="personal-info-close"
                >
                  <span aria-hidden="true" style={{ color: "white" }}>
                    &times;
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div style={{ padding: "10px 15px" }}></div>
                <div
                  className="row"
                  style={{
                    marginBottom: 10,
                    borderBottom: "1px solid gainsboro",
                  }}
                >
                  <div className="col">
                    <div
                      style={{
                        padding: 10,
                        fontWeight: "bold",
                        paddingTop: 0,
                        color: "gray",
                      }}
                    >
                      Order Information
                    </div>
                    <div
                      style={{
                        padding: 10,
                        fontWeight: "bold",
                        paddingTop: 0,
                      }}
                    >
                      Order Id:{" "}
                      <span style={{ fontWeight: "lighter" }}>
                        {" "}
                        #{orderObj && orderObj.id}
                      </span>
                    </div>
                    <div
                      style={{
                        padding: 10,
                        fontWeight: "bold",
                        paddingTop: 0,
                      }}
                    >
                      Ordered at:{" "}
                      <span style={{ fontWeight: "lighter" }}>
                        {" "}
                        {orderObj &&
                          new Date(Number(orderObj.date)).toLocaleDateString()}
                        {"  "}
                        {orderObj &&
                          new Date(Number(orderObj.date)).toLocaleTimeString()}
                      </span>
                    </div>
                    <div
                      style={{
                        padding: 10,
                        fontWeight: "bold",
                        paddingTop: 0,
                      }}
                    >
                      Order Status:{" "}
                      <span
                        style={{
                          padding: 10,
                          fontWeight: "bold",
                          paddingTop: 0,
                          color: "white",
                          padding: "3px 7px",
                          borderRadius: 5,
                          backgroundColor: orderObj
                            ? orderObj.orderStatus == "Processing"
                              ? "#0f0fd9"
                              : orderObj.orderStatus == "Confirmed"
                              ? "orange"
                              : orderObj.orderStatus == "Packing"
                              ? "darkorange"
                              : orderObj.orderStatus == "Delivered"
                              ? "green"
                              : orderObj.orderStatus == "Cancelled"
                              ? "red"
                              : "white"
                            : "white",
                          textAlign: "center",
                        }}
                      >
                        {orderObj && orderObj.orderStatus}
                      </span>
                    </div>
                    <div
                      style={{
                        padding: 10,
                        fontWeight: "bold",
                        paddingTop: 0,
                      }}
                    >
                      Subtotal:{" "}
                      <span style={{ fontWeight: "lighter" }}>
                        {" "}
                        {orderObj && orderObj.subTotal}
                      </span>
                    </div>
                    <div
                      style={{
                        padding: 10,
                        fontWeight: "bold",
                        paddingTop: 0,
                      }}
                    >
                      Delivery Charge:{" "}
                      <span style={{ fontWeight: "lighter" }}>
                        {" "}
                        ৳ {(orderObj && orderObj.deliveryCharge) || "0"}
                      </span>
                    </div>
                    <div
                      style={{
                        padding: 10,
                        fontWeight: "bold",
                        paddingTop: 0,
                      }}
                    >
                      Discount Applied:{" "}
                      <span style={{ fontWeight: "lighter" }}>
                        {" "}
                        ৳ {(orderObj && orderObj.discountApplied) || "0"}
                      </span>
                    </div>
                    {orderObj && orderObj.couponApplied && (
                      <div
                        style={{
                          padding: 10,
                          fontWeight: "bold",
                          paddingTop: 0,
                        }}
                      >
                        Coupon Applied {orderObj.couponApplied.name}:{" "}
                        <span style={{ fontWeight: "lighter" }}>
                          {" "}
                          ৳ {(orderObj && orderObj.couponApplied.discount) || 0}
                        </span>
                      </div>
                    )}
                    <div
                      style={{
                        padding: 10,
                        fontWeight: "bold",
                        paddingTop: 0,
                      }}
                    >
                      Amount Payable:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        ৳{" "}
                        {orderObj &&
                          orderObj.subTotal +
                            orderObj.deliveryCharge -
                            orderObj.discountApplied -
                            (orderObj.couponApplied
                              ? orderObj.couponApplied.discount
                              : 0)}
                      </span>
                    </div>
                  </div>
                  <div className="col">
                    <div
                      style={{
                        padding: 10,
                        fontWeight: "bold",
                        paddingTop: 0,
                        color: "gray",
                      }}
                    >
                      Schedule Information
                    </div>
                    <div
                      style={{
                        padding: 10,
                        fontWeight: "bold",
                        paddingTop: 0,
                      }}
                    >
                      Order Date:{" "}
                      <span style={{ fontWeight: "lighter" }}>
                        {orderObj &&
                          new Date(Number(orderObj.date)).toLocaleDateString()}
                      </span>
                    </div>
                    <div
                      style={{
                        padding: 10,
                        fontWeight: "bold",
                        paddingTop: 0,
                      }}
                    >
                      Confirmed Date:{" "}
                      <span style={{ fontWeight: "lighter" }}>
                        {orderObj &&
                          orderObj.confirmedDate &&
                          new Date(
                            Number(orderObj.confirmedDate)
                          ).toLocaleDateString()}
                      </span>
                    </div>
                    <div
                      style={{
                        padding: 10,
                        fontWeight: "bold",
                        paddingTop: 0,
                      }}
                    >
                      Packing Date:{" "}
                      <span style={{ fontWeight: "lighter" }}>
                        {orderObj &&
                          orderObj.packingDate &&
                          new Date(
                            Number(orderObj.packingDate)
                          ).toLocaleDateString()}
                      </span>
                    </div>
                    <div
                      style={{
                        padding: 10,
                        fontWeight: "bold",
                        paddingTop: 0,
                      }}
                    >
                      Delivered Date:{" "}
                      <span style={{ fontWeight: "lighter" }}>
                        {orderObj &&
                          orderObj.deliveredDate &&
                          new Date(
                            Number(orderObj.deliveredDate)
                          ).toLocaleDateString()}
                      </span>
                    </div>
                    {orderObj && orderObj.cancelledDate && (
                      <div
                        style={{
                          padding: 10,
                          fontWeight: "bold",
                          paddingTop: 0,
                        }}
                      >
                        Cancelled Date:{" "}
                        <span style={{ fontWeight: "lighter" }}>
                          {orderObj &&
                            orderObj.cancelledDate &&
                            new Date(
                              Number(orderObj.cancelledDate)
                            ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div
                      style={{
                        padding: 10,
                        fontWeight: "bold",
                        paddingTop: 0,
                        color: "gray",
                      }}
                    >
                      Customer Information
                    </div>
                    <div
                      style={{
                        padding: 10,
                        fontWeight: "bold",
                        paddingTop: 0,
                      }}
                    >
                      Customer Id:{" "}
                      <span style={{ fontWeight: "lighter" }}>
                        {orderObj && orderObj.currentUser.uid}
                      </span>
                    </div>
                    <div
                      style={{
                        padding: 10,
                        fontWeight: "bold",
                        paddingTop: 0,
                      }}
                    >
                      Customer Name:{" "}
                      <span style={{ fontWeight: "lighter" }}>
                        {orderObj && orderObj.currentUser.displayName}
                      </span>
                    </div>
                    <div
                      style={{
                        padding: 10,
                        fontWeight: "bold",
                        paddingTop: 0,
                      }}
                    >
                      Customer Email:{" "}
                      <span style={{ fontWeight: "lighter" }}>
                        {orderObj && orderObj.currentUser.email}
                      </span>
                    </div>
                    <div
                      style={{
                        padding: 10,
                        fontWeight: "bold",
                        paddingTop: 0,
                      }}
                    >
                      Customer Mobile No:{" "}
                      <span style={{ fontWeight: "lighter" }}>
                        {orderObj && orderObj.currentUser.mobielNumber}
                      </span>
                    </div>
                  </div>
                  <div className="col">
                    <div
                      style={{
                        padding: 10,
                        fontWeight: "bold",
                        paddingTop: 0,
                        color: "gray",
                      }}
                    >
                      Delivery Information
                    </div>
                    <div
                      style={{
                        padding: 10,
                        fontWeight: "bold",
                        paddingTop: 0,
                      }}
                    >
                      Name :{" "}
                      <span style={{ fontWeight: "lighter" }}>
                        {deliveryAddress && deliveryAddress.fullName}
                      </span>
                    </div>
                    <div
                      style={{
                        padding: 10,
                        fontWeight: "bold",
                        paddingTop: 0,
                      }}
                    >
                      Mobile :{" "}
                      <span style={{ fontWeight: "lighter" }}>
                        {deliveryAddress && deliveryAddress.mobileNo}
                      </span>
                    </div>
                    <div
                      style={{
                        padding: 10,
                        fontWeight: "bold",
                        paddingTop: 0,
                      }}
                    >
                      Address :{" "}
                      <span style={{ fontWeight: "lighter" }}>
                        {deliveryAddress && deliveryAddress.address}
                      </span>
                    </div>
                    <div
                      style={{
                        padding: 10,
                        fontWeight: "bold",
                        paddingTop: 0,
                      }}
                    >
                      District :{" "}
                      <span style={{ fontWeight: "lighter" }}>
                        {deliveryAddress && deliveryAddress.district}
                      </span>
                    </div>
                    <div
                      style={{
                        padding: 10,
                        fontWeight: "bold",
                        paddingTop: 0,
                      }}
                    >
                      Division :{" "}
                      <span style={{ fontWeight: "lighter" }}>
                        {deliveryAddress && deliveryAddress.division}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 30 }}></div>
                <table className="table table-bordered table-striped table-hover">
                  <thead>
                    <tr>
                      <td style={{ fontWeight: "bold" }}>Product Image</td>
                      <td style={{ fontWeight: "bold" }}>Product Name</td>
                      <td style={{ fontWeight: "bold" }}>Product Price</td>
                      <td style={{ fontWeight: "bold" }}>Total Quantity</td>
                      <td style={{ fontWeight: "bold" }}>Total Price</td>
                    </tr>
                  </thead>
                  <tbody>
                    {orderObj &&
                      orderObj.orders.map((order) => (
                        <tr key={order.id}>
                          <td>
                            <img
                              style={{ height: 70, width: 70 }}
                              src={
                                order.selectedVariation &&
                                order.selectedVariation.id &&
                                order.selectedVariation.pictures &&
                                order.selectedVariation.pictures.length > 0
                                  ? order.selectedVariation.pictures[0]
                                  : order.product.pictures[0]
                              }
                            />
                          </td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <div style={{ fontWeight: "bold" }}>
                                {order.product.name.slice(0, 50)}...
                              </div>
                              {order.product.selectedCategories &&
                                order.product.selectedCategories.length > 0 &&
                                order.product.selectedCategories
                                  .slice(0, 2)
                                  .map((cat, index) => (
                                    <div
                                      key={index}
                                      style={{
                                        fontSize: 14,
                                        color: "#444",
                                      }}
                                    >
                                      {cat.name}
                                    </div>
                                  ))}

                              <div style={{ marginTop: 6 }}>
                                {order.selectedVariation &&
                                  order.selectedVariation.id &&
                                  order.selectedVariation.combination.map(
                                    (comb, index) => (
                                      <div key={index}>
                                        {order.product.savedAttributes.find(
                                          (attr) => attr.id == comb.parentId
                                        )
                                          ? order.product.savedAttributes.find(
                                              (attr) => attr.id == comb.parentId
                                            ).name
                                          : ""}
                                        : {comb.name}
                                      </div>
                                    )
                                  )}
                              </div>
                              <div>
                                Total:৳ {this.singleProductTotal(order)} (
                                {order.quantity}pc)
                              </div>
                            </div>
                          </td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-around",
                              }}
                            >
                              {" "}
                              <div
                                style={{
                                  fontSize: 13,
                                  textDecorationLine: "line-through",
                                  color: "gray",
                                }}
                              >
                                {this.getPrice3(order)}{" "}
                              </div>
                              <div
                                style={{
                                  color: "black",
                                  fontSize: 13,
                                  fontWeight: "bold",
                                }}
                              >
                                ৳ {this.getPrice2(order)}
                              </div>
                            </div>
                          </td>
                          <td>{order.quantity}</td>

                          <td style={{ fontWeight: "bold" }}>
                            ৳ {this.singleProductTotal(order)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <div
          className="modal fade"
          id="receiveModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            className="modal-dialog"
            role="document"
            style={{ margin: "auto" }}
          >
            <div
              className="modal-content"
              style={{ top: 10, width: "100%", margin: "auto" }}
            >
              <div
                className="modal-header"
                style={{
                  backgroundColor: "rgb(0, 37, 76)",
                  paddingTop: 20,
                  paddingBottom: 20,
                }}
              >
                <div
                  className="modal-title"
                  style={{
                    fontWeight: "bold",
                    fontSize: 17,
                    color: "white",
                  }}
                  id="exampleModalLabel"
                >
                  Receive in Warehouse
                </div>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  id="personal-info-close"
                >
                  <span aria-hidden="true" style={{ color: "white" }}>
                    &times;
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div style={{ padding: "10px 15px" }}>
                  <div className="form-group">
                    <label
                      style={{
                        fontWeight: "bold",
                        color: "#505050",
                        marginBottom: 5,
                      }}
                    >
                      Receiving in Warehouse
                    </label>
                    <select
                      title="Please choose a package"
                      required
                      name="warehouse"
                      className="custom-select"
                      aria-required="true"
                      aria-invalid="false"
                      onChange={this.handleChange}
                      value={this.state.warehouse}
                    >
                      <option value="">Select Warehouse</option>
                      <option value="Bangladesh warehouse">Bangladesh</option>
                      <option value="India warehouse">India</option>
                      <option value="USA warehouse">USA</option>
                      <option value="China warehouse">China</option>
                      <option value="Dubai warehouse">Dubai</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn "
                  data-dismiss="modal"
                  style={{
                    backgroundColor: "darkorange",
                    color: "white",
                    padding: 8,
                    borderRadius: 5,
                    fontWeight: "lighter",
                  }}
                  onClick={() => {
                    this.handleReceive();
                  }}
                >
                  Receive
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="deliverModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            className="modal-dialog"
            role="document"
            style={{ margin: "auto" }}
          >
            <div
              className="modal-content"
              style={{ top: 10, width: "100%", margin: "auto" }}
            >
              <div
                className="modal-header"
                style={{
                  backgroundColor: "rgb(0, 37, 76)",
                  paddingTop: 20,
                  paddingBottom: 20,
                }}
              >
                <div
                  className="modal-title"
                  style={{
                    fontWeight: "bold",
                    fontSize: 17,
                    color: "white",
                  }}
                  id="exampleModalLabel"
                >
                  Product Delivery
                </div>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  id="personal-info-close"
                >
                  <span aria-hidden="true" style={{ color: "white" }}>
                    &times;
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div style={{ padding: "10px 15px" }}>
                  <div className="form-group">
                    <label
                      style={{
                        fontWeight: "bold",
                        color: "#505050",
                        marginBottom: 5,
                      }}
                    >
                      Are you sure you want to delivery this products?
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  data-dismiss="modal"
                  style={{
                    backgroundColor: "darkorange",
                    color: "white",
                    padding: 8,
                    borderRadius: 5,
                    fontWeight: "lighter",
                  }}
                >
                  No
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  style={{
                    backgroundColor: "darkorange",
                    color: "white",
                    padding: 8,
                    borderRadius: 5,
                    fontWeight: "lighter",
                  }}
                  onClick={() => {
                    this.handleDelivery();
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div> */}
        {/* <div
          className="modal fade"
          id="agentPayModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            className="modal-dialog"
            role="document"
            style={{ margin: "auto" }}
          >
            <div
              className="modal-content"
              style={{
                top: 10,
                margin: "auto",
                minWidth: "150%",
              }}
            >
              <div
                className="modal-header"
                style={{
                  backgroundColor: "rgb(0, 37, 76)",
                  paddingTop: 20,
                  paddingBottom: 20,
                }}
              >
                <div
                  className="modal-title"
                  style={{
                    fontWeight: "bold",
                    fontSize: 17,
                    color: "white",
                  }}
                  id="exampleModalLabel"
                >
                  Agent Pay
                </div>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  id="personal-info-close"
                >
                  <span aria-hidden="true" style={{ color: "white" }}>
                    &times;
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <table className="table table-bordered table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Booking Id</th>
                      <th>Image</th>
                      <th>Product</th>
                      <th>Shipping Cost</th>
                      <th>Agent Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentPayProducts.map((orderObj, index) => (
                      <tr key={index}>
                        <td>{orderObj && orderObj.bookingId}</td>
                        <td>
                          {orderObj && (
                            <img
                              style={{ height: 70, width: 70 }}
                              src={
                                orderObj.imageUrl ? orderObj.imageUrl : ""
                              }
                            />
                          )}
                        </td>
                        <td>{orderObj && orderObj.name}</td>
                        <td>{orderObj && orderObj.shippingCost}Tk</td>
                        <td>{orderObj && orderObj.agentCost}Tk</td>
                      </tr>
                    ))}
                    <tr>
                      <td
                        colSpan={3}
                        style={{ textAlign: "end", fontWeight: "bold" }}
                      >
                        Total
                      </td>
                      <td style={{ fontWeight: "bold" }}>
                        {totalShippingCost}Tk
                      </td>
                      <td style={{ fontWeight: "bold" }}>{total}Tk</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  No
                </button>
                <button
                  type="button"
                  className="btn "
                  data-dismiss="modal"
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    padding: 8,
                    borderRadius: 5,
                  }}
                  onClick={() => {
                    this.handleCashOut(agentPayProducts);
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div> */}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentAdmin: state.admins.currentAdmin,
    orders: state.orders.orders,
  };
};

export default connect(mapStateToProps, {
  getAllOrdersRedux,
  updateOrderRedux,
})(Orders);
