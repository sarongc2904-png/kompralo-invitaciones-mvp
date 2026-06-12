export type EventCustomContent = {
  clientName?: string;
  clientWhatsapp?: string;
  clientEmail?: string;
  plan?: string | null;
  paymentSessionId?: string | null;
  comments?: string | null;
  copy?: {
    headline?: string;
    subtitle?: string;
    welcomeText?: string;
    closingText?: string;
    whatsappMessage?: string;
  };
  imageUrls?: string[];
  uploadedPhotos?: Array<{
    name: string;
    size: number;
    type: string;
  }>;
};

export function parseEventCustomContent(notes?: string | null): EventCustomContent {
  if (!notes) {
    return {};
  }

  try {
    const parsed = JSON.parse(notes) as EventCustomContent;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {
      comments: notes
    };
  }
}

export function stringifyEventCustomContent(content: EventCustomContent) {
  return JSON.stringify(content, null, 2);
}
