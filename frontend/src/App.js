import { useEffect, useState } from "react";
import "./App.css";

 const API_URL = "https://practice1-production.up.railway.app/api/items";

function App() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    category: "",
    price: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchItems = async () => {
    try {
      setError("");
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }

      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          quantity: Number(formData.quantity),
          category: formData.category,
          price: Number(formData.price)
        })
      });

      if (!response.ok) {
        throw new Error("Failed to add item");
      }

      setFormData({
        name: "",
        quantity: "",
        category: "",
        price: ""
      });
      await fetchItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app">
      <section className="hero">
        <div>
          <p className="eyebrow">Inventory</p>
          <h1>Item Manager</h1>
        </div>
      </section>

      <section className="content">
        <form className="item-form" onSubmit={handleSubmit}>
          <h2>Add Item</h2>

          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          <label htmlFor="category">Category</label>
          <input
            id="category"
            name="category"
            type="text"
            value={formData.category}
            onChange={handleChange}
            required
          />

          <label htmlFor="price">Price</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />  


          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Item"}
          </button>

          {error && <p className="error">{error}</p>}
        </form>

        <div className="item-list">
          <h2>Items</h2>

          {items.length === 0 ? (
            <p className="empty">No items yet.</p>
          ) : (
            <ul>
              {items.map((item) => (
                <li key={item._id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.category}</span>
                  </div>
                  <span className="quantity">{item.quantity}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;

