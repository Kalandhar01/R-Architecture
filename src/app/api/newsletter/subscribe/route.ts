import { after, NextResponse, type NextRequest } from "next/server";
import {
  getArchitectureNewsletterWebsiteUrl,
  sendArchitectureNewsletterWelcomeEmail,
} from "@/lib/architecture-newsletter-email";
import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validation/schemas";
import { checkRateLimit, clientIdentifier } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const division = "architecture";
const sourceFallback = "architecture_footer_newsletter";

export async function POST(request: NextRequest) {
  const identifier = clientIdentifier(request.headers);
  const { allowed, retryAfter } = checkRateLimit(identifier);

  if (!allowed) {
    return NextResponse.json(
      {
        ok: false,
        success: false,
        message: "Too many subscription attempts. Please try again shortly.",
      },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, success: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, success: false, message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const { email, source } = parsed.data;
  const effectiveSource = source || sourceFallback;

  try {
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      const existingDoc = existingSubscriber as unknown as { id: string; division: string; createdAt: Date };
      if (existingDoc.division === division) {
        return NextResponse.json({
          ok: true,
          success: true,
          alreadySubscribed: true,
          message: "This email is already subscribed.",
          subscriber: {
            id: existingDoc.id,
            email,
            createdAt: existingDoc.createdAt instanceof Date ? existingDoc.createdAt.toISOString() : String(existingDoc.createdAt),
          },
        });
      }

      const subscriber = await prisma.newsletterSubscriber.update({
        where: { id: existingDoc.id },
        data: { division },
      });

      const subscriberDoc = subscriber as unknown as { id: string; email: string; createdAt: Date };

      return NextResponse.json({
        ok: true,
        success: true,
        alreadySubscribed: true,
        message: "Subscription updated.",
        subscriber: {
          id: subscriberDoc.id,
          email,
          createdAt: subscriberDoc.createdAt instanceof Date ? subscriberDoc.createdAt.toISOString() : String(subscriberDoc.createdAt),
        },
      });
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email, division },
    });

    const subscriberDoc = subscriber as unknown as { id: string; email: string; createdAt: Date };

    const websiteUrl = getArchitectureNewsletterWebsiteUrl(request);

    after(() =>
      sendArchitectureNewsletterWelcomeEmail({
        email: subscriberDoc.email,
        source: effectiveSource,
        websiteUrl,
        idempotencyKey: `architecture-newsletter-welcome-${subscriberDoc.id}`,
      })
        .then((delivery) => {
          if (delivery.sent) {
            console.info("[architecture-newsletter] Welcome email sent.", {
              subscriberId: subscriberDoc.id,
              emailId: delivery.id,
            });
            return;
          }
          console.error("[architecture-newsletter] Welcome email was not sent.", {
            subscriberId: subscriberDoc.id,
            error: delivery.error,
            skipped: delivery.skipped,
          });
        })
        .catch((error: unknown) => {
          console.error("[architecture-newsletter] Welcome email failed.", {
            subscriberId: subscriberDoc.id,
            error,
          });
        }),
    );

    return NextResponse.json({
      ok: true,
      success: true,
      alreadySubscribed: false,
      message: "Subscribed. Please check your inbox for the welcome email.",
      subscriber: {
        id: subscriberDoc.id,
        email,
        createdAt: subscriberDoc.createdAt instanceof Date ? subscriberDoc.createdAt.toISOString() : String(subscriberDoc.createdAt),
      },
      welcomeEmail: { queued: true },
    });
  } catch (error) {
    console.error("[architecture-newsletter] Subscription failed.", error);
    return NextResponse.json(
      { ok: false, success: false, message: "Unable to confirm subscription right now." },
      { status: 500 },
    );
  }
}
