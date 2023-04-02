import React, { Component, Fragment } from "react";
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";

import { connect } from "react-redux";

export class Tabset_user extends Component {
  toDateTime = (secs) => {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);

    return t.toLocaleDateString("en-US");
  };

  getPaymentMethod = (recharge) => {
    if (recharge.paymentMethod === "Cash") {
      return "Cash";
    }
    if (recharge.paymentMethod === "Bank") {
      return recharge.bankName;
    }
    if (recharge.paymentMethod === "Mobile Banking") {
      return recharge.mobileBanking;
    }
  };
  getColor = (booking) => {
    if (booking.bookingStatus === "Success") {
      return "green";
    }
    if (booking.bookingStatus === "Pending") {
      return "orange";
    }
    if (booking.bookingStatus === "Reject") {
      return "red";
    }
    if (booking.bookingStatus === "Received") {
      return "purple";
    }
  };
  render() {
    const { user, bookingsArray, rechargesArray, parcelsArray, paymentsArray } =
      this.props;
    const newRechargesArray = rechargesArray.map((recharge) => {
      return { ...recharge, date: recharge.rechargedAt };
    });
    console.log(newRechargesArray);
    const newPaymentsArray = paymentsArray.map((payment) => {
      return { ...payment, date: payment.paidAt };
    });
    console.log(newPaymentsArray);

    const transactions = [...newRechargesArray, ...newPaymentsArray];
    const transactionArray = transactions.map((transaction) => {
      const dateToSort = new Date(transaction.date);
      return { ...transaction, dateToSort };
    });
    transactionArray.sort(
      (a, b) => b.dateToSort.getTime() - a.dateToSort.getTime()
    );

    return (
      <Fragment>
        <Tabs>
          <TabList
            className="nav nav-tabs tab-coupon"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Tab className="nav-link">Account info</Tab>
            <Tab className="nav-link">Bookings</Tab>
            <Tab className="nav-link">Parcels</Tab>
            <Tab className="nav-link">Recharge history</Tab>
            <Tab className="nav-link">Payment history</Tab>
            <Tab className="nav-link">Transaction history</Tab>
          </TabList>
          <TabPanel>
            <form className="needs-validation user-add" noValidate="">
              <h4>Account Details</h4>
              <div className="form-group row">
                <label className="col-xl-3 col-md-4">
                  <span>*</span> Name
                </label>
                <div
                  className="col-xl-8 col-md-7"
                  style={{ textTransform: "capitalize" }}
                >
                  {user && user.displayName}
                </div>
              </div>
              <div className="form-group row">
                <label className="col-xl-3 col-md-4">
                  <span>*</span> Status
                </label>
                <div className="col-xl-8 col-md-7">{user && user.status}</div>
              </div>
              <div className="form-group row">
                <label className="col-xl-3 col-md-4">
                  <span>*</span> Mobile No
                </label>
                <div className="col-xl-8 col-md-7">{user && user.mobileNo}</div>
              </div>
              <div className="form-group row">
                <label className="col-xl-3 col-md-4">
                  <span>*</span> Email
                </label>
                <div className="col-xl-8 col-md-7">{user && user.email}</div>
              </div>
              <div className="form-group row">
                <label className="col-xl-3 col-md-4">
                  <span>*</span> Address
                </label>
                <div className="col-xl-8 col-md-7">{user && user.address}</div>
              </div>
              <div className="form-group row">
                <label className="col-xl-3 col-md-4">
                  <span>*</span> Company
                </label>
                <div className="col-xl-8 col-md-7">{user && user.company}</div>
              </div>

              <div className="form-group row">
                <label className="col-xl-3 col-md-4">
                  <span>*</span> Shipping Mark
                </label>
                <div className="col-xl-8 col-md-7" style={{ color: "#ff8084" }}>
                  ({user && user.userId}-{user ? user.displayName : "Name"})
                </div>
              </div>
              <div className="form-group row">
                <label className="col-xl-3 col-md-4">
                  <span>*</span> Uid
                </label>
                <div className="col-xl-8 col-md-7">{user && user.uid}</div>
              </div>
              <div className="form-group row">
                <label className="col-xl-3 col-md-4">
                  <span>*</span> Created At
                </label>
                <div className="col-xl-8 col-md-7">
                  {user && this.toDateTime(user.createdAt.seconds)}
                </div>
              </div>
            </form>
          </TabPanel>
          <TabPanel>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Booking Id</th>
                  <th scope="col">Method</th>
                  <th scope="col">Date</th>

                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookingsArray.length > 0
                  ? bookingsArray.map((booking, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{booking.bookingId}</td>
                        <td>{booking.shipmentMethod}</td>
                        <td>{booking.date}</td>
                        <td
                          style={{
                            color: this.getColor(booking),
                          }}
                        >
                          {booking.bookingStatus}
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </TabPanel>
          <TabPanel>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Parcel Id</th>
                  <th scope="col">Lot No</th>
                  <th scope="col">Carton No</th>
                  <th scope="col">Tracking No</th>
                  <th scope="col">Parcel Status</th>
                </tr>
              </thead>
              <tbody>
                {parcelsArray.length > 0
                  ? parcelsArray.map((parcel, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{parcel.parcelId}</td>
                        <td>{parcel.lotNo}</td>
                        <td>{parcel.cartonNo}</td>
                        <td>{parcel.trackingNo}</td>
                        <td>{this.renderOrderStatus(parcel.lotNo)}</td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </TabPanel>
          <TabPanel>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Date</th>
                  <th scope="col">Recharge Id</th>
                  <th scope="col">Receit No</th>
                  <th scope="col">Payment Method</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Recharge By</th>
                </tr>
              </thead>
              <tbody>
                {rechargesArray.length > 0
                  ? rechargesArray.map((recharge, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{recharge.rechargedAt}</td>
                        <td>{recharge.rechargeId}</td>
                        <td>{recharge.receitNo}</td>
                        <td>{this.getPaymentMethod(recharge)}</td>
                        <td>{recharge.amount}Tk</td>
                        <td>{recharge.rechargeBy}</td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </TabPanel>

          <TabPanel>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Date</th>
                  <th scope="col">Payment Id</th>
                  <th scope="col">Payment Method</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Paid Invoice</th>
                </tr>
              </thead>
              <tbody>
                {paymentsArray.length > 0
                  ? paymentsArray.map((payment, index) => (
                      <tr
                        style={{ background: "#ff8084", color: "white" }}
                        key={index}
                      >
                        <th scope="row">{index + 1}</th>
                        <td>{payment.paidAt}</td>
                        <td>{payment.paymentId}</td>
                        <td>{payment.paymentMethod}</td>
                        <td>{payment.amount}Tk</td>
                        <td>
                          {payment.paidInvoice.map(
                            (parcelId) => `${parcelId}, `
                          )}
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </TabPanel>
          <TabPanel>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Date</th>
                  <th scope="col">Id</th>
                  <th scope="col">Payment Method</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Recharge By</th>
                  <th scope="col">Paid Invoice</th>
                </tr>
              </thead>
              <tbody>
                {transactionArray.length > 0
                  ? transactionArray.map((transaction, index) =>
                      transaction.paymentMethod !== "ALG wallet" ? (
                        <tr
                          style={{ background: "#28a745", color: "white" }}
                          key={index}
                        >
                          <th scope="row">{index + 1}</th>
                          <td>{transaction.rechargedAt}</td>
                          <td>{transaction.rechargeId}</td>

                          <td>{this.getPaymentMethod(transaction)}</td>
                          <td>{transaction.amount}Tk</td>
                          <td>{transaction.rechargeBy}</td>
                          <td></td>
                        </tr>
                      ) : (
                        <tr
                          style={{ background: "#dc3545", color: "white" }}
                          key={index}
                        >
                          <th scope="row">{index + 1}</th>
                          <td>{transaction.paidAt}</td>
                          <td>{transaction.paymentId}</td>
                          <td>{transaction.paymentMethod}</td>
                          <td>{transaction.amount}Tk</td>
                          <td></td>
                          <td>
                            {transaction.paidInvoice.map(
                              (parcelId) => `${parcelId}, `
                            )}
                          </td>
                        </tr>
                      )
                    )
                  : null}
              </tbody>
            </table>
          </TabPanel>
        </Tabs>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};
export default connect(mapStateToProps)(Tabset_user);
