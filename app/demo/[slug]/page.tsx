import { notFound } from "next/navigation";
import { InvitationDemo } from "@/components/InvitationDemo";
import { demoEvents } from "@/data/demoEvents";

type DemoPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: DemoPageProps) {
  const { slug } = await params;
  const event = demoEvents[slug];

  if (!event) {
    return {
      title: "Demo"
    };
  }

  return {
    title: `Demo ${event.type}`,
    openGraph: {
      title: event.title,
      description: event.subtitle,
      images: [event.heroImage]
    }
  };
}

export function generateStaticParams() {
  return Object.keys(demoEvents).map((slug) => ({ slug }));
}

export default async function DemoPage({ params }: DemoPageProps) {
  const { slug } = await params;
  const event = demoEvents[slug];

  if (!event) {
    notFound();
  }

  return <InvitationDemo event={event} />;
}
