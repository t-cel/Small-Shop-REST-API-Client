import React, { useState } from 'react';
import GridifyQueryBuilder from './GridifyQueryBuilder';
import EventBus from 'eventing-bus';
import { FormValidator, ValidationConstraintBuilder } from './FormValidator';
import { 
  TextInput, 
  CategoryQuerySelectInput, 
  ProductFilterSortBySelectInput,
  OrderSelectInput
} from "./Inputs";

const ProductsFilterPanel = (props) => {
  const [fields, setFields] = useState({ category: "0", sortBy: "name", isSortAsc: true, priceMin: "", priceMax: "", pageSize: ""});
  const [errors, setErrors] = useState({ priceMin: "", priceMax: "", pageSize: "" });

  const handleChange = ({target}) => {
    const _fields = Object.assign({}, fields);
    _fields[target.id] = target.value;
    setFields(_fields);
  }

  const validateForm = () => {
    const constraintBuilder = new ValidationConstraintBuilder();
    const formValidator = new FormValidator();
    const fieldsToFilter = [fields["priceMin"], fields["priceMax"], fields["pageSize"] ];
    const _errors = { priceMin: "", priceMax: "", pageSize: "" };

    const constraints = constraintBuilder.reset().setAllowEmpty().setNumbersOnly().build();

    const result = formValidator.validate([
      { fieldName: "priceMin", constraints: constraints },
      { fieldName: "priceMax", constraints: constraints },
      { fieldName: "pageSize", constraints: constraints },
    ], fieldsToFilter, _errors);

    setErrors({priceMin: _errors.priceMin, priceMax: _errors.priceMax, pageSize: _errors.pageSize});
    return result;
  }

  const constructQuery = () => {
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

  const onApplyFilter = async () => {
    if(validateForm()) {
      await EventBus.publish("applyFilterToProductsList", constructQuery());
    }
  }

  return (
    <div className="container">
      <div className="filtering_panel p-2 px-3 my-1 mx-2 rounded">
        <div className="form-row mt-2">
          <div className="form-group col-md-1">
            <TextInput id="priceMin" text="Price Min." handleChange={handleChange} errors={errors} placeholder="0"/>
          </div>         
          <div className="form-group col-md-1">
            <TextInput id="priceMax" text="Price Max." handleChange={handleChange} errors={errors} placeholder="999"/>
          </div>
          <div className="form-group col-md-2">
            <TextInput id="pageSize" text="Results Count" handleChange={handleChange} errors={errors} placeholder="50"/>
          </div>
          <div className="form-group col-md">
            <CategoryQuerySelectInput handleChange={handleChange}/>
          </div>
          <div className="form-group col-md">
            <ProductFilterSortBySelectInput handleChange={handleChange}/>
          </div>
          <div className="form-group col-md">
            <OrderSelectInput handleChange={handleChange}/>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col">
            <button className="btn btn-primary btn-block" onClick={onApplyFilter}>Apply Filter</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsFilterPanel;