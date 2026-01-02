/**
 * WhatsApp Link Utility
 * Creates properly formatted WhatsApp click-to-chat links
 */

interface WhatsAppLinkOptions {
    phoneNumber?: string;
    message?: string;
}

const DEFAULT_PHONE = "919876543210"; // Update this with actual number

/**
 * Creates a WhatsApp click-to-chat URL
 * @param options - Phone number and optional pre-filled message
 * @returns Properly formatted WhatsApp URL
 */
export function createWhatsAppLink(options: WhatsAppLinkOptions = {}): string {
    const phone = options.phoneNumber?.replace(/\D/g, "") || DEFAULT_PHONE;
    const message = options.message ? encodeURIComponent(options.message) : "";

    return `https://wa.me/${phone}${message ? `?text=${message}` : ""}`;
}

/**
 * Creates a WhatsApp link for a specific catalog item inquiry
 */
export function createCatalogInquiryLink(
    itemTitle: string,
    priceDisplay: string,
    phoneNumber?: string
): string {
    const message = `Hi! I'm interested in "${itemTitle}" (${priceDisplay}). Can you help me with more details and order?`;
    return createWhatsAppLink({ phoneNumber, message });
}

/**
 * Creates a WhatsApp link for general inquiry
 */
export function createGeneralInquiryLink(phoneNumber?: string): string {
    const message = "Hi! I'd like to inquire about your floral arrangements.";
    return createWhatsAppLink({ phoneNumber, message });
}

/**
 * Creates a WhatsApp link for service inquiry
 */
export function createServiceInquiryLink(
    serviceTitle: string,
    phoneNumber?: string
): string {
    const message = `Hi! I'm interested in your "${serviceTitle}" service. Can you provide more details?`;
    return createWhatsAppLink({ phoneNumber, message });
}

/**
 * Formats a phone number for tel: links
 */
export function formatPhoneLink(phone?: string): string {
    if (!phone) return `tel:+${DEFAULT_PHONE}`;
    const cleaned = phone.replace(/\D/g, "");
    return `tel:+${cleaned}`;
}

/**
 * Formats a phone number for display
 */
export function formatPhoneDisplay(phone?: string): string {
    if (!phone) return "+91 98765 43210";
    // Basic formatting - can be enhanced
    return phone;
}
