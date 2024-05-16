import React, { useState } from "react";
import "./PharmacyHome.css";
import { useNavigate } from "react-router-dom";

function PharmacyHome() {

 const navigate = useNavigate();
  // Dummy product list with quantity and stock
  const productList = [
    { id: 1, name: "me", price: 10, quantity: 1, stock: 15 },
    { id: 6, name: "med 2", price: 20, quantity: 1, stock: 10 },
    { id: 3, name: "med 1", price: 15, quantity: 1, stock: 20 }
  ];

  // Dummy recommended medicine list with quantity and purchased
  const [recommendedMedicines, setRecommendedMedicines] = useState([
    { id: 1, name: "med 1", quantity: 5, purchased: 0 },
    { id: 3, name: "med 2", quantity: 8, purchased: 0 },
    { id: 4, name: "med ", quantity: 5, purchased: 0 }
  ]);

  // State to track selected items, discount, and search query
  const [selectedItems, setSelectedItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProductList, setFilteredProductList] = useState(productList);

  // Function to handle adding an item to the selected items list
  const handleAddToCart = (product) => {
    const existingItem = selectedItems.find((item) => item.id === product.id);
    if (existingItem) {
      alert("Item already in the cart");
      return;
    }

    if (product.quantity > product.stock) {
      alert("You have limited stock for " + product.name);
      return;
    }

    // Check if the medicine is recommended by the doctor
    const isRecommended = recommendedMedicines.find((medicine) => medicine.name === product.name);
    if (!isRecommended) {
      alert("This medicine is not recommended by the doctor");
      return;
    }

    // Check if the quantity being added exceeds the recommended quantity
    const recommendedQuantity = isRecommended.quantity;
    if (product.quantity > recommendedQuantity) {
      alert(`You can only purchase up to ${recommendedQuantity} of ${product.name}`);
      return;
    }

    setSelectedItems([...selectedItems, { ...product, quantity: 1 }]);
  };

  // Function to handle updating the quantity of an item
  const handleQuantityChange = (index, quantity) => {
    if (quantity < 0) {
      alert("Quantity cannot be negative");
      return;
    }

    const updatedItems = [...selectedItems];
    const selectedItem = updatedItems[index];

    if (quantity > selectedItem.stock) {
      alert(`You have only ${selectedItem.stock} items of ${selectedItem.name} `);
      return;
    }
    
    // Check if the quantity being updated exceeds the recommended quantity
    const isRecommended = recommendedMedicines.find((medicine) => medicine.name === selectedItem.name);
    const recommendedQuantity = isRecommended ? isRecommended.quantity : 0;
    if (quantity > recommendedQuantity) {
      alert(`You can only purchase up to ${recommendedQuantity} of ${selectedItem.name} because it is recommended by the doctor`);
      return;
    }

    selectedItem.quantity = quantity;
    setSelectedItems(updatedItems);
  };

  // Function to calculate subtotal for an item
  const calculateSubtotal = (item) => {
    return item.price * item.quantity;
  };

  // Function to calculate total payable
  const calculateTotalPayable = () => {
    const total = selectedItems.reduce((acc, item) => acc + calculateSubtotal(item), 0);
    const maxDiscount = total * 0.1; // Maximum discount allowed (10% of total)
    const appliedDiscount = Math.min(maxDiscount, (total * discount) / 100); // Apply discount up to maxDiscount
    return total - appliedDiscount;
  };

  // Function to handle removing an item from the selected items list
  const handleRemoveFromCart = (index) => {
    const updatedItems = [...selectedItems];
    updatedItems.splice(index, 1);
    setSelectedItems(updatedItems);
  };

  // Function to handle cancel action
  const handleCancel = () => {
    setSelectedItems([]); // Reset selected items array to empty
  };

  // Function to handle processing the selected items and updating recommended medicines
  const handleProcess = () => {
    const updatedRecommendedMedicines = recommendedMedicines.map((medicine) => {
      const selectedMedicine = selectedItems.find((item) => item.id === medicine.id);
      if (selectedMedicine) {
        return { ...medicine, purchased: medicine.purchased + selectedMedicine.quantity };
      }
      return medicine;
    });

    setRecommendedMedicines(updatedRecommendedMedicines);
    setSelectedItems([]);
  };

  // Function to handle search input changes
  const handleSearchInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredList = productList.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
    setFilteredProductList(filteredList);
  };

  const handleEndTransaction = () => {
    navigate("/pharmacy");
   
  }

  return (
    <>
      <div className="pharmacy-home-main-container">
        <div className="pharmacy-home-left-container">
          <div className="pharmacy-home-selected-items">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>${item.price}</td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                      />
                    </td>
                    <td>${calculateSubtotal(item)}</td>
                    <td>
                      <button onClick={() => handleRemoveFromCart(index)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pharmacy-home-left-container-footer">
            <div className="pharmacy-home-items-count">
              <label htmlFor="">Items</label>
              <input type="text" value={selectedItems.length} readOnly />
            </div>
            <div className="pharmacy-home-total-count">
              <label htmlFor="">Total Items</label>
              <input
                type="text"
                value={selectedItems.reduce((total, item) => total + item.quantity, 0)}
                readOnly
              />
            </div>
            <div className="pharmacy-home-discount">
              <label htmlFor="">Discount (%)</label>
              <input
                type="number"
                value={discount === "" ? 0 : discount}
                onChange={(e) => {
                  let newDiscount = parseInt(e.target.value);
                  newDiscount = isNaN(newDiscount) ? 0 : newDiscount; // Ensure discount is a number
                  setDiscount(newDiscount > 10 ? 10 : newDiscount);
                }}
              />
            </div>
          </div>

          <div className="pharmacy-home-total-payable">
            <label htmlFor="">Total Payable</label>
            <input type="text" value={calculateTotalPayable()} readOnly />
          </div>
          <div className="pharmacy-home-actions">
            <button className="pharmacy-home-cancel-button" onClick={handleCancel}>Cancel</button>
            <button className="pharmacy-home-process-button" onClick={handleProcess}>Process</button>
            <button className="pharmacy-home-end-transaction-button" onClick={handleEndTransaction}>End Tranctions</button>
          </div>
        </div>
        <div className="pharmacy-home-right-container">
          <div className="pharmacy-home-right-container-header">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <button>Search</button>
          </div>
          <div className="pharmacy-home-right-container-body">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {filteredProductList.map((product) => (
                  <tr key={product.id} onClick={() => handleAddToCart(product)}>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td>{product.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pharmacy-home-right-container-footer">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Purchased</th>
                </tr>
              </thead>
              <tbody>
                {recommendedMedicines.map((medicine) => (
                  <tr key={medicine.id}>
                    <td>{medicine.name}</td>
                    <td>{medicine.quantity}</td>
                    <td>{medicine.purchased}</td>
                  </tr>
                ))}
              </tbody>
            </table>
           
         
          </div>
         
        </div>
      </div>
    </>
  );
}

export default PharmacyHome;
