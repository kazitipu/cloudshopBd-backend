import React, { Component } from "react";
import "./updateRequestModal.css";
import { updateProductRequestRedux } from "../../actions/index";
import { connect } from "react-redux";
import { toast } from "react-toastify";

class UpdateRequestModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unitPrice: "",

      note: "",
      localShipping: "",
      status: "",
      orderId: "",
      trackingNo: "",
    };
  }

  componentWillReceiveProps = (nextProps) => {
    const { singleRequest } = nextProps;
    if (singleRequest) {
      this.setState({
        unitPrice: singleRequest.unitPrice || "",

        note: singleRequest.note || "",
        localShipping: singleRequest.localShipping || "",
        status: singleRequest.status || "",
        orderId: singleRequest.orderId || "",
        trackingNo: singleRequest.trackingNo || "",
      });
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { singleRequest } = this.props;

    console.log(this.state);

    await this.props.updateProductRequestRedux({
      ...this.props.singleRequest,
      ...this.state,
      totalRate:
        parseInt(this.state.unitPrice) *
          parseInt(singleRequest.productQuantity) +
        parseInt(this.state.localShipping),
      status: this.state.status || this.props.singleRequest.status,
    });
    toast.success("successfully updated Product Reqeust");

    this.setState({
      unitPrice: "",
      note: "",
      localShipping: "",
      status: "",
      orderId: "",
      trackingNo: "",
    });
    this.props.startToggleModal(null);
  };
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  render() {
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
                          unitPrice: "",

                          note: "",
                          localShipping: "",
                          status: "",
                          orderId: "",
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
                            Booking Id:{" "}
                            {this.props.singleRequest &&
                              this.props.singleRequest.bookingId}
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
                                  Unit Price
                                </label>

                                <input
                                  type="text"
                                  name="unitPrice"
                                  className="form-control"
                                  placeholder="Enter Unit Price"
                                  style={{ fontSize: "1rem" }}
                                  onChange={this.handleChange}
                                  value={this.state.unitPrice}
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
                                name="status"
                                className="custom-select"
                                aria-required="true"
                                aria-invalid="false"
                                onChange={this.handleChange}
                                value={this.state.status}
                                required
                              >
                                <option value="">Change Status</option>
                                <option value="Rates Provided">
                                  Rates Provided
                                </option>
                                <option value="Paid">Paid</option>
                                <option value="Ordered">Ordered</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Reject">Reject</option>
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
                                  Order Id
                                </label>

                                <input
                                  type="text"
                                  name="orderId"
                                  className="form-control"
                                  placeholder="Enter 1688/taobao/aliexpress order Id"
                                  style={{ fontSize: ".8rem" }}
                                  onChange={this.handleChange}
                                  value={this.state.orderId}
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
export default connect(mapStateToProps, { updateProductRequestRedux })(
  UpdateRequestModal
);
