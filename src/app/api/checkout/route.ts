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
  // Mercado Pago rejects auto_return unless back_urls.success is a publicly
  // reachable URL — it 400s on localhost, so only enable it off-localhost.
  const isPubliclyReachable = !/^https?:\/\/localhost(:\d+)?/.test(baseUrl);

  const preference = new Preference(client);

  try {
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
        ...(isPubliclyReachable ? { auto_return: "approved" as const } : {}),
        statement_descriptor: "LAURA PEIXOTO",
        metadata: {
          buyer_email: email,
          print_ids: (items as CheckoutItem[]).map((i) => i.printId).join(","),
        },
      },
    });

    return NextResponse.json({ init_point: result.init_point });
  } catch (err) {
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: unknown }).message)
        : "Failed to create Mercado Pago preference";
    console.error("Mercado Pago preference creation failed:", err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
