import React, { Component } from 'react'
import man from '../../../assets/images/dashboard/user2.jpg'
import {connect} from 'react-redux'


export class User_panel extends Component {
    render() {
        const {currentAdmin} = this.props
        return (
            <div>
                <div className="sidebar-user text-center">
                    <div>{currentAdmin && currentAdmin.image?<img className="img-60 rounded-circle lazyloaded blur-up" src={currentAdmin.image} alt="#" />:<img className="img-60 rounded-circle lazyloaded blur-up" src={man} alt="#" />}
                    </div>
                    <h6 className="mt-3 f-14">{currentAdmin?currentAdmin.name:''}</h6>
                    <p>{currentAdmin?currentAdmin.status:''}</p>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state)=>{
    return{
        currentAdmin:state.admins.currentAdmin
    }
}
export default connect(mapStateToProps,null)(User_panel)

