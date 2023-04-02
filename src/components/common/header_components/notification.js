import React, { Component,Fragment } from 'react'
import { ShoppingBag, DollarSign, AlertCircle } from 'react-feather';
import {connect} from 'react-redux'
import { Link } from 'react-router-dom';


export class Notification extends Component {
    render() {
        return (
            <Fragment>
                
                        <ul className="notification-dropdown onhover-show-div p-0">
                            <li>Notification <span className="badge badge-pill badge-primary pull-right">{this.props.totalNotificationCount}</span></li>
                            <li>
                                <Link to='/sales/order_pending'>
                                <div className="media" >
                                    <div className="media-body">
                                        <h6 className="mt-0"><span><ShoppingBag /></span>Pending Orders..!</h6>
        <p className="mb-0">Globalbuybd has {this.props.pendingOrders.length} pending Orders.</p>
                                    </div>
                                </div>
                                </Link>
                            </li>
                            <li>
                                <Link to='/payments/unVerified'>
                                <div className="media">
                                    <div className="media-body">
                                        <h6 className="mt-0 txt-success"><span><DollarSign /></span>Unverified Payments</h6>
                                        <p className="mb-0">{this.props.unverifiedPayments.length} unverified Payments needs to be reviewed</p>
                                    </div>
                                </div>
                                </Link>
                            </li>
                        </ul>
            </Fragment>
        )
    }
}

const mapStateToProps =(state)=>{
    const unVerifiedPaymentsArray=[]
    state.payments.payments.forEach((payment)=>{ 
        payment.payments.forEach(inPayment=>{
        if (inPayment.paymentStatus === 'unVerified'){
            unVerifiedPaymentsArray.push(inPayment)
        }
        })
    })
    return{
    pendingOrders:state.orders.orders.filter(order=>order.status ==='order_pending'),
    unverifiedPayments:unVerifiedPaymentsArray,
}}
export default connect(mapStateToProps)(Notification);
