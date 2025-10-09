import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined in environment variables");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMiddlemanNotification({
  middlemanEmail,
  serverName,
  buyerRobloxUsername,
  sellerRobloxUsername,
  tradeRequestId,
}: {
  middlemanEmail: string;
  serverName: string;
  buyerRobloxUsername: string;
  sellerRobloxUsername: string;
  tradeRequestId: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: middlemanEmail,
      subject: `New Trade Request - ${serverName}`,
      html: `
        <h2>New Trade Request</h2>
        <p>A new trade request has been received and paid for on <strong>${serverName}</strong>.</p>

        <h3>Trade Details:</h3>
        <ul>
          <li><strong>Buyer Roblox Username:</strong> ${buyerRobloxUsername}</li>
          <li><strong>Seller Roblox Username:</strong> ${sellerRobloxUsername}</li>
          <li><strong>Trade Request ID:</strong> ${tradeRequestId}</li>
        </ul>

        <p>Please coordinate the trade between the two parties in the private server.</p>
      `,
    });

    if (error) {
      console.error("Failed to send email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}
