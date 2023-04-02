import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../common/breadcrumb";
import data from "../../assets/data/listUser";
import Datatable from "./usersDatatable";
import { Search } from "react-feather";
import { getAllUsersRedux } from "../../actions/index";
import { connect } from "react-redux";

export class List_user extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allUsers: [],
      searchFor: "",
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
                <li></li>
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
