import React, { Component, Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import Modal from "react-responsive-modal";
import "react-toastify/dist/ReactToastify.css";
import data from "../../../assets/data/category";
import Datatable from "../../common/datatable";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  getAllProductsRedux,
  getAllCategoriesRedux,
  deleteProductRedux,
  setAllProductsRedux,
  getSingleBrandProductsRedux,
} from "../../../actions";
import { connect } from "react-redux";
import Product_list from "./product-list";
import { Search } from "react-feather";
import "./add-aliexpress-product.css";
import { ClipLoader } from "react-spinners";
import { fetchAllProducts } from "../../../firebase/firebase.utils";
const algoliasearch = require("algoliasearch");

// the algoliasearch version is different from user panel so the syntax and api is also different. here using admin api. but in user panel using search api
const client = algoliasearch("NILPZSAV6Q", "f8dd9476cf54f47a7e1594f3f3b238cb");
const index = client.initIndex("products");
class AllProductsByBrand extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      checkedValues: [],
      productObj: null,
      totalProducts: 0,
      page: 1,
      loading: false,
      loader: false,
      products: [],
      searchFor: "",
      searchFor2: "",
      nbHits: 0,
      algolia: false,
      hasUpdated: false,
    };
  }

  componentDidMount = async () => {
    const { id } = this.props.match.params;
    this.setState({
      loading: true,
    });
    await this.props.getSingleBrandProductsRedux(id);
    this.setState({
      loading: false,
    });
  };

  componentWillReceiveProps = async (nextProps) => {
    this.setState({
      loading: true,
    });
    console.log(this.props.match.params.id);
    console.log(nextProps.match.params.id);
    console.log(this.state.hasUpdated);
    if (this.props.match.params.id !== nextProps.match.params.id) {
      await this.props.getSingleBrandProductsRedux(nextProps.match.params.id);
    }
    this.setState({
      loading: false,
    });
  };

  selectRow = (e, i) => {
    if (!e.target.checked) {
      this.setState({
        checkedValues: this.state.checkedValues.filter((item, j) => i !== item),
        selectAll: false,
      });
    } else {
      this.state.checkedValues.push(i);
      this.setState(
        {
          checkedValues: this.state.checkedValues,
        },
        () => {
          console.log(this.state.checkedValues);
        }
      );
    }
  };

  getPrice = (product) => {
    if (product.displayedVariations.length > 0) {
      if (product.displayedVariations[0].salePrice == 0) {
        return <div>{product.displayedVariations[0].price}Tk</div>;
      } else {
        return (
          <div>
            <del>{product.displayedVariations[0].price}Tk</del> <br />
            <div>{product.displayedVariations[0].salePrice}Tk</div>{" "}
          </div>
        );
      }
    } else {
      if (product.salePrice == 0) {
        return <div>{product.price}Tk</div>;
      } else {
        return (
          <div>
            <del>{product.price}Tk</del> <br />
            <div>{product.salePrice}Tk</div>{" "}
          </div>
        );
      }
    }
  };

  render() {
    const { allProducts } = this.props;
    const { productObj, loader, products, nbHits, searchFor } = this.state;
    console.log(this.props);
    let renderableProducts = allProducts;
    if (searchFor) {
      renderableProducts = allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchFor.toLowerCase())
      );
    }
    const searchParams = new URLSearchParams(window.location.search);
    const brand = searchParams.get("name");
    return (
      <Fragment>
        {this.state.loading && (
          <div
            style={{
              height: "100%",
              width: "100%",
              zIndex: "999",
              backgroundColor: "white",
              position: "absolute",
            }}
          >
            <div
              className="text-center align-items-center"
              style={{ marginTop: "300px" }}
            >
              <div
                className="spinner-grow "
                role="status"
                style={{
                  width: "4rem",
                  height: "4rem",
                  zIndex: "1000",
                  color: "#ff8084",
                }}
              >
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        )}
        <Breadcrumb title={brand} parent="Products" />
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
                  <div className="col">
                    <h5>
                      <i
                        className="icofont-layout"
                        style={{
                          fontSize: "130%",
                          marginRight: "5px",
                          color: "#00254c",
                        }}
                      ></i>
                      {brand}
                    </h5>
                    <div>
                      <span style={{ color: "#2271b1", cursor: "pointer" }}>
                        Total Products
                      </span>
                      ({allProducts.length})
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      marginTop: 5,
                      position: "relative",
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
                        marginBottom: "7px",
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
                            placeholder="Search Product"
                            style={{ paddingLeft: 10 }}
                            onChange={async (e) => {
                              let value = e.target.value;
                              this.setState({
                                searchFor: value,
                              });
                            }}
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
                    <li>
                      <button
                        className="btn"
                        style={{
                          backgroundColor: "rgb(0, 37, 76)",
                          border: "none",
                          color: "white",
                          fontSize: 11,
                        }}
                        onClick={() => {
                          this.props.history.push(
                            "/products/physical/add-product"
                          );
                        }}
                      >
                        Add New
                      </button>
                    </li>
                  </div>
                </div>

                <div className="card-body">
                  <div className="clearfix"></div>
                  <div id="basicScenario" className="product-physical">
                    {this.state.checkedValues.length > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          background: "#1A73E8",
                          width: "100%",
                          borderRadius: "5px",
                          justifyContent: "flex-start",
                          padding: 10,
                        }}
                      >
                        <div
                          style={{
                            alignSelf: "center",
                          }}
                        >
                          <i
                            className="icofont-close-line"
                            onClick={() => {
                              this.setState({
                                selectAll: false,
                                checkedValues: [],
                              });
                            }}
                            style={{
                              color: "white",
                              cursor: "pointer",
                              fontSize: "25px",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            color: "white",
                            alignSelf: "center",
                            marginLeft: 20,
                          }}
                        >
                          {this.state.checkedValues.length} selected
                        </div>
                        <div
                          style={{
                            width: "1px",
                            height: "25px",
                            background: "white",
                            alignSelf: "center",
                            marginLeft: 40,
                          }}
                        ></div>
                        <div
                          style={{
                            color: "white",
                            alignSelf: "center",
                            marginLeft: 40,
                            padding: "5px 10px",
                            border: "1px solid white",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                          data-toggle="modal"
                          data-target="#deleteExpenseModal2"
                        >
                          Delete
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: 26.5 }}></div>
                    )}
                    <table className="table table-bordered table-striped table-hover">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            style={{
                              padding: "15px",
                              color: "white",
                              backgroundColor: "#00254c",
                              minWidth: "50px",
                              maxWidth: "50px",
                            }}
                          >
                            <div>
                              <span
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  name={"selectAll"}
                                  checked={this.state.selectAll}
                                  onChange={(e) =>
                                    this.setState(
                                      {
                                        selectAll: !this.state.selectAll,
                                      },
                                      () => {
                                        if (this.state.selectAll) {
                                          this.setState(
                                            {
                                              checkedValues: allProducts.map(
                                                (product) => {
                                                  return product.id;
                                                }
                                              ),
                                            },
                                            () => {
                                              console.log(
                                                this.state.checkedValues
                                              );
                                            }
                                          );
                                        } else {
                                          this.setState({
                                            checkedValues: [],
                                          });
                                        }
                                      }
                                    )
                                  }
                                  style={{
                                    height: 20,
                                    width: 20,
                                  }}
                                />
                              </span>
                            </div>
                          </th>

                          <th
                            scope="col"
                            style={{
                              padding: "15px",
                              color: "white",
                              backgroundColor: "#00254c",
                              minWidth: "80px",
                              maxWidth: "80px",
                            }}
                          >
                            Image
                          </th>
                          <th
                            scope="col"
                            style={{
                              padding: "15px",
                              color: "white",
                              backgroundColor: "#00254c",
                              minWidth: "150px",
                              maxWidth: "150px",
                            }}
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            style={{
                              padding: "15px",
                              color: "white",
                              backgroundColor: "#00254c",
                              minWidth: "100px",
                              maxWidth: "100px",
                            }}
                          >
                            Stock
                          </th>

                          <th
                            scope="col"
                            style={{
                              padding: "15px",
                              color: "white",
                              backgroundColor: "#00254c",
                              minWidth: "100px",
                              maxWidth: "100px",
                            }}
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            style={{
                              padding: "15px",
                              color: "white",
                              backgroundColor: "#00254c",
                              minWidth: "100px",
                              maxWidth: "100px",
                            }}
                          >
                            Category
                          </th>
                          <th
                            scope="col"
                            style={{
                              padding: "15px",
                              color: "white",
                              backgroundColor: "#00254c",
                              minWidth: "100px",
                              maxWidth: "100px",
                            }}
                          >
                            Tags
                          </th>
                          <th
                            scope="col"
                            style={{
                              padding: "15px",
                              color: "white",
                              backgroundColor: "#00254c",
                              minWidth: "100px",
                              maxWidth: "100px",
                            }}
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            style={{
                              padding: "15px",
                              color: "white",
                              backgroundColor: "#00254c",
                              minWidth: "100px",
                              maxWidth: "100px",
                            }}
                          >
                            Brands
                          </th>
                          <th
                            scope="col"
                            style={{
                              padding: "15px",
                              color: "white",
                              backgroundColor: "#00254c",
                              minWidth: "150px",
                              maxWidth: "150px",
                            }}
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {renderableProducts.map((product, index) => (
                          <tr key={index} style={{ height: 120 }}>
                            <th scope="row">
                              <div>
                                <span
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    name={product.id}
                                    checked={this.state.checkedValues.includes(
                                      product.id
                                    )}
                                    style={{
                                      height: 20,
                                      width: 20,
                                    }}
                                    onChange={(e) =>
                                      this.selectRow(e, product.id)
                                    }
                                  />
                                </span>
                              </div>
                            </th>

                            <td>
                              {" "}
                              <img
                                className="img-50 lazyloaded blur-up"
                                src={product.pictures[0]}
                                alt="#"
                                style={{
                                  cursor: "pointer",
                                  height: 50,
                                  width: 50,
                                }}
                              />
                            </td>
                            <td>
                              <div
                                style={{
                                  minWidth: "150px",
                                  maxWidth: "150px",
                                  color: "#2271B1",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  this.props.history.push(
                                    `/products/physical/add-product/${product.id}`
                                  );
                                }}
                              >
                                {product.name}{" "}
                              </div>

                              <span>
                                {product.published !== "Published" &&
                                  `--${product.published}`}
                              </span>
                            </td>
                            <td
                              style={{
                                color:
                                  product.stockStatus == "In stock"
                                    ? "#7ad03a"
                                    : "#a44",
                                fontWeight: "bold",
                              }}
                            >
                              {product.stockStatus}
                            </td>
                            <td>{this.getPrice(product)}</td>
                            <td
                              style={{
                                color: "#2271B1",
                                cursor: "pointer",
                              }}
                            >
                              {product.selectedCategories.map(
                                (value, index) => {
                                  return (
                                    <div
                                      key={index}
                                      onClick={() => {
                                        this.setState({
                                          hasUpdated: false,
                                        });
                                        localStorage.setItem(
                                          "category",
                                          JSON.stringify(value)
                                        );
                                        this.props.history.push(
                                          `/products/physical/categories/${value.id}`
                                        );
                                      }}
                                    >
                                      {value.name},
                                    </div>
                                  );
                                }
                              )}
                            </td>
                            <td
                              style={{
                                color: "#2271B1",
                                cursor: "pointer",
                              }}
                            >
                              {product.selectedTags.length > 0
                                ? product.selectedTags.map(
                                    (value) => `${value},`
                                  )
                                : "—"}
                            </td>

                            <td
                              style={{
                                minWidth: "100px",
                                maxWidth: "100px",
                              }}
                            >
                              {product.edited ? "Modified" : "Publised"}{" "}
                              {product.publishedOn}
                            </td>
                            <td
                              style={{
                                color: "#2271B1",
                                cursor: "pointer",
                              }}
                            >
                              {product.selectedBrands.map(
                                (brand) => `${brand.name},`
                              )}
                            </td>
                            <td>
                              <div
                                className="row"
                                style={{ justifyContent: "center" }}
                              >
                                <i
                                  className="icofont-edit"
                                  onClick={() => {
                                    this.props.history.push(
                                      `/products/physical/add-product/${product.id}`
                                    );
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
                                  data-target="#deleteExpenseModal"
                                  onClick={() => {
                                    this.setState({
                                      productObj: product,
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
              style={{ top: 10, width: "95%", margin: "auto" }}
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
                  {productObj ? "Update" : "Add New"} Attribute
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
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleChange}
                      id="exampleFormControlInput1"
                      placeholder="Enter attribute name"
                      style={{
                        borderColor: "gainsboro",
                        borderRadius: 5,
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label
                      style={{
                        fontWeight: "bold",
                        color: "#505050",
                        marginBottom: 5,
                      }}
                    >
                      Slug
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="slug"
                      value={this.state.slug}
                      onChange={this.handleChange}
                      id="exampleFormControlInput1"
                      placeholder="Enter slug name"
                      style={{
                        borderColor: "gainsboro",
                        borderRadius: 5,
                      }}
                    />
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
                    this.handleSubmit();
                  }}
                >
                  {productObj ? "UPDATE" : "ADD"} Attribute
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="InvoiceInfoModal"
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
              style={{ top: 10, width: "95%", margin: "auto" }}
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
                  Sell
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
                      SELECT CUSTOMER
                    </label>
                    <input
                      title="Please choose a package"
                      style={{ padding: 18 }}
                      type="text"
                      name="customer"
                      className="form-control"
                      placeholder="Enter customer Id"
                      aria-required="true"
                      aria-invalid="false"
                      onChange={this.handleChangeCustomer}
                      value={this.state.customer}
                      required
                      autoComplete="off"
                      onKeyDown={this.handleKeyDown}
                    />
                    {this.state.customer && (
                      <ul
                        className="below-searchbar-recommendation"
                        style={{
                          display: this.state.showSuggestion ? "flex" : "none",
                          zIndex: 11,
                        }}
                      >
                        {this.renderShowSuggestion()}
                      </ul>
                    )}
                  </div>
                  <div className="form-group">
                    <label
                      style={{
                        fontWeight: "bold",
                        color: "#505050",
                        marginBottom: 5,
                      }}
                    >
                      PRODUCT IMAGE
                    </label>
                    <div
                      className="box-input-file"
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    >
                      <>
                        <img
                          className="img-100 lazyloaded blur-up"
                          src={this.state.imageUrl}
                          alt="#"
                          style={{
                            zIndex: 10,
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            document
                              .getElementById("upload-image-input")
                              .click();
                          }}
                        />
                      </>
                    </div>
                  </div>
                  <div className="form-group">
                    <label
                      style={{
                        fontWeight: "bold",
                        color: "#505050",
                        marginBottom: 5,
                      }}
                    >
                      PRODUCT NAME
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleChange}
                      id="exampleFormControlInput1"
                      placeholder="Product Name"
                      style={{
                        borderColor: "gainsboro",
                        borderRadius: 5,
                      }}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label
                      style={{
                        fontWeight: "bold",
                        color: "#505050",
                        marginBottom: 5,
                      }}
                    >
                      DESCRIPTION
                    </label>
                    <textarea
                      type="text"
                      className="form-control"
                      name="description"
                      value={this.state.description}
                      onChange={this.handleChange}
                      id="exampleFormControlInput1"
                      placeholder="Ex: size, color, other details etc"
                      style={{
                        borderColor: "gainsboro",
                        borderRadius: 5,
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label
                      style={{
                        fontWeight: "bold",
                        color: "#505050",
                        marginBottom: 5,
                      }}
                    >
                      QUANTITY
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="quantity"
                      onChange={this.handleChange}
                      value={this.state.quantity}
                      id="exampleFormControlInput1"
                      placeholder="Enter Product Quantity"
                      style={{
                        borderColor: "gainsboro",
                        borderRadius: 5,
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label
                      style={{
                        fontWeight: "bold",
                        color: "#505050",
                        marginBottom: 5,
                      }}
                    >
                      PRICE/QUANTITY
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="amount"
                      onChange={this.handleChange}
                      value={this.state.amount}
                      id="exampleFormControlInput1"
                      placeholder="Enter Amount"
                      style={{
                        borderColor: "gainsboro",
                        borderRadius: 5,
                      }}
                    />
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
                    this.handleGenerateNow();
                  }}
                >
                  Generate
                </button>
                <button
                  type="button"
                  className="btn "
                  data-dismiss="modal"
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    padding: 8,
                    borderRadius: 5,
                    fontWeight: "lighter",
                  }}
                  onClick={() => {
                    this.handlePayNow();
                  }}
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="deleteExpenseModal"
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
              style={{ top: 10, margin: "auto", minWidth: "140%" }}
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
                  Permanently Delete Product
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
                  <div>
                    Are you sure you want to permanently delete this product?
                  </div>
                </div>
                <table className="table table-bordered table-striped table-hover">
                  <thead>
                    <tr></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {" "}
                        <img
                          className="img-50 lazyloaded blur-up"
                          src={productObj && productObj.pictures[0]}
                          alt="#"
                          style={{
                            cursor: "pointer",
                            height: 50,
                            width: 50,
                          }}
                        />
                      </td>
                      <td>{productObj && productObj.name}</td>
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
                    this.props.deleteProductRedux(productObj.id);
                    this.setState({
                      selectAll: false,
                      checkedValues: [],
                    });
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="deleteExpenseModal2"
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
              style={{ top: 10, margin: "auto", minWidth: "140%" }}
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
                  Delete All Selected Products
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
                  <div>
                    Are you sure you want to permanently delete{" "}
                    {this.state.checkedValues.length} products?
                  </div>
                </div>
                <table className="table table-bordered table-striped table-hover">
                  <thead>
                    <tr></tr>
                  </thead>
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
                    this.state.checkedValues.map(async (id) => {
                      await this.props.deleteProductRedux(id);
                    });
                    this.setState({
                      selectAll: false,
                      checkedValues: [],
                    });
                  }}
                >
                  Yes
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
    allProducts: state.products.brandProducts,
    categories: state.categories.categories,
  };
};
export default connect(mapStateToProps, {
  getAllProductsRedux,
  getAllCategoriesRedux,
  deleteProductRedux,
  setAllProductsRedux,
  getSingleBrandProductsRedux,
})(AllProductsByBrand);
