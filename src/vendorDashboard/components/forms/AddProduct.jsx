import React, { useState } from "react";
import { API_URL } from "../../data/apiPath";

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");

  // Handle category selection
  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  // Handle best seller selection
  const handleBestSeller = (event) => {
    const value = event.target.value === "true";
    setBestSeller(value);
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage && selectedImage.type.startsWith("image/")) {
      setImage(selectedImage);
    } else {
      alert("Please upload a valid image file");
    }
  };

  // Handle form submission
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const loginToken = localStorage.getItem("loginToken");
      const firmId = localStorage.getItem("firmId");

      // Validate authentication, firm ID, and required fields
      if (!loginToken || !firmId) {
        alert("Authentication failed or Firm ID not found");
        return;
      }
      if (!productName || !price || !category.length ) {
        alert("Please fill all the required fields");
        return;
      }

      // Prepare form data
      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("image", image);
      formData.append("bestSeller", bestSeller);

      category.forEach((value) => formData.append("category", value));

      // Send request
      const response = await fetch(`${API_URL}/product/add-product/${firmId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${loginToken}`, // Remove if backend doesn't require it
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert("Product added successfully");
        // Reset form
        setProductName("");
        setPrice("");
        setCategory([]);
        setBestSeller(false);
        setImage(null);
        setDescription("");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      alert("Failed to add product due to an unexpected error");
    }
  };

  return (
    <div className="firmSection">
      <form className="tableForm" onSubmit={handleAddProduct}>
        <h3>Add Product</h3>

        <label htmlFor="productName">Product Name</label>
        <input
          id="productName"
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />

        <label htmlFor="price">Price</label>
        <input
          id="price"
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <div className="checkInp">
          <label>Category</label>
          <div className="inputsContainer">
            <div className="checkboxContainer">
              <label htmlFor="veg">Veg</label>
              <input
                id="veg"
                type="checkbox"
                value="veg"
                checked={category.includes("veg")}
                onChange={handleCategoryChange}
              />
            </div>
            <div className="checkboxContainer">
              <label htmlFor="nonVeg">Non-Veg</label>
              <input
                id="nonVeg"
                type="checkbox"
                value="non-veg"
                checked={category.includes("non-veg")}
                onChange={handleCategoryChange}
              />
            </div>
          </div>
        </div>

        <div className="checkInp">
          <label>Bestseller</label>
          <div className="inputsContainer">
            <div className="checkboxContainer">
              <label htmlFor="bestsellerYes">Yes</label>
              <input
                id="bestsellerYes"
                type="radio"
                value="true"
                checked={bestSeller === true}
                onChange={handleBestSeller}
              />
            </div>
            <div className="checkboxContainer">
              <label htmlFor="bestsellerNo">No</label>
              <input
                id="bestsellerNo"
                type="radio"
                value="false"
                checked={bestSeller === false}
                onChange={handleBestSeller}
              />
            </div>
          </div>
        </div>

        <label htmlFor="description">Description</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="image">Product Image</label>
        <input id="image" type="file" onChange={handleImageUpload} />

        <div className="btnSubmit">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
