import { useState } from "react";
import "./App.css";

type Product = {
	name: string;
	icon: string;
	price: string;
	description: string;
};

const products: Product[] = [
	{
		name: "T-Shirts",
		icon: "👕",
		price: "From $24.99",
		description: "Your design, printed on a premium everyday tee.",
	},
	{
		name: "Hoodies",
		icon: "🧥",
		price: "From $44.99",
		description: "Comfortable hoodies made for your custom designs.",
	},
	{
		name: "Hats",
		icon: "🧢",
		price: "From $24.99",
		description: "Put your design on a hat and make it yours.",
	},
];

function App() {
	const [prompt, setPrompt] = useState("");
	const [started, setStarted] = useState(false);

	const handleCreate = () => {
		if (prompt.trim()) {
			setStarted(true);
		}
	};

	return (
		<div className="site">
			<header className="navbar">
				<div className="brand">
					<span className="brand-mark">M</span>
					<span>MadeByYou</span>
				</div>

				<nav>
					<a href="#create">Create</a>
					<a href="#shop">Shop</a>
					<a href="#how-it-works">How It Works</a>
				</nav>

				<button className="cart-button">Cart (0)</button>
			</header>

			<main>
				<section className="hero" id="create">
					<div className="hero-content">
						<div className="eyebrow">YOUR IDEA. YOUR DESIGN. YOUR CLOTHING.</div>

						<h1>
							Make something
							<span> MadeByYou.</span>
						</h1>

						<p className="hero-text">
							Describe what you imagine and turn it into a custom design
							you can actually wear.
						</p>

						<div className="creator-box">
							<div className="creator-label">What do you want to create?</div>

							<textarea
								value={prompt}
								onChange={(event) => setPrompt(event.target.value)}
								placeholder="Example: A colorful sunset over the ocean with palm trees and a retro 80s style..."
								rows={4}
							/>

							<div className="creator-bottom">
								<span className="hint">✨ AI-powered design creation</span>

								<button className="create-button" onClick={handleCreate}>
									{started ? "DESIGN STARTED ✓" : "CREATE MY DESIGN →"}
								</button>
							</div>
						</div>

						{started && (
							<div className="design-message">
								<strong>Your idea:</strong> {prompt}
								<br />
								<span>
									Our AI designer will turn this into your custom artwork.
								</span>
							</div>
						)}
					</div>
				</section>

				<section className="products-section" id="shop">
					<div className="section-heading">
						<div>
							<div className="eyebrow">CHOOSE YOUR CANVAS</div>
							<h2>Wear your design.</h2>
						</div>

						<p>
							Create something unique and put it on clothing you'll
							actually want to wear.
						</p>
					</div>

					<div className="product-grid">
						{products.map((product) => (
							<div className="product-card" key={product.name}>
								<div className="product-image">
									<span>{product.icon}</span>
								</div>

								<div className="product-info">
									<h3>{product.name}</h3>
									<p>{product.description}</p>
									<div className="product-footer">
										<strong>{product.price}</strong>
										<button>Customize →</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</section>

				<section className="how-section" id="how-it-works">
					<div className="eyebrow">HOW IT WORKS</div>
					<h2>From an idea to something you can wear.</h2>

					<div className="steps">
						<div className="step">
							<span>01</span>
							<h3>Describe</h3>
							<p>Tell us exactly what you want your design to look like.</p>
						</div>

						<div className="step">
							<span>02</span>
							<h3>Create</h3>
							<p>Our AI turns your idea into custom artwork.</p>
						</div>

						<div className="step">
							<span>03</span>
							<h3>Customize</h3>
							<p>Adjust your design until it feels right.</p>
						</div>

						<div className="step">
							<span>04</span>
							<h3>Wear</h3>
							<p>Order your clothing and have it delivered to you.</p>
						</div>
					</div>
				</section>

				<section className="final-cta">
					<div className="eyebrow">MADE FOR YOU</div>
					<h2>There are no limits to your imagination.</h2>
					<p>Start with an idea. End with something that's yours.</p>

					<a href="#create" className="final-button">
						START CREATING →
					</a>
				</section>
			</main>

			<footer>
				<div className="brand">
					<span className="brand-mark">M</span>
					<span>MadeByYou</span>
				</div>

				<p>© 2026 MadeByYou. Made for you.</p>
			</footer>
		</div>
	);
}

export default App;
