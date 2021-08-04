export const CategoryQuerySelectInput = (props) => {
  return (
    <div>
      <label htmlFor="category">Category</label>
      <select defaultValue="0" id="category" className="form-control" onChange={props.handleChange}>
        <option value="0">Any</option>
        <option value="1">Sport</option>
        <option value="2">Clothes</option>
        <option value="3">Household</option>
        <option value="4">Car Accessories</option>
        <option value="5">Kitchen Accessories</option>
      </select>
    </div>
  );
}