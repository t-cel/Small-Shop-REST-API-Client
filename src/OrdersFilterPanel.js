import React from 'react';
import GridifyQueryBuilder from './GridifyQueryBuilder';
import EventBus from 'eventing-bus';

export default class OrdersFilterPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {
                category: "0",
                orderStatus: "-1",
                sortBy: "orderStatus",
                isSortAsc: true 
            },
            errors: {}
        }
        this.onApplyFilter = this.onApplyFilter.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.constructQuery = this.constructQuery.bind(this);
    }

    validateForm() {
        const fields = this.state.fields;
        let formIsValid = true;
        let errors = [];
  
        //https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
        const isNumeric = (str) => {
            if (typeof str != "string") return false;
  
            if(!isNaN(str)) {
                const asFloat = parseFloat(str);
                return asFloat > 0.0 && !isNaN(parseFloat(str));
            }
        }
  
        if(fields["productId"] && !isNumeric(fields["productId"])) {
            errors["productId"] = "Not a valid product id";
            formIsValid = false;
        }
  
        if(fields["pageSize"] && !isNumeric(fields["pageSize"])) {
          errors["pageSize"] = "Not a valid count";
          formIsValid = false;
        }
  
        this.setState({fields, errors});
  
        return formIsValid;
      }
  
    constructQuery() {
        const fields = this.state.fields;
        const gridifyQueryBuilder = new GridifyQueryBuilder();
  
        if(fields["pageSize"]) {
          gridifyQueryBuilder.setPageSize(fields["pageSize"]);
        }
  
        gridifyQueryBuilder.setSortBy(fields["sortBy"]);
        gridifyQueryBuilder.setOrder(fields["isSortAsc"]);
  
        let isAndNeeded = false;
  
        if(fields["productId"]) {
          gridifyQueryBuilder.setFilterEquals("productId", fields["productId"]);
          isAndNeeded = true;
        }
  
        if(fields["category"] != 0) {
          if(isAndNeeded)
            gridifyQueryBuilder.setFilterAnd();
          gridifyQueryBuilder.setFilterEquals("categoryId", fields["category"]);
          isAndNeeded = true;
        }

        if(fields["orderStatus"] != -1) {
          if(isAndNeeded)
            gridifyQueryBuilder.setFilterAnd();
          gridifyQueryBuilder.setFilterEquals("orderStatus", fields["orderStatus"]);
        }
  
        return gridifyQueryBuilder.build();
      }
  
    async onApplyFilter() {
        if(this.validateForm()) {
          await EventBus.publish("applyFilterToOrdersList", this.constructQuery());
        }
    }
  
    handleChange({target}) {
        const fields = this.state.fields;
        fields[target.name] = target.value;
        this.setState({fields});
        console.log(fields);
    }

    render() {
        return (
        <div className="container">
            <div className="filtering_panel p-2 px-3 my-1 mx-2 rounded">
              <div className="form-row mt-2">
                <div className="form-group col-md-1">
                  <label htmlFor="productId">Product Id</label>
                  <input 
                    className="form-control" 
                    type="text" 
                    onChange={this.handleChange} 
                    id="productId"
                    name="productId" 
                    placeholder="0"
                    >
                  </input>
                  <div className="text-danger">{this.state.errors["productId"]}</div>
                </div>
                <div className="form-group col-md-2">
                  <label htmlFor="pageSize">Results Count</label>
                  <input 
                    className="form-control" 
                    type="text" 
                    onChange={this.handleChange} 
                    name="pageSize"
                    id="pageSize" 
                    placeholder="50"
                    >
                  </input>
                  <div className="text-danger">{this.state.errors["pageSize"]}</div>
                </div>
                <div className="form-group col-md">
                  <label htmlFor="inputState">Order Status</label>
                  <select defaultValue="-1" name="orderStatus" id="inputState" className="form-control" onChange={this.handleChange}>
                    <option value="-1">Any</option>
                    <option value="0">Ordered</option>
                    <option value="1">Sent</option>
                    <option value="2">Delivered</option>
                  </select>
                </div>
                <div className="form-group col-md">
                  <label htmlFor="inputState">Category</label>
                  <select defaultValue="0" name="category" id="inputState" className="form-control" onChange={this.handleChange}>
                    <option value="0">Any</option>
                    <option value="1">Sport</option>
                    <option value="2">Clothes</option>
                    <option value="3">Household</option>
                    <option value="4">Car Accessories</option>
                    <option value="5">Kitchen Accessories</option>
                  </select>
                </div>
                <div className="form-group col-md">
                  <label htmlFor="inputState">Sort By</label>
                  <select defaultValue="orderStatus" name="sortBy" id="inputState" className="form-control" onChange={this.handleChange}>
                    <option value="orderStatus">Order Status</option>
                    <option value="count">Orders Count</option>
                  </select>
                </div>
                <div className="form-group col-md">
                  <label htmlFor="inputState">Order</label>
                  <select defaultValue={true} name="isSortAsc" id="inputState" className="form-control" onChange={this.handleChange}>
                    <option value={true}>Ascending</option>
                    <option value={false}>Descending</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col">
                  <button className="btn btn-primary btn-block" onClick={this.onApplyFilter}>Apply Filter</button>
                </div>
              </div>
            </div>
        </div>
        );
    }
}