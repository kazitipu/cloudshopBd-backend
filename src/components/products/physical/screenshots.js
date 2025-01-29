import React, { Component, Fragment } from "react";
import Breadcrumb from "../../common/breadcrumb";
import "react-toastify/dist/ReactToastify.css";
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import { ToastContainer, toast } from "react-toastify";
import CountUp from "react-countup";
import { connect } from "react-redux";
import { DollarSign } from "react-feather";
import {
  getAllScreenShotRedux,
  uploadScreenShotRedux,
  updateScreenShotRedux,
  deleteScreenShotRedux,
} from "../../../actions";
import {
  uploadImageRechargeRequest,
  getFreeShipping,
  uploadfreeShipping,
} from "../../../firebase/firebase.utils";
import man from "./plus image.jpeg";
import { Search } from "react-feather";
export class Screenshots extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      productObj: null,
      loading: false,
      imageUrl: man,
      imageUrl2: man,
      file: "",
      checkedValues: [],
      searchFor: "",
    };
  }

  componentDidMount = async () => {
    this.props.getAllScreenShotRedux();
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
      console.log(imgUrl);

      this.setState({
        imageUrl: imgUrl,
      });
      console.log(imageUrl);
      this.setState({ loading: false });
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

  handleSubmit = async () => {
    let date = new Date();

    if (this.state.loading) {
      alert("Please wait.. your image is uploading");
      return;
    }
    if (this.state.type === "upload") {
      let brandObj = {
        id: date.getTime().toString(),
        name: this.state.name,
        imageUrl: this.state.imageUrl,
      };

      await this.props.uploadScreenShotRedux(brandObj);
    } else if (this.state.type === "update") {
      let brandObj = {
        id: this.state.id,
        name: this.state.name,
        imageUrl: this.state.imageUrl,
      };
      await this.props.updateScreenShotRedux(brandObj);
    }
    this.setState({
      id: "",
      name: "",
      loading: false,
      imageUrl: man,
      file: "",
    });
  };

  render() {
    const { open, productObj } = this.state;
    const { screenshots } = this.props;

    let renderableScreenshots = screenshots;
    if (this.state.searchFor) {
      renderableScreenshots = screenshots.filter((screenshot) =>
        screenshot.name
          .toLowerCase()
          .includes(this.state.searchFor.toLowerCase())
      );
    }

    console.log(this.props);
    return (
      <Fragment>
        <Breadcrumb title={"ScrrenShots"} parent="Products" />
        {/* <!-- Container-fluid starts--> */}
        <div className="container-fluid">
          <div className="row" style={{ justifyContent: "center" }}>
            <div className="col-sm-12">
              <div className="card">
                <div
                  className="card-header"
                  style={{
                    borderBottom: "1px solid gainsboro",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <h5>
                      <i
                        className="icofont-layout"
                        style={{
                          fontSize: "130%",
                          marginRight: "5px",
                          color: "#00254c",
                        }}
                      ></i>
                      Review Screenshots <br />
                    </h5>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
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
                              placeholder="Search by Customer"
                              style={{ paddingLeft: 10 }}
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
                      <li>
                        {" "}
                        <button
                          className="btn"
                          data-toggle="modal"
                          data-target="#personalInfoModal"
                          style={{
                            backgroundColor: "rgb(0, 37, 76)",
                            border: "none",
                            color: "white",
                            fontSize: 11,
                          }}
                          onClick={() => {
                            this.setState({
                              id: "",
                              name: "",
                              productObj: null,
                              loading: false,
                              imageUrl: man,
                              file: "",
                              type: "upload",
                            });
                          }}
                        >
                          Add New ScreenShot
                        </button>
                      </li>
                    </div>
                  </div>
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
                              maxWidth: "150px",
                              minWidth: "150px",
                            }}
                          >
                            ScreenShot
                          </th>
                          <th
                            scope="col"
                            style={{
                              padding: "30px 15px",
                              color: "white",
                              backgroundColor: "#00254c",
                              maxWidth: "150px",
                              minWidth: "150px",
                            }}
                          >
                            Customer Name
                          </th>

                          <th
                            scope="col"
                            style={{
                              padding: "30px 15px",
                              color: "white",
                              backgroundColor: "#00254c",
                            }}
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {renderableScreenshots.map((screenshot, index) => (
                          <tr key={index}>
                            <td>
                              <a href={screenshot.imageUrl} target="_blank">
                                <img
                                  style={{ height: 120, width: 70 }}
                                  src={screenshot.imageUrl || man}
                                />
                              </a>
                            </td>
                            <td>{screenshot.name}</td>

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
                                      id: screenshot.id,
                                      name: screenshot.name,
                                      imageUrl: screenshot.imageUrl
                                        ? screenshot.imageUrl
                                        : this.state.imageUrl,

                                      type: "update",
                                      productObj: screenshot,
                                    });
                                  }}
                                  style={{
                                    color: "green",
                                    marginRight: 8,
                                    cursor: "pointer",
                                  }}
                                />{" "}
                                <i
                                  className="icofont-trash"
                                  data-toggle="modal"
                                  data-target="#deleteExpenseModal"
                                  onClick={() => {
                                    this.setState({
                                      productObj: screenshot,
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
                  {productObj ? "Update" : "Add New"} Screenshot
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
                      Customer Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleChange}
                      id="exampleFormControlInput1"
                      placeholder="Enter Customer name"
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
                      ScreenShot
                    </label>
                    <div
                      className="box-input-file"
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    >
                      {this.state.loading ? (
                        <div
                          className="spinner-border text-light mt-3 ml-2"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        <>
                          <img
                            className="img-50 lazyloaded blur-up"
                            src={this.state.imageUrl}
                            alt="#"
                            style={{
                              zIndex: 10,
                              cursor: "pointer",
                              border: "1px solid gainsboro",
                              borderRadius: 5,
                              minHeight: 50,
                              maxHeight: 50,
                            }}
                            onClick={() => {
                              document
                                .getElementById("upload-image-input")
                                .click();
                            }}
                          />

                          <input
                            id="upload-image-input"
                            className="upload"
                            type="file"
                            style={{
                              position: "absolute",
                              zIndex: 5,
                              maxWidth: "50px",
                              marginTop: "10px",
                            }}
                            onChange={(e) => this._handleImgChange(e, 0)}
                          />
                        </>
                      )}
                    </div>
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
                  {productObj ? "UPDATE" : "ADD"} SCREENSHOT
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
                  Delete ScreenShot
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
                  <div>Are you sure you want to delete this ScreenShot?</div>
                </div>
                <table className="table table-bordered table-striped table-hover">
                  <thead>
                    <tr></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {productObj && (
                          <img
                            style={{ height: 70, width: 70 }}
                            src={productObj.imageUrl}
                          />
                        )}
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
                    this.props.deleteScreenShotRedux(productObj.id);
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
    screenshots: state.brands.screenshots,
  };
};

export default connect(mapStateToProps, {
  getAllScreenShotRedux,
  updateScreenShotRedux,
  uploadScreenShotRedux,
  deleteScreenShotRedux,
})(Screenshots);
