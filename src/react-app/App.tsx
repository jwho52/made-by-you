import { useState, type CSSProperties } from "react";
import shirtMockup from "./assets/shirt_transparent.png";
import hoodieMockup from "./assets/hoodie_transparent.png";
import hatMockup from "./assets/hat_transparent.png";
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
        headers: {
          "Content-Type": "application/json",
        },
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

      if (!Array.isArray(data.designs) || data.designs.length === 0) {
        throw new Error("No designs were returned.");
      }

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

    setMessage(
      `${product} • ${color.name} • Size ${size} added to your cart.`
    );
  };

  const getMockup = () => {
    if (product === "Hoodie") {
      return hoodieMockup;
    }

    if (product === "Hat") {
      return hatMockup;
    }

    return shirtMockup;
  };

  const productClass = product
    .toLowerCase()
    .replace("-", "")
    .replace(" ", "");

  return (
    <div className="site">
      {/* NAVIGATION */}

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

        <button className="cart-button">
          Cart ({cart})
        </button>
      </header>

      <main>
        {/* HERO */}

        <section className="hero" id="create">
          <div className="hero-content">
            <div className="eyebrow">
              YOUR IDEA. YOUR DESIGN. YOUR CLOTHING.
            </div>

            <h1>
              MAKE
              <span>SOMETHING</span>
              <span>MADEBYYOU.</span>
            </h1>

            <p className="hero-text">
              Create your own custom streetwear from an idea in your head
              to something you can actually wear.
            </p>

            {/* CREATOR */}

            <div className="creator-box">
              <div className="creator-label">
                01 - WHAT ARE YOU CREATING?
              </div>

              <div className="product-options">
                {(Object.keys(products) as Product[]).map((item) => (
                  <button
                    key={item}
                    className={
                      "product-option " +
                      (product === item ? "selected" : "")
                    }
                    onClick={() => setProduct(item)}
                  >
                    <div className="product-icon">
                      {item === "T-Shirt"
                        ? "T"
                        : item === "Hoodie"
                        ? "H"
                        : "C"}
                    </div>

                    <strong>{item}</strong>

                    <span>
                      ${products[item].toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>

              <div className="creator-label color-label">
                02 - CHOOSE YOUR COLOR
              </div>

              <div className="color-options">
                {colors.map((item) => (
                  <button
                    key={item.name}
                    className={
                      "color-option " +
                      (color.name === item.name ? "selected" : "")
                    }
                    onClick={() => setColor(item)}
                  >
                    <span
                      className="color-circle"
                      style={{
                        background: item.value,
                      }}
                    />

                    {item.name}
                  </button>
                ))}
              </div>

              <div className="creator-label prompt-label">
                03 - DESCRIBE YOUR DESIGN
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: A black and white graffiti angel with red roses..."
                disabled={loading}
              />

              <div className="creator-bottom">
                <div className="hint">
                  ✨ AI-powered design creation
                </div>

                <button
                  className="create-button"
                  onClick={generateDesign}
                  disabled={loading}
                >
                  {loading
                    ? "GENERATING..."
                    : "GENERATE MY DESIGN"}
                </button>
              </div>

              {message && (
                <div className="design-message">
                  {message}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* DESIGN RESULTS */}

        {generated && designs.length > 0 && (
          <section className="design-section">
            <div className="eyebrow">
              YOUR CREATION
            </div>

            <h2>CHOOSE YOUR DESIGN.</h2>

            <p className="design-intro">
              Choose the version you want on your{" "}
              {product.toLowerCase()}.
            </p>

            <div className="design-layout">
              {/* DESIGN CHOICES */}

              <div className="design-choices">
                {designs.map((img, index) => (
                  <button
                    key={index}
                    className={
                      "design-card " +
                      (selectedDesign === index
                        ? "selected"
                        : "")
                    }
                    onClick={() =>
                      setSelectedDesign(index)
                    }
                  >
                    <div className="generated-art">
                      <img
                        src={img}
                        alt={`Design ${index + 1}`}
                      />
                    </div>

                    <strong>
                      DESIGN {index + 1}
                    </strong>
                  </button>
                ))}
              </div>

              {/* PRODUCT PREVIEW */}

              <div className="clothing-preview">
                <div className="mockup-label">
                  LIVE PRODUCT PREVIEW
                </div>

                <div
                  className={`real-product ${productClass}`}
                  style={
                    {
                      "--product-color": color.value,
                      "--garment-image": `url("${getMockup()}")`,
                    } as CSSProperties
                  }
                >
                  {/* COLOR BASE */}

                  <div className="garment-color" />

                  {/* GARMENT SHADING */}

                  <img
                    className="mockup-garment"
                    src={getMockup()}
                    alt={`${product} mockup`}
                  />

                  {/* DESIGN */}

                  {designs[selectedDesign] && (
                    <div className="mockup-print">
                      <img
                        src={designs[selectedDesign]}
                        alt="Your design on product"
                      />
                    </div>
                  )}

                  {/* FABRIC TEXTURE */}

                  <div className="print-texture" />
                </div>

                <div className="preview-info">
                  <strong>{product}</strong>

                  <span>
                    {color.name} • Custom Made
                  </span>
                </div>
              </div>
            </div>

            {/* PURCHASE */}

            <div className="purchase-box">
              <div>
                <div className="creator-label">
                  04 - SELECT SIZE
                </div>

                <div className="size-options">
                  {sizes.map((item) => (
                    <button
                      key={item}
                      className={
                        size === item
                          ? "selected"
                          : ""
                      }
                      onClick={() => setSize(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="purchase-action">
                <div>
                  <span>{product}</span>

                  <strong>
                    ${products[product].toFixed(2)}
                  </strong>
                </div>

                <button
                  className="create-button"
                  onClick={addToCart}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </section>
        )}

        {/* SHOP */}

        <section
          className="products-section"
          id="shop"
        >
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                THE COLLECTION
              </div>

              <h2>
                START
                <br />
                WITH A BLANK.
              </h2>
            </div>

            <p>
              Choose your piece. Create your design.
              Make it yours.
            </p>
          </div>

          <div className="product-grid">
            {(Object.keys(products) as Product[]).map(
              (item) => (
                <button
                  key={item}
                  className="product-card"
                  onClick={() => {
                    setProduct(item);

                    document
                      .getElementById("create")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      });
                  }}
                >
                  <div className="product-image">
                    <img
                      src={
                        item === "T-Shirt"
                          ? shirtMockup
                          : item === "Hoodie"
                          ? hoodieMockup
                          : hatMockup
                      }
                      alt={item}
                    />
                  </div>

                  <div className="product-info">
                    <h3>{item}</h3>

                    <p>
                      Your blank canvas for whatever
                      you want to create.
                    </p>

                    <div className="product-footer">
                      <strong>
                        ${products[item].toFixed(2)}
                      </strong>

                      <span>CREATE</span>
                    </div>
                  </div>
                </button>
              )
            )}
          </div>
        </section>

        {/* HOW IT WORKS */}

        <section
          className="how-section"
          id="how"
        >
          <div className="eyebrow">
            HOW IT WORKS
          </div>

          <h2>
            YOU IMAGINE IT.
            <br />
            WE MAKE IT REAL.
          </h2>

          <div className="steps">
            <div className="step">
              <span>01</span>
              <h3>CHOOSE</h3>
              <p>
                Pick a shirt, hoodie, or hat to start
                your design.
              </p>
            </div>

            <div className="step">
              <span>02</span>
              <h3>CREATE</h3>
              <p>
                Describe your idea and turn your
                imagination into artwork.
              </p>
            </div>

            <div className="step">
              <span>03</span>
              <h3>CUSTOMIZE</h3>
              <p>
                Choose your colors, size, and
                favorite design.
              </p>
            </div>

            <div className="step">
              <span>04</span>
              <h3>WEAR IT</h3>
              <p>
                Add it to your cart and have it
                printed and shipped.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="brand">
          <div className="brand-mark">M</div>
          MadeByYou
        </div>

        <p>
          YOUR IDEA. YOUR DESIGN. YOUR CLOTHING.
        </p>
      </footer>
    </div>
  );
}

export default App;
