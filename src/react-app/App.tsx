import { useState } from "react";
import "./App.css";

type Product = "T-Shirt" | "Hoodie" | "Hat";

const products: Record<Product, number> = {
	"T-Shirt": 24.99,
	"Hoodie": 44.99,
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
	const [selectedDesign, setSelectedDesign] = useState(0);
	const [size, setSize] = useState("M");
	const [cart, setCart] = useState(0);
	const [message, setMessage] = useState("");

	const generateDesign = () => {
		if (!prompt.trim()) {
			setMessage("Tell us what you want to create first.");
			return;
		}

		setMessage("");
		setGenerated(true);
		setSelectedDesign(0);
	};

	const addToCart = () => {
		setCart((current) => current + 1);
		setMessage(`${product} added to your cart.`);
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

				<button className="cart-button">
					Cart ({cart})
				</button>
			</header>

			<main>
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
							Create your own custom streetwear from an idea in your
							head to something you can actually wear.
						</p>

						<div className="creator-box">
							<div className="creator-label">
								01 — WHAT ARE YOU CREATING?
							</div>

							<div className="product-options">
								{(Object.keys(products) as Product[]).map((item) => (
									<button
										key={item}
										className={`product-option ${
											product === item ? "selected" : ""
										}`}
										onClick={() => setProduct(item)}
									>
										<div className="product-icon">
											{item === "T-Shirt"
												? "👕"
												: item === "Hoodie"
													? "🧥"
													: "🧢"}
										</div>

										<strong>{item}</strong>
										<span>${products[item].toFixed(2)}</span>
									</button>
								))}
							</div>

							<div className="creator-label color-label">
								02 — CHOOSE YOUR COLOR
							</div>

							<div className="color-options">
								{colors.map((item) => (
									<button
										key={item.name}
										className={`color-option ${
											color.name === item.name ? "selected" : ""
										}`}
										onClick={() => setColor(item)}
										title={item.name}
									>
										<span
											className="color-circle"
											style={{ background: item.value }}
										/>
										{item.name}
									</button>
								))}
							</div>

							<div className="creator-label prompt-label">
								03 — DESCRIBE YOUR DESIGN
							</div>

							<textarea
								value={prompt}
								onChange={(event) => setPrompt(event.target.value)}
								placeholder="Example: A black and white graffiti angel with red roses, bold streetwear style..."
							/>

							<div className="creator-bottom">
								<div className="hint">
									✨ AI-powered design creation
								</div>

								<button
									className="create-button"
									onClick={generateDesign}
								>
									GENERATE MY DESIGN →
								</button>
							</div>

							{message && (
								<div className="design-message">{message}</div>
							)}
						</div>
					</div>
				</section>

				{generated && (
					<section className="design-section">
						<div className="eyebrow">YOUR CREATION</div>

						<h2>CHOOSE YOUR DESIGN.</h2>

						<p className="design-intro">
							Your idea is ready. Choose the version you want
							to put on your {product.toLowerCase()}.
						</p>

						<div className="design-layout">
							<div className="design-choices">
								{[0, 1, 2, 3].map((index) => (
									<button
										key={index}
										className={`design-card ${
											selectedDesign === index ? "selected" : ""
										}`}
										onClick={() => setSelectedDesign(index)}
									>
										<div
											className="generated-art"
											style={{
												background:
													index % 2 === 0
														? "linear-gradient(135deg, #252525, #050505)"
														: "linear-gradient(135deg, #444, #101010)",
											}}
										>
											<span>
												{index === 0
													? "01"
													: index === 1
														? "02"
														: index === 2
															? "03"
															: "04"}
											</span>
										</div>

										<strong>DESIGN {index + 1}</strong>
									</button>
								))}
							</div>

							<div className="clothing-preview">
								<div
									className={`clothing ${
										product === "Hoodie"
											? "hoodie"
											: product === "Hat"
												? "hat"
												: "shirt"
									}`}
									style={{
										background: color.value,
									}}
								>
									<div className="clothing-design">
										<span>MBY</span>
										<small>DESIGN {selectedDesign + 1}</small>
									</div>
								</div>

								<div className="preview-info">
									<strong>{product}</strong>
									<span>{color.name}</span>
								</div>
							</div>
						</div>

						<div className="purchase-box">
							<div>
								<div className="creator-label">04 — SELECT SIZE</div>

								<div className="size-options">
									{sizes.map((item) => (
										<button
											key={item}
											className={size === item ? "selected" : ""}
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
									<strong>${products[product].toFixed(2)}</strong>
								</div>

								<button
									className="create-button"
									onClick={addToCart}
								>
									ADD TO CART →
								</button>
							</div>
						</div>
					</section>
				)}

				<section className="products-section" id="shop">
					<div className="section-heading">
						<div>
							<div className="eyebrow">THE COLLECTION</div>
							<h2>START<br />WITH A BLANK.</h2>
						</div>

						<p>
							Choose your piece. Create your design. Make it
							yours.
						</p>
					</div>

					<div className="product-grid">
						{(Object.keys(products) as Product[]).map((item) => (
							<button
								key={item}
								className="product-card"
								onClick={() => {
									setProduct(item);
									document
										.getElementById("create")
										?.scrollIntoView({ behavior: "smooth" });
								}}
							>
								<div className="product-image">
									<span>
										{item === "T-Shirt"
											? "👕"
											: item === "Hoodie"
												? "🧥"
												: "🧢"}
									</span>
								</div>

								<div className="product-info">
									<h3>{item}</h3>
									<p>
										Your blank canvas for whatever you
										want to create.
									</p>

									<div className="product-footer">
										<strong>
											${products[item].toFixed(2)}
										</strong>
										<span>CREATE →</span>
									</div>
								</div>
							</button>
						))}
					</div>
				</section>

				<section className="how-section" id="how">
					<div className="eyebrow">HOW IT WORKS</div>

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
								Pick a shirt, hoodie, or hat to start your
								design.
							</p>
						</div>

						<div className="step">
							<span>02</span>
							<h3>CREATE</h3>
							<p>
								Describe your idea and turn your imagination
								into artwork.
							</p>
						</div>

						<div className="step">
							<span>03</span>
							<h3>CUSTOMIZE</h3>
							<p>
								Choose your colors, size, placement, and
								favorite design.
							</p>
						</div>

						<div className="step">
							<span>04</span>
							<h3>WEAR IT</h3>
							<p>
								Add it to your cart and eventually have it
								printed and shipped to your door.
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

				<p>YOUR IDEA. YOUR DESIGN. YOUR CLOTHING.</p>
			</footer>
		</div>
	);
}

export default App;
