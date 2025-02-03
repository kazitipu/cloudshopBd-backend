"use client";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getSingleOrderRedux } from "../../actions/index";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ClipLoader } from "react-spinners";
import "./invoice.css";
import logo from "./cloudshopBD.png";
const Invoice = ({ orders, getSingleOrderRedux, match }) => {
  const [loader, setLoader] = useState(false);
  const orderId = match.params.orderId;
  console.log(match);
  useEffect(() => {
    const getOrder = async () => {
      if (orders && orders.length == 0) {
        await getSingleOrderRedux(orderId);
      }
    };
    getOrder();
  }, []);

  const singleProductTotal = (product) => {
    let total = parseInt(getPrice4(product)) * product.quantity;
    return total;
  };
  const singleProductTotal2 = (product) => {
    let total = parseInt(getPrice3(product)) * product.quantity;
    return total;
  };

  const getPrice3 = (product) => {
    if (product.selectedVariation && product.selectedVariation.id) {
      return product.selectedVariation.price;
    } else {
      if (product.product) {
        return product.product.price;
      } else {
        return 0;
      }
    }
  };

  const getPrice4 = (product) => {
    if (product.selectedVariation && product.selectedVariation.id) {
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
  // download pdf te image ashe na cors policy er karone request http://localhost theke jay ejonno.https:// request hole maybe thik hobe otherwise cors policy change korte hobe in firebase othobar node js server theke image fetch kore oi image use korte hobe in img src
  const downloadPDF = async () => {
    setLoader(true);
    const invoiceElement = document.getElementById("invoice");
    const images = invoiceElement.querySelectorAll("img");
    const promises = Array.from(images).map((img) => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve(); // Image is already loaded
        } else {
          img.onload = resolve;
        }
      });
    });
    await Promise.all(promises);
    const canvas = await html2canvas(invoiceElement);
    const imgData = canvas.toDataURL("image/jpg");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice.pdf");
    setLoader(false);
  };

  //   const downloadPDF = () => {
  //     setLoader(true);

  //     const invoiceElement = document.getElementById("invoice");

  //     // Wait for all images to load
  //     const images = invoiceElement.querySelectorAll("img");
  //     const promises = Array.from(images).map((img) => {
  //       return new Promise((resolve) => {
  //         if (img.complete) {
  //           resolve(); // Image is already loaded
  //         } else {
  //           img.onload = resolve;
  //         }
  //       });
  //     });

  //     // Wait for all images to load
  //     Promise.all(promises).then(() => {
  //       html2pdf()
  //         .from(invoiceElement)
  //         .save("invoice.pdf")
  //         .then(() => {
  //           setLoader(false);
  //         });
  //     });
  //   };

  let order = null;
  if (orders.length > 0) {
    order = orders.find((order) => order.id == orderId);
  }
  console.log(order);
  console.log(orders);
  return (
    <div className="wrapper-invoice">
      <section className="invoice-section">
        <div className="cus-container2">
          <div className="top">
            <div
              className="tf-btn btn-fill animate-hover-btn"
              onClick={downloadPDF}
              style={{
                padding: 10,
                background: "black",
                borderRadius: 5,
                color: "white",
                display: "inline-block",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center", // Horizontally centers the content
                  alignItems: "center", // Vertically centers the content
                  minWidth: 170,
                  height: "100%", // Optional: Ensures the spinner is vertically centered if the parent div has a fixed height
                  cursor: "pointer",
                }}
              >
                {loader ? (
                  <ClipLoader loading={loader} size={19} color="white" />
                ) : (
                  "Download Invoice"
                )}
              </div>
            </div>
          </div>
          {order && (
            <div className="box-invoice" id="invoice">
              <div
                className="header"
                style={{ paddingTop: 100, background: "white" }}
              >
                <div className="wrap-top" style={{ marginBottom: 40 }}>
                  <div className="box-left">
                    <a href="index.html">
                      <img src={logo} alt="logo" className="logo" />
                    </a>
                  </div>
                  <div className="box-right">
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                      <div className="title" style={{ marginTop: 20 }}>
                        Invoice #{order.id}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="wrap-date" style={{ marginBottom: 30 }}>
                  <div className="box-left">
                    <label htmlFor="">Order date:</label>
                    <span className="date">
                      {" "}
                      {new Date(Number(order.date)).toLocaleDateString()}
                      {"   "}
                      &nbsp;{new Date(Number(order.date)).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="box-right">
                    <label htmlFor="">Delivery:</label>
                    <span
                      style={{
                        backgroundColor: "cadetblue",
                        color: "white",
                        display: "inline",
                        padding: 2,
                        paddingLeft: 5,
                        paddingRight: 5,
                        fontWeight: "lighter",
                        fontSize: 12,
                        borderRadius: 2,
                      }}
                    >
                      {" "}
                      Regular delivery
                    </span>
                  </div>
                </div>
                <div className="wrap-info">
                  {order.currentUser ? (
                    <div className="box-left">
                      <div className="title" style={{ marginBottom: 0 }}>
                        Delivery Address
                      </div>
                      <div className="sub">
                        {" "}
                        {
                          order.currentUser.address.find(
                            (address) => address.defaultShipping
                          ).fullName
                        }
                      </div>
                      <p className="desc">
                        {
                          order.currentUser.address.find(
                            (address) => address.defaultShipping
                          ).mobileNo
                        }
                        <br />{" "}
                        {
                          order.currentUser.address.find(
                            (address) => address.defaultShipping
                          ).address
                        }
                        <br />{" "}
                        {
                          order.currentUser.address.find(
                            (address) => address.defaultShipping
                          ).district
                        }
                        ,{" "}
                        {
                          order.currentUser.address.find(
                            (address) => address.defaultShipping
                          ).division
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="box-left">
                      <div className="title" style={{ marginBottom: 0 }}>
                        Delivery Address
                      </div>
                      <div className="sub">
                        {
                          order.guest.address.find(
                            (address) => address.defaultShipping
                          ).fullName
                        }
                      </div>
                      <p className="desc">
                        {
                          order.guest.address.find(
                            (address) => address.defaultShipping
                          ).mobileNo
                        }
                        <br />
                        {
                          order.guest.address.find(
                            (address) => address.defaultShipping
                          ).address
                        }
                        <br />{" "}
                        {
                          order.guest.address.find(
                            (address) => address.defaultShipping
                          ).district
                        }
                        ,{" "}
                        {
                          order.guest.address.find(
                            (address) => address.defaultShipping
                          ).division
                        }
                      </p>
                    </div>
                  )}
                </div>
                <div className="wrap-table-invoice">
                  <table className="invoice-table">
                    <thead>
                      <tr className="title">
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>

                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orders.map((item, index) => (
                        <tr className="content" key={index}>
                          <td
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "flex-start",
                              borderBottom: 0,
                              paddingTop: 10,
                              paddingBottom: 10,
                            }}
                          >
                            {" "}
                            <img
                              alt="product"
                              src={
                                item.selectedVariation &&
                                item.selectedVariation.id &&
                                item.selectedVariation.pictures &&
                                item.selectedVariation.pictures.length > 0
                                  ? item.selectedVariation.pictures[0]
                                  : item.product.pictures[0]
                              }
                              style={{
                                objectFit: "cover",
                                borderRadius: 5,
                                height: 80,
                                width: 80,
                                border: "1px solid gainsboro",
                              }}
                            />
                            <div style={{ marginLeft: 10 }}>
                              {item.product.name.slice(0, 30)}{" "}
                              <span className="variant">
                                {" "}
                                {item.selectedVariation &&
                                  item.selectedVariation.id &&
                                  item.selectedVariation.combination.map(
                                    (comb, index) => (
                                      <div
                                        key={index}
                                        style={{ marginTop: -8, fontSize: 12 }}
                                      >
                                        {item.product.savedAttributes.find(
                                          (attr) => attr.id == comb.parentId
                                        )
                                          ? item.product.savedAttributes.find(
                                              (attr) => attr.id == comb.parentId
                                            ).name
                                          : ""}
                                        :{" "}
                                        <span style={{ fontWeight: "bold" }}>
                                          {comb.name}
                                        </span>
                                      </div>
                                    )
                                  )}
                              </span>
                            </div>
                          </td>
                          <td
                            style={{
                              textAlign: "start",
                              verticalAlign: "top",
                              borderBottom: 0,
                              paddingTop: 10,
                              paddingBottom: 10,
                            }}
                          >
                            {item.quantity}
                          </td>
                          <td
                            style={{
                              textAlign: "start",
                              verticalAlign: "top",
                              borderBottom: 0,
                              paddingTop: 10,
                              paddingBottom: 10,
                            }}
                          >
                            <span className="price">
                              ৳{getPrice4(item)} <br />
                              <span
                                style={{
                                  fontWeight: "lighter",
                                  fontSize: 11,
                                  textDecoration: "line-through",
                                  marginLeft: 5,
                                }}
                              >
                                ৳{getPrice3(item)}
                              </span>
                            </span>
                          </td>

                          <td
                            style={{
                              textAlign: "start",
                              verticalAlign: "top",
                              borderBottom: 0,
                              paddingTop: 10,
                              paddingBottom: 10,
                            }}
                          >
                            {" "}
                            <span
                              className="price"
                              style={{ fontWeight: "bold" }}
                            >
                              ৳{singleProductTotal(item)} <br />
                              <span
                                style={{
                                  fontWeight: "lighter",
                                  fontSize: 11,
                                  textDecoration: "line-through",
                                  marginLeft: 5,
                                }}
                              >
                                ৳{singleProductTotal2(item)}
                              </span>
                            </span>
                          </td>
                        </tr>
                      ))}
                      <tr
                        className="content"
                        style={{ borderTop: "1px solid gainsboro" }}
                      >
                        <td
                          className="total"
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: "1px solid gainsboro",
                          }}
                        >
                          Subtotal
                        </td>
                        <td
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: "1px solid gainsboro",
                          }}
                        />
                        <td
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: "1px solid gainsboro",
                          }}
                        />
                        <td
                          className="total"
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: "1px solid gainsboro",
                          }}
                        >
                          {" "}
                          ৳ {order.subTotal}
                        </td>
                      </tr>
                      <tr className="content">
                        <td
                          className="total"
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: "1px solid gainsboro",
                          }}
                        >
                          Discount Applied
                        </td>
                        <td
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: "1px solid gainsboro",
                          }}
                        />
                        <td
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: "1px solid gainsboro",
                          }}
                        />
                        <td
                          className="total"
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: "1px solid gainsboro",
                          }}
                        >
                          -৳ {order.discountApplied}
                        </td>
                      </tr>
                      {order.couponApplied && (
                        <tr className="content">
                          <td
                            className="total"
                            style={{
                              paddingTop: 5,
                              paddingBottom: 5,
                              borderBottom: "1px solid gainsboro",
                            }}
                          >
                            Coupon Applied{" "}
                            <span
                              style={{
                                color: "white",
                                backgroundColor: "cadetblue",
                                fontSize: 9,
                                borderRadius: 5,
                                padding: "2px 5px",
                              }}
                            >
                              {order.couponApplied.name}
                            </span>
                            <span
                              style={{ fontSize: 12, color: "#ff8084" }}
                            ></span>
                          </td>
                          <td
                            style={{
                              paddingTop: 5,
                              paddingBottom: 5,
                              borderBottom: "1px solid gainsboro",
                            }}
                          />
                          <td
                            style={{
                              paddingTop: 5,
                              paddingBottom: 5,
                              borderBottom: "1px solid gainsboro",
                            }}
                          />
                          <td
                            className="total"
                            style={{
                              paddingTop: 5,
                              paddingBottom: 5,
                              borderBottom: "1px solid gainsboro",
                            }}
                          >
                            -৳ {order.couponApplied.discount}
                          </td>
                        </tr>
                      )}
                      <tr className="content">
                        <td
                          className="total"
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: "1px solid gainsboro",
                          }}
                        >
                          Delivery Charge
                        </td>
                        <td
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: "1px solid gainsboro",
                          }}
                        />
                        <td
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: "1px solid gainsboro",
                          }}
                        />
                        <td
                          className="total"
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: "1px solid gainsboro",
                          }}
                        >
                          +৳ {order.deliveryCharge}
                        </td>
                      </tr>
                      <tr className="content">
                        <td
                          className="total"
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            fontWeight: "bold",
                          }}
                        >
                          Total Bill
                        </td>
                        <td
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                          }}
                        />
                        <td
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                          }}
                        />
                        <td
                          className="total"
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            fontWeight: "bold",
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
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div
                className="footer"
                style={{
                  background: "white",
                  borderTop: "1px solid gainsboro",
                  color: "#ec345b",
                }}
              >
                <ul className="box-contact">
                  <li>www.cloudshopbd.com</li>
                  <li>invoice@cloudshopbd.com</li>
                  <li>+8801707773082</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    orders: state.orders.orders,
  };
};
export default connect(mapStateToProps, {
  getSingleOrderRedux,
})(Invoice);
