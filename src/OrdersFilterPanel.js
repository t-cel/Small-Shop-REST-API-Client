import React, { useState } from 'react';
import GridifyQueryBuilder from './GridifyQueryBuilder';
import EventBus from 'eventing-bus';
import { FormValidator, ValidationConstraintBuilder } from './FormValidator';
import { 
  TextInput,
  OrderStatusQuerySelectInput,
  CategoryQuerySelectInput,
  OrderFilterSortBySelectInput,
  OrderSelectInput,
} from './Inputs';

const OrdersFilterPanel = (props) => {
  const [fields, setFields] = useState({ category: "0", orderStatus: "-1", sortBy: "orderStatus", isSortAsc: true});
  const [errors, setErrors] = useState({ productId: "", pageSize: "" });

  const handleChange = ({target}) => {
    const _fields = Object.assign({}, fields);
    _fields[target.id] = target.value;
    setFields(_fields);
  }

  const validateForm = () => {
    const constraintBuilder = new ValidationConstraintBuilder();
    const formValidator = new FormValidator();
    const fieldsToFilter = [fields["productId"], fields["pageSize"]];
    const _errors = { productId: "", pageSize: "" };

    const constraints = constraintBuilder.setAllowEmpty().setNumbersOnly().setMinNumericValue(1).build();
    const result = formValidator.validate([
      { fieldName: "productId", constraints: constraints },
      { fieldName: "pageSize", constraints: constraints },
    ], fieldsToFilter, _errors);

    setErrors(_errors);
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

  const onApplyFilter = async () => {
    if(validateForm()) { 
      await EventBus.publish("applyFilterToOrdersList", constructQuery());
    }
  }

  return (
    <div className="container">
      <div className="filtering_panel p-2 px-3 my-1 mx-2 rounded">
        <div className="form-row mt-2">
          <div className="form-group col-md-1">
            <TextInput id="productId" text="Product Id" handleChange={handleChange} errors={errors} placeholder="0"/>
          </div>
          <div className="form-group col-md-2">
            <TextInput id="pageSize" text="Results Count" handleChange={handleChange} errors={errors} placeholder="50"/>
          </div>
          <div className="form-group col-md">
            <OrderStatusQuerySelectInput handleChange={handleChange}/>
          </div>
          <div className="form-group col-md">
            <CategoryQuerySelectInput handleChange={handleChange} />
          </div>
          <div className="form-group col-md">
            <OrderFilterSortBySelectInput handleChange={handleChange}/>
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

export default OrdersFilterPanel;