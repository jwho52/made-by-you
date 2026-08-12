import { useState } from "react";
import "./App.css";

type Product = "T-Shirt" | "Hoodie" | "Hat";

const products: Record<Product, number> = {
  "T-Shirt": 24.99,
  Hoodie: 44.99,
  Hat: 24.99,
};

const colors = [
  { name: "Black", value: "#111111" },
  { name: "White", value: "#eeeeee" },
  { name: "Gray", value: "#777777" },
  { name: "Red", value: "#8f1717" },
  { name: "Blue", value: "#172f55" },
];

const sizes = ["S", "M", "L", "XL", "2XL"];

function App() {
  const [product, setProduct] = useState<Product>("T-Shirt");
  const [color, setColor] = useState(colors[0]);
  const [prompt, setPrompt] = useState("");
  const [generated, setGenerated] = useState(false);
  const [designs, setDesigns] = useState<string[]>([]);
  const [selectedDesign, setSelectedDesign] = useState(0);
  const [size, setSize] = useState("M");
  const [cart, setCart] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const generateDesign = async () => {
    if (!prompt.trim()) {
      setMessage("Tell us what you want to create first.");
      return;
    }

    setMessage("");
    setLoading(true);
    setGenerated(false);
    setDesigns([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          product,
          color: color.name,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Generation failed");
      }

      const data = await res.json();
      setDesigns(data.designs);
      setSelectedDesign(0);
      setGenerated(true);
    } catch (err: any) {
      setMessage(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    setCart((c) => c + 1);
    setMessage(product + " added to your cart.");
  };

  return (
    <div className="site">
      <header className="navbar">
        <div className="brand">
          <div className="brand-mark">M</div>
          MadeByYou
        </div>
        <nav>
          <a href="#create">CREATE</a>
          <a href="#shop">SHOP</a>
          <a href="#how">HOW IT WORKS</a>
        </nav>
        <button className="cart-button">Cart ({cart})</button>
      </header>

      <main>
        <section className="hero" id="create">
          <div className="hero-content">
            <div className="eyebrow">YOUR IDEA. YOUR DESIGN. YOUR CLOTHING.</div>
            <h1>
              MAKE
              <span>SOMETHING</span>
              <span>MADEBYYOU.</span>
            </h1>
            <p className="hero-text">
              Create your own custom streetwear from an idea in your head to something you can actually wear.
            </p>

            <div className="creator-box">
              <div className="creator-label">01 - WHAT ARE YOU CREATING?</div>
              <div className="product-options">
                {(Object.keys(products) as Product[]).map((item) => (
                  <button
                    key={item}
                    className={"product-option " + (product === item ? "selected" : "")}
                    onClick={() => setProduct(item)}
                  >
                    <div className="product-icon">
                      {item === "T-Shirt" ? "T" : item === "Hoodie" ? "H" : "C"}
                    </div>
                    <strong>{item}</strong>
                    <span>${products[item].toFixed(2)}</span>
                  </button>
                ))}
              </div>

              <div className="creator-label color-label">02 - CHOOSE YOUR COLOR</div>
              <div className="color-options">
                {colors.map((item) => (
                  <button
                    key={item.name}
                    className={"color-option " + (color.name === item.name ? "selected" : "")}
                    onClick={() => setColor(item)}
                  >
                    <span className="color-circle" style={{ background: item.value }} />
                    {item.name}
                  </button>
                ))}
              </div>

              <div className="creator-label prompt-label">03 - DESCRIBE YOUR DESIGN</div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: A black and white graffiti angel with red roses..."
                disabled={loading}
              />

              <div className="creator-bottom">
                <div className="hint">AI-powered design creation</div>
                <button className="create-button" onClick={generateDesign} disabled={loading}>
                  {loading ? "GENERATING..." : "GENERATE MY DESIGN"}
                </button>
              </div>

              {message && <div className="design-message">{message}</div>}
            </div>
          </div>
        </section>
