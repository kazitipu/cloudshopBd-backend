import React, { Component } from "react";
import "./updateRequestModal.css";
import { updateShipmentRequestRedux } from "../../actions/index";
import { connect } from "react-redux";
import { toast } from "react-toastify";

class UpdateRequestModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      perKg: "",
      note: "",
      status: "",
      trackingNo: "",
      warehouse: "",
    };
  }

  componentWillReceiveProps = (nextProps) => {
    const { singleRequest } = nextProps;
    if (singleRequest) {
      this.setState({
        perKg: (singleRequest.result && singleRequest.result.perKg) || "",

        note: singleRequest.note || "",

        status: singleRequest.status || "",

        trackingNo: singleRequest.trackingNo || "",
        warehouse: singleRequest.warehouse || "",
      });
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { singleRequest } = this.props;

    console.log(this.state);

    await this.props.updateShipmentRequestRedux({
      ...this.props.singleRequest,
      ...this.state,
      result: {
        perKg: this.state.perKg,
        result: parseFloat(this.state.perKg) * parseFloat(singleRequest.weight),
      },
      status: this.state.status || singleRequest.status,
    });
    toast.success("successfully updated Shipment Reqeust");

    this.setState({
      perKg: "",
      note: "",
      status: "",
      trackingNo: "",
      warehouse: "",
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
                          warehouse: "",
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
                              <label
                                style={{
                                  color: "white",
                                  marginBottom: 0,
                                  fontSize: 16,
                                }}
                              >
                                Per Kg
                              </label>

                              <input
                                type="text"
                                name="perKg"
                                className="form-control"
                                placeholder="Enter Rate/Kg"
                                style={{ fontSize: "1rem" }}
                                onChange={this.handleChange}
                                value={this.state.perKg}
                                required
                              />
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
                                <option value="Received in Warehouse">
                                  Received in Warehouse
                                </option>
                                <option value="Delivered">Delivered</option>
                                <option value="Reject">Reject</option>
                              </select>
                            </div>
                            <div className="form-row mb-4">
                              <label
                                style={{
                                  color: "white",
                                  marginBottom: 0,
                                  fontSize: 16,
                                }}
                              >
                                Select Warehouse
                              </label>

                              <select
                                title=""
                                name="warehouse"
                                className="custom-select"
                                aria-required="true"
                                aria-invalid="false"
                                onChange={this.handleChange}
                                value={this.state.warehouse}
                                required
                              >
                                <option value="">Select Warehouse</option>
                                <option
                                  value="INDIA:
Address: 13, Collin Street, Marquis St, Esplanade, Taltala, Kolkata, West Bengal 700016
Phone no: 8327018844"
                                >
                                  INDIA: Address: 13, Collin Street, Marquis St,
                                  Esplanade, Taltala, Kolkata, West Bengal
                                  700016 Phone no: 8327018844
                                </option>
                                <option
                                  value="空运地址:广东省广州市白云区太和镇营溪村四社二街50号一楼仓库..FM/

收货人: FM/
电话:18102777364
邮政编码:510445"
                                >
                                  空运地址:广东省广州市白云区太和镇营溪村四社二街50号一楼仓库..FM/
                                  收货人: FM/ 电话:18102777364 邮政编码:510445
                                </option>
                              </select>
                            </div>

                            <div className="form-row mb-4">
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
                                placeholder="tracking No"
                                style={{ fontSize: ".8rem", padding: 10 }}
                                onChange={this.handleChange}
                                value={this.state.trackingNo}
                              />
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
export default connect(mapStateToProps, { updateShipmentRequestRedux })(
  UpdateRequestModal
);
