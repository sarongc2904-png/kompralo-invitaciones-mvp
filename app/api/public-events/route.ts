import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Para finalizar y publicar tu invitacion primero debes completar el pago."
    },
    { status: 402 }
  );
}
