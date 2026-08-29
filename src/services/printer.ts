import type { PrinterService, ReceiptData } from "@/types";

class ThermalPrinterService implements PrinterService {
  async getStatus(): Promise<{ connected: boolean; model?: string }> {
    await simulateDelay(300);
    return { connected: true, model: "Epson TM-T20III" };
  }

  async testPrint(): Promise<boolean> {
    await simulateDelay(500);
    return true;
  }

  async printReceipt(data: ReceiptData): Promise<boolean> {
    await simulateDelay(800);
    const receipt = buildReceiptText(data);
    console.log("Printing receipt:\n", receipt);
    return true;
  }
}

function buildReceiptText(data: ReceiptData): string {
  const { settings, transaction, customer } = data;
  const divider = "─".repeat(32);
  return [
    settings.businessName,
    divider,
    `Bill: ${transaction.billNumber}`,
    `Date: ${transaction.paidAt}`,
    divider,
    `Customer: ${customer.name}`,
    `Mobile: ${customer.mobile}`,
    divider,
    `Service: ${transaction.serviceName}`,
    `Amount: ₹${transaction.amount}`,
    `Payment: ${transaction.paymentMethod}`,
    divider,
    settings.billFooter,
  ].join("\n");
}

function simulateDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const printerService: PrinterService = new ThermalPrinterService();
