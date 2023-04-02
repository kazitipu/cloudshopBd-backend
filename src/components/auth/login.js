import React, { Component, Fragment } from "react";
import LoginTabset from "./loginTabset";
import { ArrowLeft, Sliders } from "react-feather";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import stats from "../../assets/images/dashboard/stats.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export class Login extends Component {
  render() {
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      arrows: false,
    };
    return (
      <Fragment>
        <div className="page-wrapper">
          <div className="authentication-box">
            <div className="container">
              <div className="row">
                <div className="col-md-5 p-0 card-left">
                  <div className="card bg-primary">
                    <div className="svg-icon">
                      <img src={stats} className="Img-fluid" />
                    </div>
                    <Slider className="single-item" {...settings}>
                      <div>
                        <div>
                          <h3>Welcome to CloudShopBd</h3>
                          <p>
                            Best e-commerce platform for B2B buisness.You just
                            order your products and leave the rest upon us.
                            we'll deliver to your door.
                          </p>
                        </div>
                      </div>
                      <div>
                        <div>
                          <h3>Why use CloudShopBd?</h3>
                          <p>
                            We just don't receive your product and deliver it to
                            you. We check product quality,condition,packaging.
                          </p>
                        </div>
                      </div>
                      <div>
                        <div>
                          <h3>from CloudShopBd team</h3>
                          <p>
                            For better experience in e-commerce and 24/7 support
                            stay with use
                          </p>
                        </div>
                      </div>
                    </Slider>
                  </div>
                </div>
                <div className="col-md-7 p-0 card-right">
                  <div className="card tab2-card">
                    <div className="card-body">
                      <LoginTabset
                        setCurrentAdmin={this.props.setCurrentAdmin}
                        currentAdmin={this.props.currentAdmin}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Login;
