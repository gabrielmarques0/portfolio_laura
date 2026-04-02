import { NextRequest, NextResponse } from "next/server";
import MercadoPagoConfig, {
  Preference,
} from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  const { printId, sizeLabel, title, dimensions, price, locale } =
    await req.json();

  if (!printId || !sizeLabel || !title || !price) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const localePath = locale === "pt-BR" ? "/pt-BR" : "/en";

  const preference = new Preference(client);

  const result = await preference.create({
    body: {
      items: [
        {
          id: `${printId}-${sizeLabel}`,
          title: `${title} — ${dimensions}`,
          description: `Impressão fine-art em edição limitada. Laura Peixoto Photography.`,
          quantity: 1,
          unit_price: price / 100, // MP expects BRL, not cents
          currency_id: "BRL",
        },
      ],
      back_urls: {
        success: `${baseUrl}${localePath}/success`,
        failure: `${baseUrl}${localePath}/failure`,
        pending: `${baseUrl}${localePath}/success`,
      },
      auto_return: "approved",
      statement_descriptor: "LAURA PEIXOTO",
      metadata: {
        print_id: printId,
        size_label: sizeLabel,
      },
    },
  });

  return NextResponse.json({ init_point: result.init_point });
}
