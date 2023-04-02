import React, { Component, Fragment } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {deleteOrder} from './../../firebase/firebase.utils'


export class Datatable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkedValues: [],
            myData: this.props.myData
        }
    }

    selectRow = (e, i) => {
        if (!e.target.checked) {
            this.setState({
                checkedValues: this.state.checkedValues.filter((item, j) => i !== item)
            });
        } else {
            this.state.checkedValues.push(i);
            this.setState({
                checkedValues: this.state.checkedValues
            })
        }
    }

    handleRemoveRow = () => {
        const selectedValues = this.state.checkedValues;
        const updatedData = this.state.myData.filter(function (el) {
            return selectedValues.indexOf(el.id) < 0;
        });
        this.setState({
            myData: updatedData
        })
        toast.success("Successfully Deleted !")
    };

    renderEditable = (cellInfo) => {
        const { myData } = this.props
        if (myData.length > 0){
            const newData =[]
            myData.forEach(order =>{
                
            //  this is not affecting my output see line 104   
                newData.push({
                    orderId:order.orderId,
                    Customer: order.otherInformation.first_name + order.otherInformation.last_name,
                    phone: order.otherInformation.phone,
                    total: order.sum,
                    order_status: order.status,
                    paid:order.paymentStatus.paid
                })
                
            });
            return (
                <div
                    style={{ backgroundColor: "#fafafa" }}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => {
                        const data = [...newData];
                        data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                        this.setState({ myData: data });
                    }}
                    dangerouslySetInnerHTML={{
                        __html:newData[cellInfo.index][cellInfo.column.id]
                    }}
                />
            );
        }
        else{
            return null;
        }
        
    }

    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    render() {
        const { pageSize, myClass, multiSelectOption, pagination } = this.props;
        console.log(this.props)
        const { myData } = this.props
        console.log(myData)
        const newData = []
        if (myData.length >0){
            myData.forEach(order =>{
                
                newData.push({
                    orderId:order.orderId,
                    Customer: order.otherInformation.first_name + order.otherInformation.last_name,
                    phone: order.otherInformation.phone,
                    total: order.sum,
                    order_status: order.status,
                    paid:order.paymentStatus.paid
                })   
            })
        }
       ;

        const columns = [];
        for (var key in newData[0]) {

            let editable = this.renderEditable
            if (key == "image") {
                editable = null;
            }
            if (key == "status") {
                editable = null;
            }
            if (key === "avtar") {
                editable = null;
            }
            if (key === "vendor") {
                editable = null;
            }
            if(key === "order_status"){
                editable = null;
            }

            columns.push(
                {
                    Header: <b>{this.Capitalize(key.toString())}</b>,
                    accessor: key,
                    Cell: null,
                    style: {
                        textAlign: 'center'
                    }
                });
        }

        if (multiSelectOption == true) {
            columns.push(
                {
                    Header: <button className="btn btn-danger btn-sm btn-delete mb-0 b-r-4"
                        onClick={
                            (e) => {
                                if (window.confirm('Are you sure you wish to delete this order?'))
                                    this.handleRemoveRow()
                            }}>Delete</button>,
                    id: 'delete',
                    accessor: str => "delete",
                    sortable: false,
                    style: {
                        textAlign: 'center'
                    },
                    Cell: (row) => (
                        <div>
                            <span >
                                <input type="checkbox" name={row.original.orderId} defaultChecked={this.state.checkedValues.includes(row.original.orderId)}
                                    onChange={e => this.selectRow(e, row.original.orderId)} />
                            </span>
                        </div>
                    ),
                    accessor: key,
                    style: {
                        textAlign: 'center'
                    }
                }
            )
        } else {
            columns.push(
                {
                    Header: <b>Action</b>,
                    id: 'delete',
                    accessor: str => "delete",
                    Cell: (row) => (
                        <div>
                            <span onClick={() => {
                                let data = myData;
                                data.splice(row.index, 1);
                                this.setState({ myData: data });
                                console.log(row)
                                deleteOrder(row.original.orderId)
                                
                                toast.success("Successfully Deleted !")

                            }}>
                                <i className="fa fa-trash" style={{ width: 35, fontSize: 20, padding: 11, color: '#e4566e', cursor:'pointer' }}
                                ></i>
                            </span>

                        
                    </div>
                ),
                style: {
                    textAlign: 'center'
                },
                sortable: false
            },
            
        )
        }

        return (
            <Fragment>
                <ReactTable
                    data={newData}
                    columns={columns}
                    defaultPageSize={pageSize}
                    className={myClass}
                    showPagination={pagination}
                />
                <ToastContainer />
            </Fragment>
        )
    }
}

export default Datatable
