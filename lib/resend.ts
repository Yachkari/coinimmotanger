import { Resend } from "resend";
import type { CreateContactMessagePayload } from "@/types";

// ── Resend client ────────────────────────────────────────────

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL  = process.env.RESEND_FROM_EMAIL  ?? "contact@agence-immo.ma";
const TO_EMAIL    = process.env.CONTACT_RECIPIENT_EMAIL!;
const SITE_NAME   = process.env.NEXT_PUBLIC_SITE_NAME ?? "Immobilier";
const SITE_URL    = process.env.NEXT_PUBLIC_SITE_URL  ?? "https://example.com";


// ── Send contact form email to the admin ─────────────────────

export async function sendContactEmail(
  payload: CreateContactMessagePayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const listingSection = payload.listing_title
      ? `<tr>
           <td style="padding:8px 0;color:#6b7280;font-size:14px;">Bien concerné</td>
           <td style="padding:8px 0;font-weight:600;">
             <a href="${SITE_URL}/vente/${payload.listing_id}" style="color:#2563eb;">
               ${payload.listing_title}
             </a>
           </td>
         </tr>`
      : "";

    const html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
      <body style="margin:0;padding:0;background:#f3f4f6;font-family:sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0"
                   style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">

              <!-- Header -->
              <tr>
                <td style="background:#1e293b;padding:28px 32px;">
                  <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">
                    📬 Nouveau message — ${SITE_NAME}
                  </h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:32px;">
                  <p style="margin:0 0 24px;color:#374151;font-size:16px;">
                    Vous avez reçu un nouveau message de contact.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0"
                         style="border-top:1px solid #e5e7eb;">
                    ${listingSection}
                    <tr>
                      <td style="padding:8px 0;color:#6b7280;font-size:14px;width:140px;">Nom</td>
                      <td style="padding:8px 0;font-weight:600;">${payload.name}</td>
                    </tr>
                    <tr style="background:#f9fafb;">
                      <td style="padding:8px 0;color:#6b7280;font-size:14px;">Email</td>
                      <td style="padding:8px 0;">
                        <a href="mailto:${payload.email}" style="color:#2563eb;">${payload.email}</a>
                      </td>
                    </tr>
                    ${payload.phone ? `
                    <tr>
                      <td style="padding:8px 0;color:#6b7280;font-size:14px;">Téléphone</td>
                      <td style="padding:8px 0;">
                        <a href="tel:${payload.phone}" style="color:#2563eb;">${payload.phone}</a>
                      </td>
                    </tr>` : ""}
                    <tr style="background:#f9fafb;">
                      <td style="padding:12px 0;color:#6b7280;font-size:14px;vertical-align:top;">Message</td>
                      <td style="padding:12px 0;line-height:1.6;">${payload.message.replace(/\n/g, "<br>")}</td>
                    </tr>
                  </table>

                  <!-- Reply CTA -->
                  <div style="margin-top:28px;text-align:center;">
                    <a href="mailto:${payload.email}?subject=Re: Votre demande — ${SITE_NAME}"
                       style="display:inline-block;background:#1e293b;color:#ffffff;
                              text-decoration:none;padding:12px 28px;border-radius:8px;
                              font-size:15px;font-weight:600;">
                      Répondre à ${payload.name}
                    </a>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;">
                  <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
                    Ce message a été envoyé depuis le formulaire de contact de
                    <a href="${SITE_URL}" style="color:#6b7280;">${SITE_NAME}</a>
                  </p>
                </td>
              </tr>

            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `;

    const { error } = await resend.emails.send({
      from:    FROM_EMAIL,
      to:      TO_EMAIL,
      replyTo: payload.email,
      subject: payload.listing_title
        ? `Demande: ${payload.listing_title} — ${payload.name}`
        : `Nouveau message de ${payload.name} — ${SITE_NAME}`,
      html,
    });

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error("[sendContactEmail]", err);
    return { success: false, error: "Impossible d'envoyer l'email." };
  }
}


// ── Send confirmation email to the client ────────────────────

export async function sendConfirmationEmail(
  name: string,
  email: string,
  listingTitle?: string
): Promise<{ success: boolean }> {
  try {
    const subject = listingTitle
      ? `Votre demande concernant "${listingTitle}" a été reçue`
      : `Votre message a bien été reçu — ${SITE_NAME}`;

    const html = `
      <!DOCTYPE html>
      <html lang="fr">
      <body style="margin:0;padding:0;background:#f3f4f6;font-family:sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0"
                   style="background:#ffffff;border-radius:12px;overflow:hidden;">
              <tr>
                <td style="background:#1e293b;padding:28px 32px;">
                  <h1 style="margin:0;color:#ffffff;font-size:20px;">✅ Message reçu</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:32px;color:#374151;line-height:1.7;">
                  <p>Bonjour <strong>${name}</strong>,</p>
                  <p>
                    Nous avons bien reçu votre message
                    ${listingTitle ? `concernant <strong>${listingTitle}</strong>` : ""}.
                    Notre équipe vous contactera dans les plus brefs délais.
                  </p>
                  <p>Merci de votre intérêt,<br><strong>L'équipe ${SITE_NAME}</strong></p>
                  <div style="margin-top:24px;">
                    <a href="${SITE_URL}"
                       style="display:inline-block;background:#1e293b;color:#fff;
                              text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;">
                      Retour au site
                    </a>
                  </div>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `;

    await resend.emails.send({
      from:    FROM_EMAIL,
      to:      email,
      subject,
      html,
    });

    return { success: true };
  } catch (err) {
    console.error("[sendConfirmationEmail]", err);
    return { success: false };
  }
}