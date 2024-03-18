import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../common/breadcrumb";
import data from "../../assets/data/listUser";
import Datatable from "./usersDatatable";
import { Search } from "react-feather";
import { getAllUsersRedux } from "../../actions/index";
import { connect } from "react-redux";
import { sendNotifications } from "../../firebase/fcmRestApi";
import { getAllDeviceTokens } from "../../firebase/firebase.utils";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
export class List_user extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allUsers: [],
      searchFor: "",
      messageBody: "",
      campaign_title: "",
    };
  }

  componentDidMount = async () => {
    await this.props.getAllUsersRedux();
    this.setState({ allUsers: this.props.allUsers });
  };
  handleSearchBarChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
    console.log(this.state.searchFor);
  };
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async () => {
    const { allUsers } = this.props;
    const UsersWithToken = allUsers.filter(
      (user) => user.deviceToken && user.deviceToken.length > 0
    );

    const message = {
      title: this.state.campaign_title,
      body: this.state.messageBody,
    };

    const allTokens = await getAllDeviceTokens();
    for (let i = 0; i < allTokens.length; i++) {
      const token = allTokens[i];
      sendNotifications(token, message);
    }

    toast.success("Notification sent successfully!");
  };

  render() {
    const { allUsers, searchFor } = this.state;
    let renderableUsers = allUsers;
    if (!searchFor) {
      renderableUsers = allUsers;
    } else {
      renderableUsers = allUsers.filter(
        (user) =>
          (user.userId && user.userId.includes(searchFor)) ||
          (user.displayName &&
            user.displayName.toLowerCase().includes(searchFor.toLowerCase()))
      );
    }
    return (
      <Fragment>
        <Breadcrumb title="User List" parent="Users" />
        <div className="container-fluid">
          <div className="card">
            <div
              className="card-header"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <h5>User Details</h5>
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
                        placeholder="Search user"
                        onChange={this.handleSearchBarChange}
                        style={{ paddingLeft: 10 }}
                      />
                      <span
                        // className="d-sm-none mobile-search"
                        onClick={() => this.handleSearchClick()}
                      >
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
                  <div
                    style={{
                      padding: 10,
                      borderRadius: 10,
                      color: "white",
                      fontWeight: "bold",
                      backgroundColor: "purple",
                      cursor: "pointer",
                    }}
                    data-toggle="modal"
                    data-target="#personalInfoModal"
                  >
                    Send Notification
                  </div>
                </li>
              </div>
            </div>
            <div className="card-body">
              <div className="clearfix"></div>
              <div
                id="batchDelete"
                className="category-table user-list order-table coupon-list-delete"
              >
                <Datatable
                  multiSelectOption={false}
                  myData={renderableUsers.sort(
                    (a, b) => parseInt(a.userId) - parseInt(b.userId)
                  )}
                  pageSize={100}
                  pagination={true}
                  class="-striped -highlight"
                />
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
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
                  Send Notification
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
              <div style={{ padding: 10 }}>
                <label>Notification Title</label>
                <input
                  type="text"
                  name="campaign_title"
                  className="form-control"
                  placeholder="Campaign Title"
                  style={{
                    fontSize: "1rem",
                  }}
                  onChange={this.handleChange}
                  value={this.state.campaign_title}
                  required
                />
              </div>
              <div style={{ padding: 10 }}>
                <label>Notification Title</label>
                <textarea
                  type="text"
                  name="messageBody"
                  className="form-control"
                  placeholder="Enter text here..."
                  style={{ fontSize: "1rem", minHeight: "170px" }}
                  onChange={this.handleChange}
                  value={this.state.messageBody}
                  required
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn "
                  data-dismiss="modal"
                  style={{
                    backgroundColor: "purple",
                    color: "white",
                    padding: 8,
                    borderRadius: 5,
                    fontWeight: "lighter",
                  }}
                  onClick={() => {
                    this.handleSubmit();
                  }}
                >
                  Send
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
  };
};
export default connect(mapStateToProps, { getAllUsersRedux })(List_user);
