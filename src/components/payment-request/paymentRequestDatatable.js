import React, { Component, Fragment } from "react";
import { Users } from "react-feather";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import { updatePaymentRequestStatusRedux } from "../../actions/index";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { getMultipleOrders } from "../../firebase/firebase.utils";
import { CircleLoader } from "react-spinners";
export class Datatable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedValues: [],
      myData: this.props.myData,
      loader: false,
      paymentId: null,
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
      myData.forEach((paymentRequest) => {
        //  this is not affecting my output see line 104
        const userObj = this.props.allUser.find(
          (user) => user.uid === paymentRequest.userId
        );
        newData.push({
          "Payment Id": paymentRequest ? paymentRequest.paymentId : "",
          Date: paymentRequest ? paymentRequest.date : "",
          "User Id": userObj ? userObj.userId : "",
          Name: userObj ? userObj.displayName : "",
          Method: paymentRequest ? paymentRequest.method : "",
          Amount: paymentRequest ? `${paymentRequest.amount}Tk` : "",
          image: (
            <a
              target="_blank"
              href={paymentRequest ? paymentRequest.imageUrl : ""}
            >
              <img
                style={{ width: "150px", height: "100px" }}
                src={paymentRequest ? paymentRequest.imageUrl : ""}
              ></img>
            </a>
          ),
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

  render() {
    const { pageSize, myClass, multiSelectOption, pagination } = this.props;
    console.log(this.props);
    const { myData } = this.props;
    console.log(myData);
    const newData = [];
    if (myData.length > 0) {
      myData.forEach((paymentRequest) => {
        //  this is not affecting my output see line 104
        const userObj = this.props.allUser.find(
          (user) => user.uid === paymentRequest.userId
        );
        newData.push({
          "Payment Id": paymentRequest ? paymentRequest.paymentId : "",
          Date: paymentRequest ? paymentRequest.date : "",
          "User Id": userObj ? userObj.userId : "",
          Name: userObj ? userObj.displayName : "",
          Method: paymentRequest ? paymentRequest.method : "",
          Amount: paymentRequest ? `${paymentRequest.amount}Tk` : "",
          image: (
            <a
              target="_blank"
              href={paymentRequest ? paymentRequest.imageUrl : ""}
            >
              <img
                style={{ width: "150px", height: "100px" }}
                src={paymentRequest ? paymentRequest.imageUrl : ""}
              ></img>
            </a>
          ),
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
          Header: <b>status</b>,
          id: "delete",
          accessor: (str) => "delete",
          Cell: (row) => {
            if (myData.length > 0) {
              const paymentRequest = myData.find(
                (paymentRequest) =>
                  paymentRequest.paymentId === row.original["Payment Id"]
              );
              if (paymentRequest.status === "pending") {
                return (
                  <div style={{ color: "orange" }}>
                    <i className="icofont-spinner-alt-3"></i>&nbsp;
                    {paymentRequest.status}
                  </div>
                );
              }
              if (paymentRequest.status === "paid") {
                return (
                  <div style={{ color: "green" }}>
                    <i className="icofont-like"></i>&nbsp;
                    {paymentRequest.status}
                  </div>
                );
              }
              if (paymentRequest.status === "rejected") {
                return (
                  <div style={{ color: "red" }}>
                    <i className="icofont-close-squared"></i>&nbsp;
                    {paymentRequest.status}
                  </div>
                );
              }
              return null;
            }
          },
          style: {
            textAlign: "center",
          },
          sortable: false,
        },
        {
          Header: <b>Paid Bookings</b>,
          id: "orderDetails",
          accessor: (str) => "orderDetails",
          Cell: (row) => {
            const paymentObj = myData.find(
              (payment) => payment.paymentId === row.original["Payment Id"]
            );
            return (
              <OverlayTrigger
                trigger="click"
                placement="bottom"
                overlay={
                  <Popover
                    id={`popover-positioned-bottom`}
                    style={{ minWidth: "12%" }}
                  >
                    <Popover.Title
                      style={{ backgroundColor: "#13c9ca", color: "white" }}
                      as="h3"
                    >
                      Bookin Id List
                    </Popover.Title>
                    <Popover.Content className="popover-body-container">
                      <div
                        style={{
                          paddingBottom: "10px",
                        }}
                      >
                        {paymentObj &&
                          paymentObj.productRequestArray &&
                          paymentObj.productRequestArray.map(
                            (productRequest) => (
                              <div
                                key={productRequest.bookingId}
                                style={{
                                  borderBottom: "1px solid gainsboro",
                                  paddingBottom: "5px",
                                }}
                              >
                                {productRequest.bookingId}
                              </div>
                            )
                          )}
                      </div>
                    </Popover.Content>
                  </Popover>
                }
              >
                <button className="btn btn-secondary">invoices</button>
              </OverlayTrigger>
            );
          },
          style: {
            textAlign: "center",
          },
          sortable: false,
        },
        {
          Header: <b>Action</b>,
          id: "delete",
          accessor: (str) => "delete",
          Cell: (row) => {
            const paymentRequest =
              myData.length > 0
                ? myData.find(
                    (paymentRequest) =>
                      paymentRequest.paymentId === row.original["Payment Id"]
                  )
                : null;
            return (
              <div>
                {paymentRequest && paymentRequest.status === "pending" ? (
                  <>
                    <span style={{ cursor: "pointer", padding: "5px" }}>
                      <button
                        // className="btn"
                        style={{
                          backgroundColor: "green",
                          color: "white",
                          fontSize: 12,
                          maxWidth: "80px",
                          padding: "10px",
                          border: "none",
                          minWidth: 80,
                          minHeight: 30,
                          textAlign: "center",
                        }}
                        type="button"
                        onClick={async () => {
                          if (myData.length > 0) {
                            this.setState({
                              loader: true,
                              paymentId: row.original["Payment Id"],
                            });
                            const bookingIdArray =
                              paymentRequest.productRequestArray.map(
                                (productRequest) => productRequest.bookingId
                              );

                            this.setState({
                              loader: false,
                              paymentId: null,
                            });
                            this.props.startToggleModal(
                              paymentRequest,
                              paymentRequest.productRequestArray
                            );
                          }
                        }}
                      >
                        {this.state.paymentId !==
                          row.original["Payment Id"] && (
                          <i className="icofont-checked"> &nbsp; Approve</i>
                        )}
                        {this.state.paymentId ===
                          row.original["Payment Id"] && (
                          <div style={{ marginTop: -5 }}>
                            <CircleLoader
                              loading={this.state.loader}
                              color="white"
                              size={15}
                            />
                          </div>
                        )}
                      </button>
                    </span>

                    <span style={{ cursor: "pointer" }}>
                      <button
                        // className="btn"
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          fontSize: "70%",
                          maxWidth: "80px",
                          padding: "10px",
                          border: "none",
                        }}
                        type="button"
                        onClick={() => {
                          if (myData.length > 0) {
                            const paymentRequest = myData.find(
                              (paymentRequest) =>
                                paymentRequest.paymentId ==
                                row.original["Payment Id"]
                            );
                            this.props.updatePaymentRequestStatusRedux({
                              ...paymentRequest,
                              status: "rejected",
                            });
                          }
                        }}
                      >
                        <i className="icofont-close-squared"></i>&nbsp; Reject
                      </button>
                    </span>
                  </>
                ) : null}
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
    allUser: state.users.users,
  };
};
export default connect(mapStateToProps, { updatePaymentRequestStatusRedux })(
  Datatable
);
