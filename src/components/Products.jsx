import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOption, setSortOption] = useState("");
  let componentMounted = true;

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
    toast.success("Added to cart");
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products/");
      if (componentMounted) {
        let products = await response.clone().json();

        // Add mock stock availability
        products = products.map((p, index) => ({
          ...p,
          inStock: index % 4 !== 0 // 1 in 4 products out of stock
        }));

        setData(products);
        setFilter(products);
        setLoading(false);
      }
      return () => {
        componentMounted = false;
      };
    };
    getProducts();
  }, []);

  const Loading = () => (
    <>
      {Array(6)
        .fill()
        .map((_, i) => (
          <div key={i} className="col-md-4 col-sm-6 col-12 mb-4">
            <Skeleton height={350} />
          </div>
        ))}
    </>
  );

  const filterProduct = (cat) => {
    setActiveCategory(cat);
    if (cat === "All") {
      setFilter(data);
    } else {
      setFilter(data.filter((item) => item.category === cat));
    }
  };

  const handleSort = (option) => {
    setSortOption(option);
    let sorted = [...filter];
    if (option === "priceLowHigh") sorted.sort((a, b) => a.price - b.price);
    if (option === "priceHighLow") sorted.sort((a, b) => b.price - a.price);
    setFilter(sorted);
  };

  const ShowProducts = () => (
    <>
      {/*Sort */}
      <div className="d-flex flex-wrap justify-content-between align-items-center py-3">
     
        <select
          className="form-select w-auto mb-2 right-0"
          style={{ cursor: "pointer" }}
          value={sortOption}
          onChange={(e) => handleSort(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
        </select>
      </div>

      {/* Filter Buttons */}
      <div className="buttons text-center py-4">
        {["All", "men's clothing", "women's clothing", "jewelery", "electronics"].map(
          (cat) => (
            <button
              key={cat}
              className={`btn btn-sm m-2 ${
                activeCategory === cat ? "btn-dark" : "btn-outline-dark"
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => filterProduct(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Product Cards */}
      {filter.map((product) => (
        <div
          key={product.id}
          className="col-md-4 col-sm-6 col-12 mb-4 d-flex align-items-stretch"
        >
          <div
            className={`card text-start h-100 shadow-sm`}
            style={{
              borderRadius: "12px",
              backgroundColor: "#f8f9fa",
              opacity: product.inStock ? 1 : 0.6
            }}
          >
            <div style={{ position: "relative", overflow: "hidden" }}>
              <img
                className="card-img-top p-3"
                src={product.image}
                alt={product.title}
                height={250}
                style={{
                  objectFit: "contain",
                  transition: "transform 0.3s ease",
                  cursor: product.inStock ? "pointer" : "not-allowed"
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              {!product.inStock && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "0px",
                    right: "-25px",
                    transform: "translateX(-50%)",
                    background: "red",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "0.85rem"
                  }}
                >
                  Out of Stock
                </span>
              )}
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between">
              <h5 className="card-title">
                <Link
                to={`/product/${product.id}`}
                className="text-black text-decoration-none"
                style={{ cursor: product.inStock ? "pointer" : "not-allowed" }}
                onClick={(e) => {
                  if (!product.inStock) e.preventDefault();
                }}
              >
              {product.title.length >25 ? product.title.substring(0,25)+"..." : product.title}
                </Link>
              </h5>
              <h5 className="fw-bold"
                  style={{
                    background: "teal",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "6px",}}>
                ${product.price.toFixed(2)}</h5>
              </div>
              <p className="small">
                {product.rating && product.rating.rate}{" "}
                <i className="fa fa-star"></i>
              </p>
              <p className="text-muted small">
                {product.description
                  ? product.description.charAt(0).toUpperCase() + 
                    product.description.slice(1, 100) + 
                    (product.description.length > 100 ? "..." : "")
                  : ""}              
              </p>
              
              {/* Sizes Dropdown */}
              {(product.category=="men's clothing"||product.category== "women's clothing") && (
              <select
                className="form-select mt-2"
                style={{ cursor: "pointer" }}
                disabled={!product.inStock}
              >
                <option>Select Size</option>
                <option>S</option>
                <option>M</option>
                <option>L</option>
                <option>XL</option>
              </select>
              )}
            </div>
            <div className="card-footer bg-transparent border-0 d-flex justify-content-center gap-2">
              <Link
                to={`/product/${product.id}`}
                className="btn btn-sm btn-outline-dark"
                style={{ cursor: product.inStock ? "pointer" : "not-allowed" }}
                onClick={(e) => {
                  if (!product.inStock) e.preventDefault();
                }}
              >
                See more
              </Link>
              <button
                className="btn btn-sm btn-dark font-weight-normal"
                style={{ cursor: product.inStock ? "pointer" : "not-allowed" }}
                onClick={() => product.inStock && addProduct(product)}
                disabled={!product.inStock}
              >
                +
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="container my-3 py-3">
      <div className="row">
        <div className="col-12 text-center">
          <h2 className="display-5">Latest Products</h2>
          <hr />
        </div>
      </div>
      <div className="row justify-content-center">
        {loading ? <Loading /> : <ShowProducts />}
      </div>
    </div>
  );
};

export default Products;
