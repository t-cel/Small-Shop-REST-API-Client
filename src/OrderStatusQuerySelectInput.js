export const OrderStatusQuerySelectInput = (props) => {
  return (
    <div>
        <label htmlFor="orderStatus">Order Status</label>
        <select defaultValue="-1" id="orderStatus" className="form-control" onChange={props.handleChange}>
            <option value="-1">Any</option>
            <option value="0">Ordered</option>
            <option value="1">Sent</option>
            <option value="2">Delivered</option>
        </select>
    </div>
  );
}