import { NextRequest, NextResponse } from "next/server";
import MercadoPagoConfig, { Preference } from "mercadopago";
import { getPrintById } from "@/lib/prints";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

type CheckoutItem = {
  printId: string;
  sizeLabel: string;
  title: string;
  dimensions: string;
  price: number;
  quantity?: number;
};

export async function POST(req: NextRequest) {
  const { items, email, locale } = await req.json();

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "No items provided" }, { status: 400 });
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Validate each item against source data — never trust client prices
  const preferenceItems = [];
  for (const item of items as CheckoutItem[]) {
    const { printId, sizeLabel } = item;

    if (!printId || !sizeLabel) {
      return NextResponse.json({ error: "Invalid item" }, { status: 400 });
    }

    const print = getPrintById(printId);
    if (!print) {
      return NextResponse.json(
        { error: `Print not found: ${printId}` },
        { status: 400 }
      );
    }

    const size = print.sizes.find((s) => s.label === sizeLabel);
    if (!size) {
      return NextResponse.json(
        { error: `Size not found: ${sizeLabel}` },
        { status: 400 }
      );
    }

    preferenceItems.push({
      id: `${printId}-${sizeLabel}`,
      title: `${print.title} — ${size.dimensions}`,
      description: `Impressão fine-art em edição limitada. Laura Peixoto Photography.`,
      quantity: Math.max(1, Number(item.quantity) || 1),
      unit_price: size.price / 100, // MP expects BRL, not cents
      currency_id: "BRL",
    });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const localePath = locale === "pt-BR" ? "/pt-BR" : "/en";

  const preference = new Preference(client);

  const result = await preference.create({
    body: {
      items: preferenceItems,
      payer: {
        email,
      },
      back_urls: {
        success: `${baseUrl}${localePath}/success`,
        failure: `${baseUrl}${localePath}/failure`,
        pending: `${baseUrl}${localePath}/pending`,
      },
      auto_return: "approved",
      statement_descriptor: "LAURA PEIXOTO",
      metadata: {
        buyer_email: email,
        print_ids: (items as CheckoutItem[]).map((i) => i.printId).join(","),
      },
    },
  });

  return NextResponse.json({ init_point: result.init_point });
}
