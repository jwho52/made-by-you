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
          const result: any = await env.AI.run(
            "@cf/black-forest-labs/flux-1-schnell",
            {
              prompt: `${basePrompt}, variation ${i + 1}`,
              num_steps: 4,
            }
          );

          // Workers AI image models return a ReadableStream or Uint8Array
          let bytes: Uint8Array;

          if (result instanceof ReadableStream) {
            const buffer = await new Response(result).arrayBuffer();
            bytes = new Uint8Array(buffer);
          } else if (result instanceof ArrayBuffer) {
            bytes = new Uint8Array(result);
          } else if (result instanceof Uint8Array) {
            bytes = result;
          } else if (typeof result === "object" && result !== null) {
            // Sometimes it comes as { image: base64 } or similar
            if (typeof result.image === "string") {
              designs.push(
                result.image.startsWith("data:")
                  ? result.image
                  : `data:image/jpeg;base64,${result.image}`
              );
              continue;
            }
            // Last resort – try to treat it as binary-ish
            const buffer = await new Response(result as any).arrayBuffer();
            bytes = new Uint8Array(buffer);
          } else {
            throw new Error("Unexpected AI response type");
          }

          let binary = "";
          for (let j = 0; j < bytes.length; j++) {
            binary += String.fromCharCode(bytes[j]);
          }
          designs.push(`data:image/jpeg;base64,${btoa(binary)}`);
        }

        return Response.json({ designs });
      } catch (err: any) {
        console.error(err);
        return new Response(err?.message || "AI error", { status: 500 });
      }
    }

    return new Response("Not found", { status: 404 });
  },
};
