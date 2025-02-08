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
import SteadFast from "./steadFast.png";
import Pathao from "./pathao.png";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import loader from "sass-loader";
const api_key = "xzxz8veesykaes09owbphuqbel5yx6cx";
const secret_key = "uuvywmhr3amooqiyjnaf7l9v";
const base_url = "https://portal.packzy.com/api/v1";

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
      courier: "",
      note: "",
      loader: false,
      method: "",
      amount: 0,
      paymentStatus: "",
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
      console.log(orderStatus2);
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
      courier: "",
      note: "",
    });
  };
  handleCourier = async (codAmount) => {
    const { orderObj } = this.state;

    const create_order = `${base_url}/create_order`;
    axios
      .post(
        create_order,
        {
          invoice: `${orderObj.id}`,
          recipient_name: orderObj.currentUser
            ? orderObj.currentUser.address.find(
                (address) => address.defaultShipping
              ).fullName
            : orderObj.guest.address.find((address) => address.defaultShipping)
                .fullName,
          recipient_phone: orderObj.currentUser
            ? orderObj.currentUser.address.find(
                (address) => address.defaultShipping
              ).mobileNo
            : orderObj.guest.address.find((address) => address.defaultShipping)
                .mobileNo,
          recipient_address: orderObj.currentUser
            ? `${
                orderObj.currentUser.address.find(
                  (address) => address.defaultShipping
                ).address
              },${
                orderObj.currentUser.address.find(
                  (address) => address.defaultShipping
                ).district
              },${
                orderObj.currentUser.address.find(
                  (address) => address.defaultShipping
                ).division
              }`
            : `${
                orderObj.guest.address.find(
                  (address) => address.defaultShipping
                ).address
              },${
                orderObj.guest.address.find(
                  (address) => address.defaultShipping
                ).district
              },${
                orderObj.guest.address.find(
                  (address) => address.defaultShipping
                ).division
              }`,
          cod_amount: codAmount,
          note: this.state.note,
        }, // Request body (if needed)
        {
          headers: {
            "Api-Key": api_key,
            "Secret-Key": secret_key,
            "Content-Type": "application/json",
          },
        }
      )
      .then(async (response) => {
        await this.props.updateOrderRedux({
          ...orderObj,
          courier: response.data,
        });
        toast.success(
          "Consignment has been created successfully at steadfast!"
        );
      })
      .catch((error) => {
        toast.error("Error creating consignment at steadfast.");
      });
    console.log("Handle submit is getting called!");

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
      courier: "",
      note: "",
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
  handleSubmit2 = async (event, totalDue) => {
    event.preventDefault();

    if (this.state.amount == 0) {
      alert("Paid amount must be more than 0");
      return;
    }
    if (this.state.amount > totalDue) {
      alert("Paid amount can't be more than due amount.");
      return;
    }
    console.log(this.state);

    await this.props.updateOrderRedux({
      ...this.state.orderObj,
      paymentStatus:
        this.state.paymentStatus !== ""
          ? this.state.paymentStatus
          : this.state.orderObj.paymentStatus
          ? this.state.orderObj.paymentStatus
          : "purchaseLater",
      payments:
        this.state.orderObj.payments && this.state.orderObj.payments.length > 0
          ? [
              ...this.state.orderObj.payments,
              {
                amount: this.state.amount,
                method: this.state.method,
                receivedBy:
                  this.props.currentAdmin && this.props.currentAdmin.name
                    ? this.props.currentAdmin.name
                    : "",
                date: new Date().toLocaleDateString("en-GB"),
              },
            ]
          : [
              {
                amount: this.state.amount,
                method: this.state.method,
                receivedBy:
                  this.props.currentAdmin && this.props.currentAdmin.name
                    ? this.props.currentAdmin.name
                    : "",
                date: new Date().toLocaleDateString("en-GB"),
              },
            ],
    });
    toast.success("successfully updated the payment");

    this.setState({
      method: "",
      amount: "",
      paymentStatus: "",
    });
    document.getElementById("close-button-for-payment-modal").click();
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

    let totalPaid = 0;
    if (orderObj && orderObj.payments && orderObj.payments.length > 0) {
      orderObj.payments.map((payment) => {
        totalPaid += parseInt(payment.amount);
      });
    }
    let amountPayable = 0;
    if (orderObj) {
      amountPayable =
        orderObj &&
        orderObj.subTotal +
          orderObj.deliveryCharge -
          orderObj.discountApplied -
          (orderObj.couponApplied ? orderObj.couponApplied.discount : 0);
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
                  <div>
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
                  </div>
                  <div
                    style={{
                      background: "#00B795",
                      color: "white",
                      padding: 10,
                      borderRadius: 10,
                      fontWeight: "bold",
                      cursor: "pointer",
                      minWidth: 200,
                      textAlign: "center",
                    }}
                    onClick={async () => {
                      if (!this.state.balance) {
                        let response = await axios.get(
                          `${base_url}/get_balance`,
                          {
                            headers: {
                              "Api-Key": api_key,
                              "Secret-Key": secret_key,
                              "Content-Type": "application/json",
                            },
                          }
                        );
                        if (response.data && response.data.current_balance) {
                          this.setState({
                            balance: response.data.current_balance,
                          });
                        }
                      }
                    }}
                  >
                    {this.state.balance
                      ? `Tk ${this.state.balance} `
                      : "👆🏻 Steadfast Balance"}
                  </div>
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
                  <div
                    style={{
                      background: "#00b795",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 13,
                      padding: "10px 10px",
                      borderRadius: 5,
                      display: "inline-block",
                      textAlign: "center",
                      minWidth: 250,
                    }}
                    onClick={async () => {
                      if (this.state.loader) {
                        return;
                      }
                      this.setState({
                        loader: true,
                      });
                      let notDeliveredOrders = orders.filter(
                        (order) => order.orderStatus !== "Delivered"
                      );
                      let orderAwait = await notDeliveredOrders.map(
                        async (order) => {
                          if (
                            order.courier &&
                            order.courier.consignment &&
                            order.courier.consignment.consignment_id
                          ) {
                            const response = await axios.get(
                              `${base_url}/status_by_cid/${order.courier.consignment.consignment_id}`,
                              {
                                headers: {
                                  "Api-Key": api_key,
                                  "Secret-Key": secret_key,
                                  "Content-Type": "application/json",
                                },
                              }
                            );
                            if (
                              response.data &&
                              response.data.delivery_status &&
                              response.data.delivery_status == "delivered"
                            ) {
                              await this.props.updateOrderRedux({
                                ...order,
                                orderStatus: "Delivered",
                                [`${"Delivered".toLowerCase()}Date`]: new Date()
                                  .getTime()
                                  .toString(),
                                orderStatusScore: 5,
                              });
                            }
                          }
                        }
                      );

                      this.setState({
                        loader: false,
                      });
                      toast.success("Successfully updated all order status");
                    }}
                  >
                    {this.state.loader ? (
                      <ClipLoader
                        loading={this.state.loader}
                        color="white"
                        size={14}
                      />
                    ) : (
                      "Update all Orders"
                    )}
                  </div>
                  <div className="clearfix"></div>
                  <div
                    id="basicScenario"
                    className="product-physical"
                    style={{ marginTop: 20 }}
                  >
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
                            Payment Status
                          </th>
                          <th
                            scope="col"
                            style={{
                              padding: "30px 15px",
                              color: "white",
                              backgroundColor: "#00254c",
                            }}
                          >
                            Courier
                          </th>
                          <th
                            scope="col"
                            style={{
                              padding: "30px 15px",
                              color: "white",
                              backgroundColor: "#00254c",
                            }}
                          >
                            Invoice
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
                                  fontSize: 13,
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
                                  fontSize: 11,
                                }}
                              >
                                {order.orderStatus}
                              </div>
                            </td>
                            <td>
                              <span
                                style={{
                                  padding: "1px 6px",
                                  fontWeight: "bold",
                                  color: "white",
                                  borderRadius: 5,
                                  background: order
                                    ? order.paymentStatus == "Partially Paid"
                                      ? "darkorange"
                                      : order.paymentStatus == "Not Paid"
                                      ? "red"
                                      : order.paymentStatus == "Paid"
                                      ? "green"
                                      : order.paymentStatus == "purchaseLater"
                                      ? "gray"
                                      : order.paymentStatus == "pending"
                                      ? "darkorange"
                                      : "red"
                                    : "red",
                                  textAlign: "center",
                                  fontSize: 11,
                                  cursor: "pointer",
                                }}
                                data-toggle="modal"
                                data-target="#paymentModal"
                                onClick={() => {
                                  this.setState({
                                    orderObj: order,
                                  });
                                }}
                              >
                                {(order && order.paymentStatus) || "Not Paid"}
                              </span>
                            </td>
                            <td>
                              {order.courier &&
                              order.courier.consignment &&
                              order.courier.consignment.consignment_id ? (
                                <div
                                  style={{
                                    display: "inline",
                                    padding: "2px 7px",
                                    borderRadius: 4,
                                    color: "white",
                                    background: "green",
                                    cursor: "pointer",
                                    fontSize: 11,
                                  }}
                                  data-toggle="modal"
                                  data-target="#courierModal"
                                  onClick={async () => {
                                    const response = await axios.get(
                                      `${base_url}/status_by_cid/${order.courier.consignment.consignment_id}`,
                                      {
                                        headers: {
                                          "Api-Key": api_key,
                                          "Secret-Key": secret_key,
                                          "Content-Type": "application/json",
                                        },
                                      }
                                    );
                                    console.log(response.data);
                                    let description = "";
                                    if (
                                      response.data &&
                                      response.data.delivery_status
                                    ) {
                                      if (
                                        response.data.delivery_status ==
                                        "pending"
                                      ) {
                                        description =
                                          "Consignment is not delivered or cancelled yet.";
                                      } else if (
                                        response.data.delivery_status ==
                                        "delivered_approval_pending"
                                      ) {
                                        description =
                                          "Consignment is delivered but waiting for admin approval.";
                                      } else if (
                                        response.data.delivery_status ==
                                        "partial_delivered_approval_pending"
                                      ) {
                                        description =
                                          "Consignment is delivered partially and waiting for admin approval.";
                                      } else if (
                                        response.data.delivery_status ==
                                        "cancelled_approval_pending"
                                      ) {
                                        description =
                                          "Consignment is cancelled and waiting for admin approval.";
                                      } else if (
                                        response.data.delivery_status ==
                                        "unknown_approval_pending"
                                      ) {
                                        description =
                                          "Unknown Pending status. Need contact with the support team.";
                                      } else if (
                                        response.data.delivery_status ==
                                        "delivered"
                                      ) {
                                        description =
                                          "Consignment is delivered and balance added.";
                                      } else if (
                                        response.data.delivery_status ==
                                        "partial_delivered"
                                      ) {
                                        description =
                                          "Consignment is partially delivered and balance added.";
                                      } else if (
                                        response.data.delivery_status ==
                                        "cancelled"
                                      ) {
                                        description =
                                          "Consignment is cancelled and balance updated.";
                                      } else if (
                                        response.data.delivery_status == "hold"
                                      ) {
                                        description = "Consignment is held.";
                                      } else if (
                                        response.data.delivery_status ==
                                        "in_review"
                                      ) {
                                        description =
                                          "Order is placed and waiting to be reviewed.";
                                      } else if (
                                        response.data.delivery_status ==
                                        "unknown"
                                      ) {
                                        description =
                                          "Unknown status. Need contact with the support team.";
                                      }
                                    }
                                    this.setState({
                                      orderObj: {
                                        ...order,
                                        deliveryStatus:
                                          response.data &&
                                          response.data.delivery_status
                                            ? response.data.delivery_status
                                            : "",
                                        deliveryStatusDescription: description,
                                      },
                                      orderStatus: order.orderStatus,
                                      courier: "SteadFast",
                                    });
                                  }}
                                >
                                  track
                                </div>
                              ) : order && order.courier ? (
                                <div
                                  style={{
                                    display: "inline",
                                    padding: "2px 7px",
                                    borderRadius: 4,
                                    color: "white",
                                    background: "red",
                                    cursor: "pointer",
                                    fontSize: 13,
                                  }}
                                >
                                  Cancelled
                                </div>
                              ) : (
                                <img
                                  data-toggle="modal"
                                  data-target="#courierModal"
                                  onClick={() => {
                                    this.setState({
                                      orderObj: order,
                                      orderStatus: order.orderStatus,
                                      courier: "SteadFast",
                                    });
                                  }}
                                  src={SteadFast}
                                  style={{
                                    width: "80%",
                                    border: "2px solid #319f82",
                                    borderRadius: 5,
                                    cursor: "pointer",
                                  }}
                                />
                              )}
                              {/* <img
                                data-toggle="modal"
                                data-target="#courierModal"
                                onClick={() => {
                                  this.setState({
                                    orderObj: order,
                                    orderStatus: order.orderStatus,
                                    courier: "Pathao",
                                  });
                                }}
                                src={Pathao}
                                style={{
                                  width: "80%",
                                  height: 35,
                                  border: "2px solid #e83234",
                                  borderRadius: 5,
                                  cursor: "pointer",
                                  marginTop: 5,
                                }}
                              /> */}
                            </td>
                            <td>
                              <a
                                style={{
                                  color: "white",
                                  padding: "3px 10px",
                                  borderRadius: 5,
                                  backgroundColor: "black",
                                  textAlign: "center",
                                  cursor: "pointer",
                                  display: "inline-block",
                                  fontSize: 12,
                                }}
                                href={`/invoice/${order.id}`}
                                target="_blank"
                              >
                                invoice
                              </a>
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
          id="courierModal"
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
                  {orderObj &&
                  orderObj.courier &&
                  orderObj.courier.status == 200
                    ? "Consignment has been created"
                    : orderObj &&
                      orderObj.courier &&
                      orderObj.courier.status != 200
                    ? "An error occurred creating the consignment."
                    : "Select Courier"}
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
                      {!orderObj.courier && (
                        <div>
                          Are you sure you want to deliver this order with{" "}
                          {this.state.courier}?
                        </div>
                      )}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          marginTop: 20,
                        }}
                      >
                        <div style={{ fontWeight: "bold", marginTop: 10 }}>
                          {" "}
                          Selected Courier:{" "}
                        </div>
                        <img
                          src={
                            this.state.courier == "SteadFast"
                              ? SteadFast
                              : Pathao
                          }
                          style={{
                            width: 100,
                            marginLeft: 6,
                            border:
                              this.state.courier == "SteadFast"
                                ? "2px solid #319f82"
                                : "2px solid #e83234",
                            borderRadius: 5,
                          }}
                        />
                      </div>
                      {!orderObj.courier && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            marginTop: 20,
                          }}
                        >
                          <div
                            // className="form-group"
                            style={{ minWidth: "100%" }}
                          >
                            <div style={{ fontWeight: "bold" }}>
                              Write Delivery Instruction
                            </div>
                            <textarea
                              name="note"
                              value={this.state.note}
                              style={{
                                width: "100%",
                                height: 200,
                                border: "1px solid gainsboro",
                                borderRadius: 5,
                                textAlign: "left",
                                marginTop: 5,
                                padding: 10,
                              }}
                              type="search"
                              placeholder="Wrtie delivery instruction to courier partner"
                              onChange={(e) => {
                                this.setState({
                                  note: e.target.value,
                                });
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <div
                        style={{
                          marginTop: 30,
                          fontWeight: "bold",
                          marginBottom: 6,
                        }}
                      >
                        Courier Information
                      </div>
                      {orderObj &&
                        orderObj.courier &&
                        orderObj.courier.consignment && (
                          <div style={{ marginTop: 5 }}>
                            Created At:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {new Date(
                                orderObj.courier.consignment.created_at
                              ).toLocaleString("en-BD", {
                                timeZone: "Asia/Dhaka",
                              })}
                            </span>
                          </div>
                        )}
                      {orderObj &&
                        orderObj.courier &&
                        orderObj.courier.consignment && (
                          <div style={{ marginTop: 5 }}>
                            Consignment id:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {orderObj &&
                                orderObj.courier.consignment.consignment_id}
                            </span>
                          </div>
                        )}
                      {orderObj &&
                        orderObj.courier &&
                        orderObj.courier.consignment && (
                          <div style={{ marginTop: 5 }}>
                            Tracking Code:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {orderObj &&
                                orderObj.courier.consignment.tracking_code}
                            </span>
                          </div>
                        )}
                      <div style={{ marginTop: 5 }}>
                        Invoice:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {orderObj && orderObj.id}
                        </span>
                      </div>
                      {orderObj && (
                        <div className="wrap-info">
                          {orderObj.currentUser ? (
                            <ul>
                              <li style={{ marginTop: 5 }}>
                                Name :{" "}
                                <span style={{ fontWeight: "bold" }}>
                                  {" "}
                                  {
                                    orderObj.currentUser.address.find(
                                      (address) => address.defaultShipping
                                    ).fullName
                                  }
                                </span>
                              </li>{" "}
                              <br />
                              <li style={{ marginTop: 5 }}>
                                Mobile No :{" "}
                                <span style={{ fontWeight: "bold" }}>
                                  {" "}
                                  {
                                    orderObj.currentUser.address.find(
                                      (address) => address.defaultShipping
                                    ).mobileNo
                                  }
                                </span>
                              </li>
                              <br />
                              <li style={{ marginTop: 5 }}>
                                Address :{" "}
                                <span style={{ fontWeight: "bold" }}>
                                  {
                                    orderObj.currentUser.address.find(
                                      (address) => address.defaultShipping
                                    ).address
                                  }
                                </span>
                              </li>
                              <br />
                              <li style={{ marginTop: 5 }}>
                                District :
                                <span style={{ fontWeight: "bold" }}>
                                  {" "}
                                  {
                                    orderObj.currentUser.address.find(
                                      (address) => address.defaultShipping
                                    ).district
                                  }
                                </span>
                              </li>
                              <br />
                              <li style={{ marginTop: 5 }}>
                                Division :
                                <span style={{ fontWeight: "bold" }}>
                                  {" "}
                                  {
                                    orderObj.currentUser.address.find(
                                      (address) => address.defaultShipping
                                    ).division
                                  }
                                </span>
                              </li>
                            </ul>
                          ) : (
                            <ul>
                              <li style={{ marginTop: 5 }}>
                                Name :{" "}
                                <span style={{ fontWeight: "bold" }}>
                                  {" "}
                                  {
                                    orderObj.guest.address.find(
                                      (address) => address.defaultShipping
                                    ).fullName
                                  }
                                </span>
                              </li>
                              <br />
                              <li style={{ marginTop: 5 }}>
                                Mobile No :{" "}
                                <span style={{ fontWeight: "bold" }}>
                                  {" "}
                                  {
                                    orderObj.guest.address.find(
                                      (address) => address.defaultShipping
                                    ).mobileNo
                                  }
                                </span>
                              </li>
                              <br />
                              <li style={{ marginTop: 5 }}>
                                Address :{" "}
                                <span style={{ fontWeight: "bold" }}>
                                  {
                                    orderObj.guest.address.find(
                                      (address) => address.defaultShipping
                                    ).address
                                  }
                                </span>
                              </li>
                              <br />
                              <li style={{ marginTop: 5 }}>
                                District :
                                <span style={{ fontWeight: "bold" }}>
                                  {" "}
                                  {
                                    orderObj.guest.address.find(
                                      (address) => address.defaultShipping
                                    ).district
                                  }
                                </span>
                              </li>
                              <br />
                              <li style={{ marginTop: 5 }}>
                                Division :
                                <span style={{ fontWeight: "bold" }}>
                                  {" "}
                                  {
                                    orderObj.guest.address.find(
                                      (address) => address.defaultShipping
                                    ).division
                                  }
                                </span>
                              </li>
                            </ul>
                          )}
                        </div>
                      )}
                      <div style={{ marginTop: 5 }}>
                        COD Amount:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {amountPayable - totalPaid}
                          Tk
                        </span>
                      </div>
                      <div style={{ marginTop: 5 }}>
                        Note: <br />
                        <span
                          style={{
                            fontSize: 12,
                            marginTop: 2,
                            fontWeight: "bold",
                          }}
                        >
                          {this.state.note}
                        </span>
                      </div>
                    </div>
                  </div>
                  {orderObj &&
                    orderObj.courier &&
                    orderObj.courier.consignment && (
                      <div style={{ marginLeft: 12 }}>
                        <div style={{ fontWeight: "bold" }}>
                          Tracking Details
                        </div>
                        <div style={{ marginTop: 5 }}>
                          Delivery Status:{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                              color: "white",
                              background: "#00B795",
                              borderRadius: 5,
                              padding: "0px 10px",
                            }}
                          >
                            {orderObj.deliveryStatus}
                          </span>
                        </div>
                        <div style={{ marginTop: 5 }}>
                          Status Details:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {orderObj.deliveryStatusDescription}
                          </span>
                        </div>
                      </div>
                    )}
                </div>
              )}

              {orderObj && !orderObj.courier && (
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn "
                    data-dismiss="modal"
                    style={{
                      backgroundColor: "red",
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
                    className="btn "
                    data-dismiss="modal"
                    style={{
                      backgroundColor: "darkgreen",
                      color: "white",
                      padding: 8,
                      borderRadius: 5,
                      fontWeight: "lighter",
                    }}
                    onClick={() => {
                      this.handleCourier(amountPayable - totalPaid);
                    }}
                  >
                    Yes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="paymentModal"
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
                  Receive Payment
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
                          color: "black",
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
                            new Date(
                              Number(orderObj.date)
                            ).toLocaleDateString()}
                          {"  "}
                          {orderObj &&
                            new Date(
                              Number(orderObj.date)
                            ).toLocaleTimeString()}
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
                            fontSize: 12,
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
                          ৳{orderObj && orderObj.subTotal}
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
                          Coupon Applied{" "}
                          <span
                            style={{
                              color: "#ff8084",
                              fontWeight: "bold",
                              fontSize: 12,
                            }}
                          >
                            {" "}
                            ({orderObj.couponApplied.name})
                          </span>
                          :{" "}
                          <span style={{ fontWeight: "lighter" }}>
                            {" "}
                            ৳{" "}
                            {(orderObj && orderObj.couponApplied.discount) || 0}
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
                      <div
                        style={{
                          padding: 10,
                          fontWeight: "bold",
                          paddingTop: 0,
                        }}
                      >
                        Total Paid:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          ৳ {totalPaid}
                        </span>
                      </div>
                      <div
                        style={{
                          padding: 10,
                          fontWeight: "bold",
                          paddingTop: 0,
                          color: "red",
                        }}
                      >
                        Total Due:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          ৳ {amountPayable - totalPaid}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <form
                        onSubmit={(e) => {
                          this.handleSubmit2(
                            e,
                            parseInt(amountPayable) - parseInt(totalPaid)
                          );
                        }}
                        className="rounded-field mt-2"
                      >
                        <div className="form-row mb-2">
                          <div className="col">
                            <label
                              style={{
                                marginBottom: 0,
                                fontSize: 13,
                                fontWeight: "bold",
                              }}
                            >
                              Payment Method
                            </label>

                            <select
                              title=""
                              name="method"
                              className="custom-select"
                              aria-required="true"
                              aria-invalid="false"
                              onChange={this.handleChange}
                              style={{ fontSize: ".8rem" }}
                              value={this.state.method}
                              required
                            >
                              <option value="">Select Method</option>
                              <option value="Cash">Cash</option>
                              <option value="Bkash">Bkash</option>
                              <option value="Nagad">Nagad</option>
                              <option value="Rocket">Rocket</option>
                              <option value="City">City Bank</option>
                            </select>
                          </div>
                          <div className="col">
                            <label
                              style={{
                                marginBottom: 0,
                                fontSize: 13,
                                fontWeight: "bold",
                              }}
                            >
                              Paid amount
                            </label>

                            <input
                              type="number"
                              name="amount"
                              className="form-control"
                              placeholder="Enter amount"
                              style={{ fontSize: "1rem" }}
                              onChange={this.handleChange}
                              value={this.state.amount}
                              required
                            />
                          </div>
                          <div className="col">
                            <label
                              style={{
                                marginBottom: 0,
                                fontSize: 13,
                                fontWeight: "bold",
                              }}
                            >
                              Payment Status
                            </label>

                            <select
                              title=""
                              name="paymentStatus"
                              className="custom-select"
                              aria-required="true"
                              aria-invalid="false"
                              onChange={this.handleChange}
                              style={{ fontSize: ".8rem" }}
                              value={this.state.paymentStatus}
                              required
                            >
                              <option value="">Select Payment Status</option>
                              <option value="Partially Paid">
                                Partially Paid
                              </option>
                              <option value="Paid">Full Paid</option>
                            </select>
                          </div>
                        </div>

                        <div className="form-row">
                          <div
                            className="col pt-3"
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <button
                              type="submit"
                              className="btn"
                              style={{
                                background: "rgb(0, 37, 76)",
                                color: "white",
                              }}
                            >
                              Update
                              <i className="icofont-rounded-right"></i>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="row">
                    {orderObj &&
                      orderObj.payments &&
                      orderObj.payments.length > 0 && (
                        <div className="col">
                          <div
                            className="row"
                            style={{
                              height: 1,
                              width: "100%",
                              background: "gainsboro",
                              marginTop: 20,
                              marginBottom: 20,
                              marginRight: 0,
                              marginLeft: 0,
                            }}
                          ></div>
                          <div
                            style={{
                              paddingLeft: 0,
                              color: "#18768f",
                              fontWeight: "bold",
                            }}
                          >
                            Previous Payments
                          </div>
                          <table className="table table-bordered table-striped table-hover">
                            <thead
                              style={{ background: "#18768f", color: "white" }}
                            >
                              <tr>
                                <td style={{ fontWeight: "bold" }}>Date</td>
                                <td style={{ fontWeight: "bold" }}>Method</td>
                                <td style={{ fontWeight: "bold" }}>Amount</td>

                                <td style={{ fontWeight: "bold" }}>
                                  Approved by
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              {orderObj.payments.map((payment) => (
                                <tr>
                                  <td>{payment.date}</td>
                                  <td>{payment.method}</td>
                                  <td>{payment.amount}Tk</td>
                                  <td>{payment.receivedBy}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                  </div>
                </div>
              )}

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn "
                  data-dismiss="modal"
                  id="close-button-for-payment-modal"
                  style={{
                    backgroundColor: "darkgreen",
                    color: "white",
                    padding: 8,
                    borderRadius: 5,
                    fontWeight: "lighter",
                  }}
                  onClick={() => {
                    this.setState({
                      orderObj: null,
                    });
                  }}
                >
                  Close
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
                          fontSize: 12,
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
                        ৳{orderObj && orderObj.subTotal}
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
                        Coupon Applied{" "}
                        <span
                          style={{
                            color: "#ff8084",
                            fontWeight: "bold",
                            fontSize: 12,
                          }}
                        >
                          {" "}
                          ({orderObj.couponApplied.name})
                        </span>
                        :{" "}
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
                        ৳ {amountPayable}
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
