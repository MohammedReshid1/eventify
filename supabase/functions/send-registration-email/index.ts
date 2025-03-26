
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { QRCode } from "npm:qrcode@1.5.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RegistrationEmailRequest {
  userEmail: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventImageUrl: string;
  eventDescription: string;
  meetingUrl?: string;
  ticketType: string;
  quantity: number;
  ticketId: string;
  eventId: string;
  fullName?: string; // Add full name to the request
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received registration email request");
    const {
      userEmail,
      eventTitle,
      eventDate,
      eventLocation,
      eventImageUrl,
      eventDescription,
      meetingUrl,
      ticketType,
      quantity,
      ticketId,
      eventId,
      fullName = "Attendee" // Default if not provided
    }: RegistrationEmailRequest = await req.json();

    // Generate shorter ticket ID (first 8 chars)
    const shortTicketId = ticketId.substring(0, 8);
    
    console.log("Generating QR code for ticket:", shortTicketId);
    
    // Create data to encode in QR code
    const qrData = JSON.stringify({
      ticketId: shortTicketId,
      eventId,
      userEmail,
      fullName,
      eventTitle,
      ticketType
    });
    
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      width: 200,
      margin: 2,
      color: {
        dark: "#F97316",
        light: "#FFFFFF",
      },
    });

    console.log("Sending email to:", userEmail);
    
    const emailResponse = await resend.emails.send({
      from: "Eventify <onboarding@resend.dev>",
      to: [userEmail],
      subject: `Registration Confirmed: ${eventTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-flex; align-items: center; gap: 8px;">
              <div style="width: 32px; height: 32px; background-color: #F97316; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS10aWNrZXQiPjxsaW5lIHgxPSI5IiB5MT0iMTAiIHgyPSI5IiB5Mj0iMTYiLz48bGluZSB4MT0iOSIgeTE9IjE0IiB4Mj0iMTUiIHkyPSIxNCIvPjxwYXRoIGQ9Ik0yMCA5VjZhMiAyIDAgMCAwLTItMkg2YTIgMiAwIDAgMC0yIDJ2M2EyIDIgMCAxIDEgMCA0djNhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0ydi0zYTIgMiAwIDEgMSAwLTQiLz48L3N2Zz4=" alt="Ticket Icon" style="width: 20px; height: 20px;" />
              </div>
              <span style="color: #F97316; font-size: 24px; font-weight: bold;">Eventify</span>
            </div>
          </div>
          
          <h1 style="color: #F97316;">Registration Confirmed!</h1>
          <p>Thank you for registering for ${eventTitle}!</p>
          
          <div style="border-radius: 8px; overflow: hidden; margin: 20px 0;">
            <img src="${eventImageUrl}" alt="${eventTitle}" style="width: 100%; height: 200px; object-fit: cover;" />
          </div>
          
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Event Details</h2>
            <p><strong>Attendee:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Date:</strong> ${eventDate}</p>
            <p><strong>Location:</strong> ${eventLocation}</p>
            <p><strong>Ticket Type:</strong> ${ticketType}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Ticket ID:</strong> ${shortTicketId}</p>
            <p><strong>Event ID:</strong> ${eventId.substring(0, 8)}</p>
            ${meetingUrl ? `<p><strong>Meeting URL:</strong> <a href="${meetingUrl}">${meetingUrl}</a></p>` : ''}
          </div>

          <div style="margin: 20px 0;">
            <h2 style="color: #333;">Event Description</h2>
            <p style="line-height: 1.6;">${eventDescription}</p>
          </div>
          
          <div style="margin: 20px 0; text-align: center;">
            <h2 style="color: #333;">Your Ticket QR Code</h2>
            <div style="display: inline-block; padding: 15px; background-color: white; border-radius: 8px; border: 1px solid #eee;">
              <img src="${qrCodeDataUrl}" alt="Ticket QR Code" style="width: 200px; height: 200px;" />
            </div>
            <p style="font-size: 0.9em; color: #666; margin-top: 10px;">Please show this QR code when attending the event</p>
          </div>

          <p style="color: #666;">If you have any questions, please don't hesitate to contact us.</p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666;">
            <p>Best regards,<br>The Eventify Team</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `${eventTitle.replace(/\s+/g, '-')}-ticket.pdf`,
          content: await generateTicketPDF(
            eventTitle, 
            eventDate, 
            eventLocation, 
            ticketType, 
            quantity, 
            shortTicketId, 
            eventId.substring(0, 8), 
            eventImageUrl, 
            qrCodeDataUrl,
            fullName,
            userEmail
          ),
        },
      ],
    });

    console.log("Registration email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ ...emailResponse, ticketId: shortTicketId }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending registration email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Function to generate a PDF ticket
async function generateTicketPDF(
  eventTitle: string,
  eventDate: string,
  eventLocation: string,
  ticketType: string,
  quantity: number,
  ticketId: string,
  eventId: string,
  eventImageUrl: string,
  qrCodeDataUrl: string,
  fullName: string,
  userEmail: string
): Promise<string> {
  // Import PDFKit dynamically
  const PDFDocument = (await import("npm:pdfkit@0.14.0")).default;
  
  // Create a document
  const doc = new PDFDocument({
    size: 'A4',
    margin: 50,
    bufferPages: true,
  });

  // Convert the document to a base64 string
  return new Promise((resolve) => {
    const buffers: Uint8Array[] = [];
    doc.on('data', (buffer) => buffers.push(buffer));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData.toString('base64'));
    });

    // Add event details to the PDF
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#F97316').text('EVENTIFY', { align: 'center' });
    doc.fontSize(20).text(`Event Ticket: ${eventTitle}`, { align: 'center' });
    doc.moveDown();
    
    // Add a line
    doc.strokeColor('#F97316').lineWidth(2).moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
    doc.moveDown();

    // Attendee details
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000').text('Attendee Information:');
    doc.fontSize(12).font('Helvetica').text(`Name: ${fullName}`);
    doc.text(`Email: ${userEmail}`);
    doc.moveDown();

    // Event details
    doc.fontSize(14).font('Helvetica-Bold').text('Event Details:');
    doc.fontSize(12).font('Helvetica').text(`Date: ${eventDate}`);
    doc.text(`Location: ${eventLocation}`);
    doc.text(`Ticket Type: ${ticketType}`);
    doc.text(`Quantity: ${quantity}`);
    doc.text(`Ticket ID: ${ticketId}`);
    doc.text(`Event ID: ${eventId}`);
    doc.moveDown();

    // Add QR code
    doc.fontSize(14).font('Helvetica-Bold').text('Your Ticket:', { align: 'center' });
    doc.image(qrCodeDataUrl, {
      fit: [200, 200],
      align: 'center',
    });

    doc.fontSize(10).font('Helvetica').text('Please present this QR code when attending the event.', { align: 'center' });
    
    // Footer
    doc.fontSize(10).fillColor('#666666').text('Powered by Eventify', doc.page.width - 150, doc.page.height - 50, {
      align: 'right',
    });

    // Finalize the PDF
    doc.end();
  });
}

serve(handler);
