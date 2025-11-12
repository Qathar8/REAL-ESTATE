import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import type { Client, Property } from "@/types";

type ReceiptPayload = {
  companyName: string;
  companyAddress?: string;
  logoUrl?: string;
  client: Client;
  property: Property;
  amount: number;
  issuedAt: string;
  receiptNumber: string;
};

export const generateReceiptPdf = async ({
  companyName,
  companyAddress,
  logoUrl,
  client,
  property,
  amount,
  issuedAt,
  receiptNumber
}: ReceiptPayload) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { width, height } = page.getSize();

  const drawText = (
    text: string,
    x: number,
    y: number,
    size = 12,
    options: { color?: { r: number; g: number; b: number } } = {}
  ) => {
    page.drawText(text, {
      x,
      y,
      size,
      font,
      color: options.color
        ? rgb(options.color.r, options.color.g, options.color.b)
        : rgb(0.1, 0.1, 0.1)
    });
  };

  if (logoUrl) {
    try {
      const response = await fetch(logoUrl);
      const logoBytes = await response.arrayBuffer();
      const logoImage = await pdfDoc.embedPng(logoBytes);
      const scaled = logoImage.scale(0.25);
      page.drawImage(logoImage, {
        x: 40,
        y: height - 100,
        width: scaled.width,
        height: scaled.height
      });
    } catch (error) {
      console.warn("Failed to load logo for receipt PDF", error);
    }
  }

  drawText(companyName, 40, height - 60, 18);
  if (companyAddress) {
    drawText(companyAddress, 40, height - 80, 11);
  }

  drawText(`Receipt #${receiptNumber}`, width - 200, height - 60, 16, {
    color: { r: 0.1, g: 0.2, b: 0.6 }
  });
  drawText(`Issued on: ${issuedAt}`, width - 200, height - 80, 11);

  const sectionStartY = height - 140;
  drawText("Bill To", 40, sectionStartY, 13, {
    color: { r: 0.1, g: 0.2, b: 0.6 }
  });
  drawText(client.name, 40, sectionStartY - 20);
  drawText(client.email, 40, sectionStartY - 36);
  drawText(client.phone, 40, sectionStartY - 52);

  drawText("Property Details", 300, sectionStartY, 13, {
    color: { r: 0.1, g: 0.2, b: 0.6 }
  });
  drawText(property.name, 300, sectionStartY - 20);
  if (property.location) {
    drawText(property.location, 300, sectionStartY - 36);
  }
  drawText(`Category: ${property.category}`, 300, sectionStartY - 52);

  const amountY = sectionStartY - 120;
  page.drawRectangle({
    x: 40,
    y: amountY,
    width: width - 80,
    height: 120,
    color: rgb(0.95, 0.97, 1)
  });

  drawText("Payment Summary", 60, amountY + 90, 14, {
    color: { r: 0.1, g: 0.2, b: 0.6 }
  });
  drawText(`Amount Paid: $${amount.toLocaleString()}`, 60, amountY + 60, 12);
  drawText(`Property: ${property.name}`, 60, amountY + 40, 12);
  drawText(`Receipt Date: ${issuedAt}`, 60, amountY + 20, 12);

  drawText(
    "Thank you for choosing our services!",
    40,
    100,
    12,
    { color: { r: 0.1, g: 0.2, b: 0.6 } }
  );

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const fileName = `receipt-${receiptNumber}.pdf`;

  return { blob, fileName };
};

