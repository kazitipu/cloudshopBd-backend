import React, { Component } from "react";
import "./updateRequestModal.css";
import { updateOrderApiRedux } from "../../actions/index";
import { connect } from "react-redux";
import { toast } from "react-toastify";

class UpdateRequestModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderTotal: "",
      note: "",
      localShipping: "",
      orderStatus: "",
      orderNumber: "",
      trackingNo: "",
    };
  }

  componentWillReceiveProps = (nextProps) => {
    const { order } = nextProps;
    if (order) {
      this.setState({
        orderTotal: order.orderTotal || "",

        note: order.note || "",
        localShipping: order.localShipping || "",
        orderStatus: order.orderStatus || "",
        orderNumber: order.orderNumber || "",
        trackingNo: order.trackingNo || "",
      });
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { order } = this.props;

    console.log(this.state);

    await this.props.updateOrderApiRedux({
      ...order,
      ...this.state,
      orderStatus: this.state.orderStatus || order.orderStatus,
    });
    toast.success("successfully updated Order Reqeust");

    this.setState({
      orderTotal: "",
      note: "",
      localShipping: "",
      orderStatus: "",
      orderNumber: "",
      trackingNo: "",
    });
    this.props.startToggleModal(null);
  };
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  render() {
    const { order } = this.props;
    return (
      <>
        <div
          className={
            this.props.toggleModal
              ? "modal fade show"
              : "modal fade show visible-modal"
          }
          id="request_popup"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered request_popup"
            role="document"
          >
            <div
              className="modal-content visible-modal-content-3"
              style={{ backgroundColor: "rgb(68 0 97)" }}
            >
              <div className="modal-body p-0">
                <section className="pos-rel bg-light-gray">
                  <div className="container-fluid p-3">
                    <a
                      onClick={() => {
                        this.setState({
                          orderTotal: "",
                          note: "",
                          localShipping: "",
                          orderStatus: "",
                          orderNumber: "",
                          trackingNo: "",
                        });
                        this.props.startToggleModal(null);
                      }}
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <i
                        className="icofont-close-line"
                        style={{ color: "white" }}
                      ></i>
                    </a>
                    <div className="d-lg-flex justify-content-end no-gutters mb-spacer-md">
                      {/* <div className="col bg-fixed bg-img-7 request_pag_img">
                        &nbsp;
                      </div> */}

                      <div className="col">
                        <div className="px-3 m-5">
                          <h2
                            className="h2-xl mb-3 fw-6 pb-2"
                            style={{
                              color: "white",
                              textTransform: "none",
                              fontSize: "200%",
                              borderBottom: "2px dotted white",
                            }}
                          >
                            Order Id: {order && order.orderId}
                          </h2>
                          <form
                            onSubmit={this.handleSubmit}
                            className="rounded-field mt-4"
                          >
                            <div className="form-row mb-4">
                              <div className="col">
                                <label
                                  style={{
                                    color: "white",
                                    marginBottom: 0,
                                    fontSize: 16,
                                  }}
                                >
                                  Order Total
                                </label>

                                <input
                                  type="text"
                                  name="orderTotal"
                                  className="form-control"
                                  placeholder="Enter Total Price"
                                  style={{ fontSize: "1rem" }}
                                  onChange={this.handleChange}
                                  value={this.state.orderTotal}
                                  required
                                />
                              </div>

                              <div className="col">
                                <label
                                  style={{
                                    color: "white",
                                    marginBottom: 0,
                                    fontSize: 16,
                                  }}
                                >
                                  Local Shipping Charge
                                </label>

                                <input
                                  type="text"
                                  name="localShipping"
                                  className="form-control"
                                  placeholder="Enter Local shipping"
                                  style={{ fontSize: "1rem" }}
                                  onChange={this.handleChange}
                                  value={this.state.localShipping}
                                  required
                                />
                              </div>
                            </div>

                            <div className="form-row mb-4">
                              <label
                                style={{
                                  color: "white",
                                  marginBottom: 0,
                                  fontSize: 16,
                                }}
                              >
                                Change Status
                              </label>

                              <select
                                title=""
                                name="orderStatus"
                                className="custom-select"
                                aria-required="true"
                                aria-invalid="false"
                                onChange={this.handleChange}
                                value={this.state.orderStatus}
                                required
                              >
                                <option value="">Change Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="ordered">Ordered</option>
                                <option value="delivered">Delivered</option>
                                <option value="reject">Reject</option>
                              </select>
                            </div>

                            <div className="form-row mb-4">
                              <div className="col">
                                <label
                                  style={{
                                    color: "white",
                                    marginBottom: 0,
                                    fontSize: 16,
                                  }}
                                >
                                  Order Number
                                </label>

                                <input
                                  type="text"
                                  name="orderNumber"
                                  className="form-control"
                                  placeholder="Enter 1688/taobao/aliexpress order Number"
                                  style={{ fontSize: ".8rem" }}
                                  onChange={this.handleChange}
                                  value={this.state.orderNumber}
                                />
                              </div>

                              <div className="col">
                                <label
                                  style={{
                                    color: "white",
                                    marginBottom: 0,
                                    fontSize: 16,
                                  }}
                                >
                                  Tracking No
                                </label>

                                <input
                                  type="text"
                                  name="trackingNo"
                                  className="form-control"
                                  placeholder="Enter 1688/taobao/aliexpress tracking No"
                                  style={{ fontSize: ".8rem" }}
                                  onChange={this.handleChange}
                                  value={this.state.trackingNo}
                                />
                              </div>
                            </div>

                            <div className="form-row mb-4">
                              <label
                                style={{
                                  color: "white",
                                  marginBottom: 0,
                                  fontSize: 16,
                                }}
                              >
                                Note{" "}
                              </label>
                              <textarea
                                type="text"
                                name="note"
                                className="form-control"
                                placeholder="Enter Additional Note"
                                style={{ fontSize: "1rem" }}
                                onChange={this.handleChange}
                                value={this.state.note}
                              />
                            </div>

                            <div className="form-row">
                              <div
                                className="col pt-3"
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <button
                                  type="submit"
                                  className="btn btn-secondary"
                                >
                                  Update
                                  <i className="icofont-rounded-right"></i>
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    singleLotFromRedux: ownProps.singleLot
      ? state.lots.lots.find((lot) => lot.lotNo === ownProps.singleLot.Lot)
      : null,
  };
};
export default connect(mapStateToProps, { updateOrderApiRedux })(
  UpdateRequestModal
);
