import React from 'react';

import GridifyQueryBuilder from './GridifyQueryBuilder';

export default class ProductsFilterPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {
                category: "0",
                sortBy: "name",
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
  
        if(fields["priceMin"] && !isNumeric(fields["priceMin"])) {
            errors["priceMin"] = "Not a valid price";
            formIsValid = false;
        }
  
        if(fields["priceMax"] && !isNumeric(fields["priceMax"])) {
          errors["priceMax"] = "Not a valid price";
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
  
        if(fields["priceMin"]) {
          gridifyQueryBuilder.setFilterGreaterOrEqual("price", fields["priceMin"]);
          isAndNeeded = true;
        }
  
        if(fields["priceMax"]) {
          if(isAndNeeded)
            gridifyQueryBuilder.setFilterAnd();
          gridifyQueryBuilder.setFilterLessOrEqual("price", fields["priceMax"]);
          isAndNeeded = true;
        }
  
        if(fields["category"] != 0) {
          if(isAndNeeded)
            gridifyQueryBuilder.setFilterAnd();
          gridifyQueryBuilder.setFilterEquals("categoryId", fields["category"]);
        }
  
        return gridifyQueryBuilder.build();
      }
  
    async onApplyFilter() {
        if(this.validateForm()) {
          await this.props.onApplyFilter(this.constructQuery());
        }
    }
  
    handleChange({target}) {
        const fields = this.state.fields;
        fields[target.name] = target.value;
        this.setState({fields});
    }

    render() {
        return (
        <div className="container">
            <div className="filtering_panel p-2 px-3 my-1 mx-2 rounded">
              <div className="form-row mt-2">
                <div className="form-group col-md-1">
                  <label for="priceMin">Price Min.</label>
                  <input 
                    className="form-control" 
                    type="text" 
                    onChange={this.handleChange} 
                    id="priceMin"
                    name="priceMin" 
                    placeholder="0"
                    >
                  </input>
                  <div className="text-danger">{this.state.errors["priceMin"]}</div>
                </div>
                <div className="form-group col-md-1">
                  <label for="priceMax">Price Max.</label>
                  <input 
                    className="form-control" 
                    type="text" 
                    onChange={this.handleChange} 
                    name="priceMax" 
                    id="priceMax"
                    placeholder="999"
                    >
                  </input>
                  <div className="text-danger">{this.state.errors["priceMax"]}</div>
                </div>
                <div className="form-group col-md-2">
                  <label for="pageSize">Results Count</label>
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
                  <label for="inputState">Category</label>
                  <select name="category" id="inputState" class="form-control" onChange={this.handleChange}>
                    <option selected value="0">Any</option>
                    <option value="1">Sport</option>
                    <option value="2">Clothes</option>
                    <option value="3">Household</option>
                    <option value="4">Car Accessories</option>
                    <option value="5">Kitchen Accessories</option>
                  </select>
                </div>
                <div className="form-group col-md">
                  <label for="inputState">Sort By</label>
                  <select name="sortBy" id="inputState" class="form-control" onChange={this.handleChange}>
                    <option selected value="name">Name</option>
                    <option value="price">Price </option>
                    <option value="count">Count</option>
                  </select>
                </div>
                <div className="form-group col-md">
                  <label for="inputState">Order</label>
                  <select name="isSortAsc" id="inputState" class="form-control" onChange={this.handleChange}>
                    <option selected value={true}>Ascending</option>
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