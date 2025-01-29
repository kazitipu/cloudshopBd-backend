import React, { Component, Fragment } from "react";

import { connect } from "react-redux";
import "./css/invoice-by-order.css";
import Alg from "./alg.png";

import { withRouter } from "react-router-dom";
import { getAllCustomerLoansRedux } from "../../../actions";
export class OnlyInvoieToPrint extends Component {
  state = {
    userObj: null,
    orderObj: null,
  };
  componentDidMount = async () => {
    this.props.getAllCustomerLoansRedux();
  };

  render() {
    const { allCustomers } = this.props;
    let dueCustomers = allCustomers.filter((customer) => customer.amount > 0);
    let date = new Date();

    let totalCustomerDue = 0;
    dueCustomers.map((customer) => {
      totalCustomerDue += parseInt(customer.amount);
    });

    return (
      <div
        id="container"
        className="container-div"
        style={{
          maxWidth: "1000px",
          borderRadius: ".2rem",
          border: "1px solid gainsboro",
        }}
      >
        <section id="memo" style={{ height: "165px" }}>
          <div className="logo">
            <img src={Alg} style={{ filter: "brightness(0.1)" }} />
          </div>

          <div className="company-info">
            <div style={{ color: "black" }}>ALG International Trading</div>
            <span style={{ marginTop: 5, color: "#333" }}>
              37/2 Pritom-Zaman Tower, Ground floor, Shop-8 &nbsp;
            </span>{" "}
            <br />
            <span style={{ color: "#333" }}>
              Culvert Road, Dhaka-1000. Bangladesh
            </span>
            <br />
            <span style={{ color: "#333" }}>Hotline: 01885994310,</span>
            <span style={{ color: "#333" }}>info@alglimited.com</span>
          </div>
        </section>

        <section>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginLeft: 35,
              marginTop: 10,
              marginRight: 35,
            }}
          >
            <div>
              <div style={{ fontWeight: "bold", color: "black" }}>
                Customer Due
              </div>
              <div style={{ color: "#333" }}>
                Print Date:{" "}
                <span style={{ fontWeight: "bold", color: "black" }}>
                  {date.toLocaleDateString("en-GB")}
                </span>
              </div>

              <div style={{ color: "#333" }}>
                Currency:{" "}
                <span style={{ fontWeight: "bold", color: "black" }}>BDT</span>
              </div>
            </div>
            <div>
              <div style={{ fontWeight: "bold", color: "black" }}>
                {this.props.match.params.month} Summary
              </div>
              <div style={{ color: "#333" }}>
                Total Customer Due:{" "}
                <span style={{ fontWeight: "bold", color: "black" }}>
                  {totalCustomerDue}Tk
                </span>
              </div>
              <div style={{ color: "#333" }}>
                As of Date:{" "}
                <span style={{ fontWeight: "bold", color: "black" }}>
                  {date.toLocaleDateString("en-GB")}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="clearfix"></div>

        <div className="clearfix"></div>

        <section id="items" style={{ marginTop: 15 }}>
          <table cellPadding="0" cellSpacing="0">
            <tbody>
              <tr>
                <th className="t-header">#</th>
                <th className="t-header" style={{ maxWidth: "50px" }}>
                  As of Date
                </th>
                <th className="t-header">Customer Name</th>
                <th className="t-header">Total Due</th>
              </tr>
              {dueCustomers.length > 0 &&
                dueCustomers.map((customer, index) => (
                  <tr data-iterate="item">
                    <td
                      className="t-data"
                      style={{
                        borderBottom:
                          index + 1 == dueCustomers.length
                            ? "1px solid black"
                            : "none",
                      }}
                    >
                      {index + 1}
                    </td>
                    <td
                      className="t-data"
                      style={{
                        borderBottom:
                          index + 1 == dueCustomers.length
                            ? "1px solid black"
                            : "none",
                      }}
                    >
                      {date.toLocaleDateString("en-GB")}
                    </td>
                    <td
                      className="t-data"
                      style={{
                        maxWidth: "50px",
                        borderBottom:
                          index + 1 == dueCustomers.length
                            ? "1px solid black"
                            : "none",
                      }}
                    >
                      {customer.customer}
                    </td>
                    <td
                      className="t-data"
                      style={{
                        borderBottom:
                          index + 1 == dueCustomers.length
                            ? "1px solid black"
                            : "none",
                      }}
                    >
                      {parseInt(customer.amount)}Tk
                    </td>
                  </tr>
                ))}
              <div style={{ marginBottom: 40 }}></div>
            </tbody>
          </table>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    allCustomers: state.loans.allCustomers,
  };
};
export default withRouter(
  connect(mapStateToProps, { getAllCustomerLoansRedux })(OnlyInvoieToPrint)
);
