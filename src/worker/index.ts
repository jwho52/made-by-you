export interface Env {
	AI: Ai;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		// Serve your static assets (Vite build) — assume you already have this
		if (url.pathname.startsWith("/api/generate") && request.method === "POST") {
			try {
				const body = await request.json() as {
					prompt: string;
					product: string;
					color: string;
				};

				const basePrompt = `${body.prompt}, streetwear graphic design, bold, high contrast, clean background, print-ready, for a ${body.product}, ${body.color} garment style`;

				// Generate 4 variations
				const designs: string[] = [];

				for (let i = 0; i < 4; i++) {
					const result = await env.AI.run(
						"@cf/black-forest-labs/flux-1-schnell", // or flux-1-dev / dreamshaper etc.
						{
							prompt: `${basePrompt}, variation ${i + 1}, unique composition`,
							num_steps: 4, // schnell is fast
						}
					);

					// result is usually a ReadableStream or Uint8Array of the image
					const arrayBuffer = await new Response(result).arrayBuffer();
					const base64 = btoa(
						String.fromCharCode(...new Uint8Array(arrayBuffer))
					);
					designs.push(`data:image/jpeg;base64,${base64}`);
				}

				return Response.json({ designs });
			} catch (err: any) {
				return new Response(err.message || "AI error", { status: 500 });
			}
		}

		// Fallback: serve your built frontend
		// (however you currently serve the Vite dist)
		return new Response("Not found", { status: 404 });
	},
};
