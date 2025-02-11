import React, { Component, Fragment } from "react";
import Breadcrumb from "../../common/breadcrumb";
import "react-toastify/dist/ReactToastify.css";
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import { ToastContainer, toast } from "react-toastify";
import CountUp from "react-countup";
import { connect } from "react-redux";
import { DollarSign } from "react-feather";
import {
  getAllCampaignsRedux,
  uploadCampaignRedux,
  updateCampaignRedux,
  deleteCampaignRedux,
} from "../../../actions";
import { uploadImageRechargeRequest } from "../../../firebase/firebase.utils";
import man from "./plus image.jpeg";
import { Search } from "react-feather";
export class Campaigns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      slug: "",
      parentCategory: "",
      expiryDate: "",
      categoryId: "",
      productObj: null,
      loading: false,
      loading2: false,
      imageUrl: man,
      imageUrl2: man,
      file: "",
      checkedValues: [],
      selectAll: false,
      searchFor: "",
      visible: false,
    };
  }

  componentDidMount = async () => {
    this.props.getAllCampaignsRedux();
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
  _handleImgChange2 = async (e, i) => {
    e.preventDefault();
    const { currentAdmin } = this.props;

    let reader = new FileReader();
    let file = e.target.files[0];
    const { imageUrl2 } = this.state;

    reader.onloadend = () => {
      // imageUrl = reader.result;
      this.setState({
        file: file,
        imageUrl2,
      });
    };
    if (file) {
      this.setState({ loading2: true });
      reader.readAsDataURL(file);
      const imgUrl = await uploadImageRechargeRequest(file);
      console.log(imgUrl);

      this.setState({
        imageUrl2: imgUrl,
      });

      this.setState({ loading2: false });
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

    if (this.state.loading || this.state.loading2) {
      alert("Please wait.. your image is uploading");
      return;
    }
    if (this.state.type === "upload") {
      let campaignObj = {
        id: date.getTime().toString(),
        name: this.state.name,
        image: this.state.imageUrl,
        banner: this.state.imageUrl2,
        visible: this.state.visible,
        categoryId: this.state.categoryId,
        expiryDate: this.state.expiryDate,
      };

      await this.props.uploadCampaignRedux(campaignObj);
    } else if (this.state.type === "update") {
      let campaignObj = {
        id: this.state.id,
        name: this.state.name,
        image: this.state.imageUrl,
        banner: this.state.imageUrl2,
        visible: this.state.visible,
        categoryId: this.state.categoryId,
        expiryDate: this.state.expiryDate,
      };
      await this.props.updateCampaignRedux(campaignObj);
    }

    this.setState({
      id: "",
      name: "",
      slug: "",
      productObj: null,
      expiryDate: "",
      categoryId: "",
      loading: false,
      loading2: false,
      imageUrl: man,
      imageUrl2: man,
      file: "",
      checkedValues: [],
      selectAll: false,
    });
  };

  selectRow = (e, campaign) => {
    if (!e.target.checked) {
      this.props.updateCampaignRedux({ ...campaign, visible: false });
    } else {
      this.props.updateCampaignRedux({ ...campaign, visible: true });
    }
  };

  render() {
    const { open, productObj } = this.state;
    const { campaigns, currentAdmin } = this.props;
    console.log(this.props);
    return (
      <Fragment>
        <Breadcrumb title={"Campaigns"} parent="Products" />
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
                      className="icofont-layout"
                      style={{
                        fontSize: "130%",
                        marginRight: "5px",
                        color: "#00254c",
                      }}
                    ></i>
                    All Campaigns
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
                            placeholder="Search Campaign"
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
                            slug: "",
                            parentCategory: "",
                            productObj: null,
                            expirtyDate: "",
                            categoryId: "",
                            loading: false,
                            loading2: false,
                            imageUrl: man,
                            imageUrl2: man,
                            file: "",
                            checkedValues: [],
                            selectAll: false,
                            topCategory: false,
                            type: "upload",
                          });
                        }}
                      >
                        Add New Campaign
                      </button>
                    </li>
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
                              minWidth: "150px",
                              maxWidth: "150px",
                            }}
                          >
                            Active
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
                            Campaign Image
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
                            Campaign Name
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
                            Category Id
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
                            Expiry Date
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
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaigns.map((campaign, index) => (
                          <tr key={index}>
                            <th scope="row">
                              {" "}
                              <div>
                                <span
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    name={campaign.id}
                                    checked={campaign.visible}
                                    style={{
                                      height: 20,
                                      width: 20,
                                    }}
                                    onChange={(e) =>
                                      this.selectRow(e, campaign)
                                    }
                                  />
                                </span>
                              </div>
                            </th>
                            <td>
                              <a href={campaign.logo} target="_blank">
                                <img
                                  style={{ height: 100, width: 70 }}
                                  src={campaign.image || this.state.imageUrl}
                                />
                              </a>
                            </td>
                            <td>{campaign.name}</td>
                            <td>{campaign.categoryId}</td>
                            <td>{campaign.expiryDate}</td>
                            <td

                            // onClick={()}
                            >
                              <div
                                style={{
                                  fontWeight: "bold",
                                  display: "inline",
                                  padding: "2px 5px",
                                  cursor: "pointer",
                                  background: "#ec345b",
                                  borderRadius: 5,
                                  color: "white",
                                }}
                                onClick={() => {
                                  this.props.history.push(
                                    `/products/physical/campaigns/${campaign.id}`
                                  );
                                }}
                              >
                                see
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
                                      id: campaign.id,
                                      name: campaign.name,
                                      visible: campaign.visible,
                                      imageUrl: campaign.image,
                                      imageUrl2: campaign.banner,
                                      type: "update",
                                      productObj: campaign,
                                      expirtyDate: campaign.expiryDate,
                                      categoryId: campaign.categoryId,
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
                                      productObj: campaign,
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
                  {productObj ? "Update" : "Add New"} Campaign
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
                      Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleChange}
                      id="exampleFormControlInput1"
                      placeholder="Enter campaign name"
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
                      Short details
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="categoryId"
                      value={this.state.categoryId}
                      onChange={this.handleChange}
                      id="exampleFormControlInput1"
                      placeholder="Enter short description"
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
                      Campaign Expiry Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="expiryDate"
                      value={this.state.expiryDate}
                      onChange={this.handleChange}
                      id="exampleFormControlInput1"
                      placeholder="Enter expiry date"
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
                      Campaign Image
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
                              minHeight: 120,
                              maxHeight: 120,
                              minWidth: 100,
                              maxWidth: 100,
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
                    <div style={{ marginTop: 3, color: "gray" }}>
                      Dimensions (7000 * 6000)
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
                      Campaign Banner
                    </label>
                    <div
                      className="box-input-file"
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    >
                      {this.state.loading2 ? (
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
                            src={this.state.imageUrl2}
                            alt="#"
                            style={{
                              zIndex: 10,
                              cursor: "pointer",
                              border: "1px solid gainsboro",
                              borderRadius: 5,
                              minHeight: 120,
                              maxHeight: 120,
                              minWidth: 250,
                              maxWidth: 250,
                            }}
                            onClick={() => {
                              document
                                .getElementById("upload-image-input-2")
                                .click();
                            }}
                          />

                          <input
                            id="upload-image-input-2"
                            className="upload"
                            type="file"
                            style={{
                              position: "absolute",
                              zIndex: 5,
                              maxWidth: "50px",
                              marginTop: "10px",
                            }}
                            onChange={(e) => this._handleImgChange2(e, 1)}
                          />
                        </>
                      )}
                    </div>
                    <div style={{ marginTop: 3, color: "gray" }}>
                      Dimensions (3500 * 7500)
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
                  {productObj ? "UPDATE" : "ADD"} Campaign
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
                  Delete Campaign
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
                  <div>Are you sure you want to delete this Image?</div>
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
                            src={productObj.logo}
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
                    this.props.deleteCampaignRedux(productObj.id);
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
    allUsers: state.users.users,
    currentAdmin: state.admins.currentAdmin,
    campaigns: state.campaigns.campaigns,
  };
};

export default connect(mapStateToProps, {
  getAllCampaignsRedux,
  uploadCampaignRedux,
  updateCampaignRedux,
  deleteCampaignRedux,
})(Campaigns);
