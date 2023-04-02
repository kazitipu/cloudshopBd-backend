import React, { Component, Fragment } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'


export class Datatable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkedValues: [],
            myData: this.props.myData,
         
        }
    }

    selectRow = (e, i,quantity) => {
        if (!e.target.checked) {
            this.setState({
                checkedValues: this.state.checkedValues.filter((item, j) => i !== item.id),
              
            });
        } else {
            this.state.checkedValues.push({id:i, quantity:quantity});
           
            this.setState({
                checkedValues: this.state.checkedValues,
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
            myData.forEach(product =>{
                
            //  this is not affecting my output see line 104   
                newData.push({
                    code: product.id,
                    quantity:product.qty,
                    image: <img src={``} style={{width:50,height:50}}/>,
                    price: product.salePrice,
                    total:product.salePrice * product.qty
                })
                
            });
            return (
                <div
                    style={{ backgroundColor: "#fafafa" }}
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

    getStatus =(productQuantity) =>{
        if (productQuantity < 10){
            return (<i className="fa fa-circle font-danger f-12" />)
        }else if (productQuantity >50){
            return (<i className="fa fa-circle font-success f-12" />)
        }else {
            return (<i className="fa fa-circle font-warning f-12" />)
        }
    }

    handleChange =(e)=>{
        const {name, value} = e.target;
        this.setState({[name]:value})
    }



    render() {
        const { pageSize, myClass, multiSelectOption, pagination } = this.props;
        console.log(this.props)
        const { myData } = this.props
        console.log(myData)
        const newData = []
        if (myData.length >0){
            myData.forEach(product =>{
                const image = product.pictures[0]
                console.log(product.qty)
                newData.push({
                    code: product.id,
                    image: <img src={`${image}`} style={{width:50,height:50}}/>,
                    quantity:product.qty,
                    price: product.salePrice,
                    total:product.salePrice * product.qty
              
                  
                   
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
                    Cell: editable,
                    style: {
                        textAlign: 'center'
                    }
                });
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
