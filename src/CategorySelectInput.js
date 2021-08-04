export const CategorySelectInput = (props) => {
  return (
    <div>
      <label htmlFor="category_dropdown">Category:</label>
      <div className="dropdown" id="category_dropdown">
        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" disabled={props.disabled}>
          {
            props.defaultValue
          }
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <button className="dropdown-item" onClick={props.handleChange} id="categoryId" value="1">Sport</button>
          <button className="dropdown-item" onClick={props.handleChange} id="categoryId" value="2">Clothes</button>
          <button className="dropdown-item" onClick={props.handleChange} id="categoryId" value="3">Household</button>
          <button className="dropdown-item" onClick={props.handleChange} id="categoryId" value="4">Car Accessories</button>
          <button className="dropdown-item" onClick={props.handleChange} id="categoryId" value="5">Kitchen Accessories</button>
        </div>
      </div> 
    </div>
  );
}