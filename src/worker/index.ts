export interface Env {
  AI: Ai;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/generate" && request.method === "POST") {
      try {
        const body = (await request.json()) as {
          prompt: string;
          product: string;
          color: string;
        };

        const basePrompt = `${body.prompt}, streetwear graphic design, bold, high contrast, clean background, print-ready for a ${body.product}, ${body.color} style`;

        const designs: string[] = [];

        for (let i = 0; i < 4; i++) {
          const result = await env.AI.run("@cf/black-forest-labs/flux-1-schnell", {
            prompt: `${basePrompt}, variation ${i + 1}`,
            num_steps: 4,
          });

          const response = new Response(result as BodyInit);
          const arrayBuffer = await response.arrayBuffer();
          const bytes = new Uint8Array(arrayBuffer);
          let binary = "";
          for (let j = 0; j < bytes.length; j++) {
            binary += String.fromCharCode(bytes[j]);
          }
          designs.push(`data:image/jpeg;base64,${btoa(binary)}`);
        }

        return Response.json({ designs });
      } catch (err: any) {
        return new Response(err?.message || "AI error", { status: 500 });
      }
    }

    return new Response("Not found", { status: 404 });
  },
};
