import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAIL = "kalandars2004@gmail.com";
const RESEND_EMAILS_API = "https://api.resend.com/emails";
const defaultFromEmail = "Ractysh Design Private Limited <onboarding@resend.dev>";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 4000;

type ConsultationPayload = {
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  location?: string;
  budget?: string;
  message: string;
  sourcePage: string;
};

type ApiBody = Record<string, unknown>;

function clean(value: unknown, limit = 4000) {
  return typeof value === "string" ? value.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, limit) : "";
}

function jsonValue(value: unknown) {
  return JSON.parse(JSON.stringify(value ?? {}));
}

function excerpt(value: string, limit = 190) {
  const trimmed = value.replace(/\s+/g, " ").trim();
  return trimmed.length <= limit ? trimmed : `${trimmed.slice(0, limit - 1)}...`;
}

function payloadFromBody(body: ApiBody, request: NextRequest): ConsultationPayload {
  const website = clean(body.website, 200);

  if (website) {
    throw new Error("Spam protection triggered.");
  }

  const payload = {
    name: clean(body.name, 120),
    email: clean(body.email, 180),
    phone: clean(body.phone, 40),
    projectType: clean(body.projectType, 140) || "Architecture consultation",
    location: clean(body.location, 160),
    budget: clean(body.budget, 120),
    message: clean(body.message, MAX_MESSAGE_LENGTH),
    sourcePage: clean(body.sourcePage, 1000) || request.headers.get("referer") || "architecture-domain"
  };

  if (!payload.name) throw new Error("Please enter your name.");
  if (!emailPattern.test(payload.email)) throw new Error("Please enter a valid email.");
  if (!payload.message) throw new Error("Please enter your message.");

  return payload;
}

function leadSummary(payload: ConsultationPayload) {
  const locationText = payload.location ? ` in ${payload.location}` : "";
  return `New lead from architecture consultation form for ${payload.projectType}${locationText}. Signal: ${excerpt(payload.message)}`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function display(value: string | undefined | null): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "Not provided";
}

async function sendAdminNotification({
  name, email, phone, projectType, location, budget, message, inquiryId, submittedAt, page,
}: {
  name: string; email: string; phone?: string; projectType: string; location?: string; budget?: string; message: string; inquiryId: string; submittedAt: string; page: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const fields = [
    ["Client", name],
    ["Email", email],
    ["Phone", display(phone)],
    ["Project Type", projectType],
    ["Location", display(location)],
    ["Budget", display(budget)],
    ["Source", page],
    ["Inquiry ID", inquiryId],
  ];

  const fieldCards = fields
    .map(
      ([label, value]) => `
        <td class="fc" width="50%" valign="top" style="padding:0 8px 12px 0">
          <div style="border:1px solid #E7E2D9;border-radius:14px;background:#FFFFFF;padding:18px;box-shadow:0 10px 28px rgba(17,17,17,.05)">
            <p style="margin:0 0 8px;color:#A47A2D;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:.14em;line-height:14px;text-transform:uppercase">${escapeHtml(label)}</p>
            <p style="margin:0;color:#111111;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;line-height:22px">${escapeHtml(value)}</p>
          </div>
        </td>`,
    )
    .reduce((rows: string[][], card, index) => {
      if (index % 2 === 0) rows.push([]);
      rows[rows.length - 1].push(card);
      return rows;
    }, [])
    .map((row) => `<tr>${row.join("")}</tr>`)
    .join("");

  const html = `<!doctype html>
<html>
  <head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>New Architecture Inquiry</title>
  <style>@media only screen and (max-width:640px){.mc{width:100%!important;max-width:100%!important;border-radius:0!important;border-left:0!important;border-right:0!important}.mp{padding-left:24px!important;padding-right:24px!important}.mt{font-size:30px!important;line-height:36px!important}.fc{display:block!important;width:100%!important;padding:0 0 12px!important}}</style>
  </head>
  <body style="margin:0;padding:0;background:#F8F5EF;color:#111111">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background:#F8F5EF">
      <tr><td align="center" style="padding:34px 14px 40px">
        <table role="presentation" class="mc" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:680px;border-collapse:separate;border-spacing:0;overflow:hidden;border:1px solid #E7E2D9;border-radius:24px;background:#FFFFFF;box-shadow:0 18px 70px rgba(17,17,17,.08)">
          <tr><td class="mp" align="center" style="padding:34px 42px 28px;background:#FFFFFF">
            <p style="margin:0;color:#8F1118;font-family:Georgia,'Times New Roman',serif;font-size:44px;font-weight:700;line-height:40px">R</p>
            <p style="margin:6px 0 0;color:#111827;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:700;letter-spacing:.12em;line-height:34px">RACTYSH</p>
            <p style="margin:5px 0 0;color:#6B5653;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:.28em;line-height:16px;text-transform:uppercase">Architecture Contact Desk</p>
            <div style="width:48px;height:2px;margin:24px auto 0;background:#A47A2D"></div>
          </td></tr>
          <tr><td style="height:4px;background:#A3121A;font-size:0;line-height:0">&nbsp;</td></tr>
          <tr><td class="mp" align="center" style="padding:32px 42px 34px;border-bottom:1px solid #E7E2D9;background:#FFFCF7">
            <p style="margin:0 0 14px;color:#A47A2D;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:.16em;line-height:16px;text-transform:uppercase">New Lead</p>
            <h1 class="mt" style="margin:0;color:#111111;font-family:Georgia,'Times New Roman',serif;font-size:36px;font-weight:400;line-height:42px">New Architecture Inquiry</h1>
            <p style="margin:14px 0 0;color:#6A6A6A;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:22px">Received ${escapeHtml(submittedAt)}</p>
          </td></tr>
          <tr><td class="mp" style="padding:34px 42px 40px;background:#FFFFFF">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 26px">${fieldCards}</table>
            <div style="margin:0 0 30px;padding:24px;border:1px solid #E7E2D9;border-left:4px solid #A3121A;border-radius:14px;background:#FFFCF7">
              <p style="margin:0 0 8px;color:#A47A2D;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:.14em;line-height:14px;text-transform:uppercase">Client Message</p>
              <p style="margin:0;color:#2F2F2F;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:27px;white-space:pre-wrap">${escapeHtml(message)}</p>
            </div>
            <a href="mailto:${escapeHtml(email)}" style="display:block;margin:0 0 10px;padding:13px 16px;border-radius:8px;background:#A3121A;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:.08em;line-height:18px;text-align:center;text-decoration:none;text-transform:uppercase;box-shadow:0 12px 28px rgba(163,18,26,.2)">Reply to Client</a>
          </td></tr>
          <tr><td class="mp" align="center" style="padding:28px 42px 34px;border-top:1px solid #E7E2D9;background:#FFFFFF">
            <p style="margin:0;color:#111111;font-family:Georgia,'Times New Roman',serif;font-size:19px;font-weight:700;line-height:25px">Ractysh Group</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  await fetch(RESEND_EMAILS_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `arch-consult-${inquiryId}`,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || defaultFromEmail,
      to: [ADMIN_EMAIL],
      reply_to: email,
      subject: `New Architecture Inquiry - ${name}`,
      html,
      tags: [{ name: "source", value: "architecture-consultation" }],
    }),
    signal: AbortSignal.timeout(8_000),
  });
}

export async function POST(request: NextRequest) {
  try {
    const payload = payloadFromBody((await request.json().catch(() => ({}))) as ApiBody, request);
    const submittedAt = new Date();
    const message = [
      `Project Type: ${payload.projectType}`,
      payload.location ? `Location: ${payload.location}` : undefined,
      payload.budget ? `Budget: ${payload.budget}` : undefined,
      "",
      payload.message
    ]
      .filter((line) => line !== undefined)
      .join("\n");
    const subject = `Architecture consultation - ${payload.projectType}`;
    const aiSummary = leadSummary(payload);

    const inquiry = await prisma.contactInquiry.create({
      data: {
        division: "architecture",
        name: payload.name,
        email: payload.email,
        phone: payload.phone || undefined,
        service: payload.projectType,
        subject,
        message,
        sourcePage: payload.sourcePage,
        status: "new"
      }
    });

    const event = await prisma.ingestionEvent.create({
      data: {
        sourceType: "website_contact_form",
        entityType: "lead",
        status: "completed",
        priority: "high",
        source: "architecture-site",
        division: "architecture",
        service: payload.projectType,
        location: payload.location,
        payload: jsonValue({
          ...payload,
          contactInquiryId: inquiry.id,
          submittedAt: submittedAt.toISOString()
        }),
        aiSummary,
        startedAt: submittedAt,
        processedAt: submittedAt
      }
    });

    const lead = await prisma.lead.create({
      data: {
        division: "architecture",
        fullName: payload.name,
        email: payload.email,
        phone: payload.phone || undefined,
        source: "architecture-site",
        sourceType: "website_contact_form",
        service: payload.projectType,
        location: payload.location,
        status: "new",
        message,
        aiSummary,
        metadata: jsonValue({
          channel: "architecture-domain",
          budget: payload.budget,
          subject,
          sourcePage: payload.sourcePage,
          externalEntityId: inquiry.id,
          externalEntityModel: "ContactInquiry"
        }),
        ingestionEventId: event.id
      }
    });

    const architectureLead = await prisma.architectureLead.create({
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone || undefined,
        projectType: payload.projectType,
        location: payload.location || undefined,
        budget: payload.budget || undefined,
        message: payload.message,
        sourcePage: payload.sourcePage,
        status: "new",
        contactInquiryId: inquiry.id,
        legacyLeadId: lead.id,
        metadata: jsonValue({
          subject,
          aiSummary,
          channel: "architecture-domain",
          ingestionEventId: event.id
        })
      }
    });

    await prisma.notification.create({
      data: {
        dedupeKey: `architecture-lead-${architectureLead.id}`,
        title: "New architecture inquiry",
        message: `${payload.name} requested ${payload.projectType}${payload.location ? ` in ${payload.location}` : ""}.`,
        project: "architecture",
        division: "architecture",
        priority: "high",
        status: "unread",
        entity: "ArchitectureLead",
        entityId: architectureLead.id,
        actionUrl: "/admin/architecture?section=leads",
        metadata: jsonValue({
          architectureLeadId: architectureLead.id,
          contactInquiryId: inquiry.id,
          legacyLeadId: lead.id,
          sourcePage: payload.sourcePage
        })
      }
    });

    await prisma.ingestionEvent.update({
      where: { id: event.id },
      data: {
        entityId: architectureLead.id,
        entityModel: "ArchitectureLead"
      }
    });

    // Fire-and-forget email notification to admin
    sendAdminNotification({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      projectType: payload.projectType,
      location: payload.location,
      budget: payload.budget,
      message: payload.message,
      inquiryId: inquiry.id,
      submittedAt: submittedAt.toISOString(),
      page: payload.sourcePage || request.headers.get("referer") || "architecture-site",
    }).catch((err) => console.error("[architecture-consultation] Email notification failed:", err));

    return NextResponse.json(
      {
        success: true,
        message: "Brief received. It is now in the architecture lead and contact request flow.",
        inquiry: {
          id: inquiry.id,
          leadId: lead.id,
          architectureLeadId: architectureLead.id,
          stored: true,
          status: "new"
        }
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to route the consultation.";
    const status = message.includes("Please") || message.includes("Spam") ? 400 : 503;

    console.error("Architecture consultation route failed:", error);
    return NextResponse.json({ success: false, message }, { status });
  }
}

export function GET() {
  return NextResponse.json({ success: false, message: "Method not allowed." }, { status: 405, headers: { Allow: "POST" } });
}
