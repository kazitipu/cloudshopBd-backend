import React, { Component, Fragment } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { connect } from "react-redux";

export class Datatable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedValues: [],
      myData: this.props.myData,
    };
  }

  selectRow = (e, i) => {
    if (!e.target.checked) {
      this.setState({
        checkedValues: this.state.checkedValues.filter((item, j) => i !== item),
      });
    } else {
      this.state.checkedValues.push(i);
      this.setState({
        checkedValues: this.state.checkedValues,
      });
    }
  };

  handleRemoveRow = () => {
    const selectedValues = this.state.checkedValues;
    const updatedData = this.state.myData.filter(function (el) {
      return selectedValues.indexOf(el.id) < 0;
    });
    this.setState({
      myData: updatedData,
    });
    toast.success("Successfully Deleted !");
  };

  renderEditable = (cellInfo) => {
    const { myData } = this.props;
    if (myData.length > 0) {
      const newData = [];
      myData.forEach((order) => {
        //  this is not affecting my output see line 104
        newData.push({
          Date: order ? order.orderedDate : "",
          "Order Id": order ? order.orderId : "",
          Status: order ? order.orderStatus : "",
          Total: order ? order.orderTotal : "",
          "Order Number": order ? order.orderNumber : "",
          "Tracking No": order ? order.trackingNo : "",
        });
      });
      return (
        <div
          style={{ backgroundColor: "#fafafa" }}
          onBlur={(e) => {
            const data = [...newData];
            data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
            this.setState({ myData: data });
          }}
          dangerouslySetInnerHTML={{
            __html: newData[cellInfo.index][cellInfo.column.id],
          }}
        />
      );
    } else {
      return null;
    }
  };

  Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getStatus = (productQuantity) => {
    if (productQuantity < 10) {
      return <i className="fa fa-circle font-danger f-12" />;
    } else if (productQuantity > 50) {
      return <i className="fa fa-circle font-success f-12" />;
    } else {
      return <i className="fa fa-circle font-warning f-12" />;
    }
  };

  render() {
    const { pageSize, myClass, multiSelectOption, pagination, currency } =
      this.props;
    console.log(this.props);
    const { myData } = this.props;
    console.log(myData);
    const newData = [];
    if (myData.length > 0) {
      myData.forEach((order) => {
        newData.push({
          Date: order ? order.orderedDate : "",
          "Order Id": order ? order.orderId : "",
          Status: order ? order.orderStatus : "",
          Total: order ? order.orderTotal : "",
          "Order Number": order ? order.orderNumber : "",
          "Tracking No": order ? order.trackingNo : "",
        });
      });
    }
    const columns = [];
    for (var key in newData[0]) {
      let editable = this.renderEditable;
      if (key == "image") {
        editable = null;
      }
      if (key == "status") {
        editable = null;
      }
      if (key === "avtar") {
        editable = null;
      }
      if (key === "vendor") {
        editable = null;
      }
      if (key === "order_status") {
        editable = null;
      }

      columns.push({
        Header: <b>{this.Capitalize(key.toString())}</b>,
        accessor: key,
        Cell: editable,
        style: {
          textAlign: "center",
        },
      });
    }

    if (multiSelectOption == true) {
      columns.push({
        Header: (
          <button
            className="btn btn-danger btn-sm btn-delete mb-0 b-r-4"
            onClick={(e) => {
              if (window.confirm("Are you sure you wish to delete this item?"))
                this.handleRemoveRow();
            }}
          >
            Delete
          </button>
        ),
        id: "delete",
        accessor: (str) => "delete",
        sortable: false,
        style: {
          textAlign: "center",
        },
        Cell: (row) => (
          <div>
            <span>
              <input
                type="checkbox"
                name={row.original.id}
                defaultChecked={this.state.checkedValues.includes(
                  row.original.id
                )}
                onChange={(e) => this.selectRow(e, row.original.id)}
              />
            </span>
          </div>
        ),
        accessor: key,
        style: {
          textAlign: "center",
        },
      });
    } else {
      columns.push(
        {
          Header: <b>Order Details</b>,
          id: "orderDetails",
          accessor: (str) => "orderDetails",
          Cell: (row) => {
            const order = myData.find(
              (order) => order.orderId == row.original["Order Id"]
            );
            return (
              <OverlayTrigger
                trigger="click"
                placement="bottom"
                overlay={
                  <Popover
                    id={`popover-positioned-bottom`}
                    style={{ minWidth: "55%" }}
                  >
                    <Popover.Title
                      style={{ backgroundColor: "#ff8084", color: "white" }}
                      as="h3"
                    >{`Order Id: ${row.original["Order Id"]}`}</Popover.Title>
                    <Popover.Content className="popover-body-container">
                      {order.items.map((item) =>
                        item.skus.map((sku) => (
                          <div
                            style={{
                              borderBottom: "1px solid gainsboro",
                              padding: 10,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-around",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                }}
                              >
                                <a href={item.detail_url} target="__blank">
                                  <div
                                    style={{
                                      backgroundImage: `url(${item.picture})`,
                                      height: 50,
                                      width: 50,
                                      backgroundSize: "cover",
                                    }}
                                  ></div>
                                </a>
                                <div style={{ marginLeft: 5 }}>
                                  {item.name && item.name.slice(0, 30)}...
                                </div>
                              </div>
                              <div>
                                color:{sku.color} <br />
                                size:{sku.size}
                              </div>
                              <div>{sku.totalQuantity}</div>
                              {currency ? (
                                <div>
                                  {parseInt(
                                    parseFloat(sku.price) *
                                      parseFloat(currency.taka)
                                  )}
                                  Tk
                                </div>
                              ) : (
                                <div>
                                  {parseInt(parseFloat(sku.price) * 1)}
                                  Tk
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </Popover.Content>
                  </Popover>
                }
              >
                <button className="btn btn-primary">show</button>
              </OverlayTrigger>
            );
          },
          style: {
            textAlign: "center",
          },
          sortable: false,
        },
        {
          Header: <b>User</b>,
          id: "orderDetails",
          accessor: (str) => "orderDetails",
          Cell: (row) => {
            const requestObj = myData.find(
              (request) => request.orderId == row.original["Order Id"]
            );
            const userObj = this.props.allUsers.find(
              (user) => user.uid === requestObj.userId
            );
            console.log(userObj);
            return (
              <>
                {myData.length > 0 ? (
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      this.props.history.push(
                        `${process.env.PUBLIC_URL}/users/list-user/${userObj.uid}`
                      )
                    }
                  >
                    {userObj && userObj.displayName}
                  </div>
                ) : (
                  ""
                )}
              </>
            );
          },
          style: {
            textAlign: "center",
          },
          sortable: false,
        },
        {
          Header: <b>Update Order</b>,
          id: "delete",
          accessor: (str) => "delete",
          Cell: (row) => {
            return (
              <div>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    const order = myData.find(
                      (order) => order.orderId == row.original["Order Id"]
                    );
                    this.props.startToggleModal(order);
                  }}
                >
                  <i
                    className="fa fa-pencil"
                    style={{
                      width: 35,
                      fontSize: 20,
                      padding: 11,
                      color: "rgb(40, 167, 69)",
                    }}
                  ></i>
                </span>
              </div>
            );
          },
          style: {
            textAlign: "center",
          },
          sortable: false,
        }
      );
    }

    return (
      <Fragment>
        <ReactTable
          data={newData}
          columns={columns}
          defaultPageSize={pageSize}
          className={myClass}
          showPagination={pagination}
        />
        <ToastContainer />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allUsers: state.users.users,
    currency: state.users.currency,
  };
};
export default connect(mapStateToProps)(Datatable);
