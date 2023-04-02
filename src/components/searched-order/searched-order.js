import React, { Component,Fragment } from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

export class SearchedOrder extends Component {

    timeout =(delay)=> {
        return new Promise( res => setTimeout(res, delay) );}
    toWait= ()=>{
        this.timeout(1000)
    }


    render(){
        const {order} = this.props
        if (order){
            return (
                <Fragment>
    
                 <div className="col-sm-12" style={{marginTop:'10rem'}}>
                                <div className="card">
                                    <div className="card-header">
                                        <h5>{`অর্ডার আইডি ${order.orderId} `}</h5>
                                        <div className="media">
                                            <div className="order-color-primary"></div>
                                                <div className="media-body">
                                                    <h6 className="mb-0">Order Total: Tk{order.paymentStatus.total} <span className="pull-right">Total Paid: Tk{order.paymentStatus.paid} </span></h6>
                                                </div>
                                        </div>
                                        <div className="media">
                                            <div className="order-color-primary"></div>
                                                <div className="media-body">
                                                    <h6 className="mb-0">Order Status: {order.status} </h6>
                                                </div>
                                        </div>
                                        {order.orderTo?<div className="media">
                                            <div className="order-color-primary"></div>
                                                <div className="media-body">
                                                    <h6 className="mb-0">Ordered To: {order.orderTo} </h6>
                                                </div>
                                        </div>:''}
                                      <div className="media">
                                            <div className="order-color-primary"></div>
                                                <div className="media-body">
                                                    <h6 className="mb-0">Customer Name: {order.otherInformation.first_name} {order.otherInformation.last_name}</h6>
                                                </div>
                                        </div>
                                      
                                        <div className="media">
                                            <div className="order-color-primary"></div>
                                                <div className="media-body">
                                                    <h6 className="mb-0">Phone: {order.otherInformation.phone}</h6>
                                                </div>
                                        </div>
                                        <div className="media">
                                            <div className="order-color-primary"></div>
                                                <div className="media-body">
                                                    <h6 className="mb-0">Address: {order.otherInformation.address}</h6>
                                                </div>
                                        </div>
                                        <div className="media">
                                            <div className="order-color-primary"></div>
                                                <div className="media-body">
                                                    <h6 className="mb-0">City: {order.otherInformation.city}</h6>
                                                </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                    {
                                        order.order.map(product=>  
                                    (<div className="col-xl-3 col-sm-6 xl-50">
                                        <div className="order-graph">
                                            <h6>{product.name.slice(0,40)}</h6>
                                            <div className="chart-block chart-vertical-center">
                                            </div>
                                            <div className="order-graph-bottom">
                                                <div className="media">
                                                    
                                                    <div className="media-body">
                                                        <img style={{maxWidth:'30%'}} src={product.pictures[0]} className="mb-0"/>
                                                    </div>
                                                </div>
                                                <div className="media">
                                                <div className="order-color-secondary"></div>
                                                    <div className="media-body">
                                                        <h6 className="mb-0">Product Id: {product.id}</h6>
                                                    </div>
                                                </div>
                                                <div className="media">
                                                    <div className="order-color-danger"></div>
                                                    <div className="media-body">
                                                        <h6 className="mb-0">salePrice: Tk {product.salePrice}</h6>
                                                    </div>
                                                </div>
                                                <div className="media">
                                                    <div className="order-color-warning"></div>
                                                    <div className="media-body">
                                                        <h6 className="mb-0">Quantity: {product.qty}pc</h6>
                                                    </div>
                                                </div>
                                                <div className="media">
                                                    <div className="order-color-success"></div>
                                                    <div className="media-body">
                                                        <h6 className="mb-0">{product.color?`Color: ${product.color}`:''} </h6>
                                                    </div>
                                                </div>
                                                <div className="media">
                                                    <div className="order-color-success"></div>
                                                    <div className="media-body">
                                                        <h6 className="mb-0">{product.sizeOrShipsFrom?`SizeOrShipsFrom: ${product.sizeOrShipsFrom}`:''} </h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>)
                                   )
                                    }
                                    
                                            
                                         
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                </Fragment>
            )

        }else{
            this.toWait()
            return(
                <div className="col-sm-12" style={{marginTop:'10rem'}}>
                <div className="card">
                    <div className="card-header">
                        <h5>দুঃখিত এই অর্ডারটি আর খুজে পাওয়া যাচ্ছে না।</h5>
                    </div>
                </div>
                </div>
            )
        }
       
    }
}

const mapStateToProps = (state,ownProps)=>{
    const order = state.orders.orders.find(order=>order.orderId == ownProps.match.params.orderId)
    return{
        order
    }
}
export default withRouter(connect(mapStateToProps, null)(SearchedOrder));
