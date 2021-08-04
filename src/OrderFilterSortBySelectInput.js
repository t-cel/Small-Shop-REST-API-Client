export const OrderFilterSortBySelectInput = (props) => {
  return (
    <div>
        <label htmlFor="sortBy">Sort By</label>
        <select defaultValue="orderStatus" id="sortBy" className="form-control" onChange={props.handleChange}>
            <option value="orderStatus">Order Status</option>
            <option value="count">Orders Count</option>
        </select>
    </div>
  );
}