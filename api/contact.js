const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LENGTHS = {
    name: 120,
    phone: 40,
    company: 160,
    email: 160,
    product: 120,
    message: 3000,
    page: 200,
    url: 500
};

function clean(value, maxLength) {
    return String(value || "").trim().slice(0, maxLength);
}

module.exports = async function handler(request, response) {
    if (request.method !== "POST") {
        return response.status(405).json({ error: "Faqat POST so‘rovi qabul qilinadi." });
    }

    const body = request.body || {};
    const name = clean(body.name, MAX_LENGTHS.name);
    const phone = clean(body.phone, MAX_LENGTHS.phone);
    const company = clean(body.company, MAX_LENGTHS.company);
    const email = clean(body.email, MAX_LENGTHS.email);
    const product = clean(body.product, MAX_LENGTHS.product);
    const message = clean(body.message, MAX_LENGTHS.message);
    const page = clean(body.page, MAX_LENGTHS.page);
    const url = clean(body.url, MAX_LENGTHS.url);

    if (!name || !phone) {
        return response.status(400).json({ error: "Ism va telefon raqami majburiy." });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.CONTACT_EMAIL || "info@yes-energy.uz";

    if (!apiKey || !EMAIL_PATTERN.test(recipient)) {
        console.error("Email service is not configured.");
        return response.status(500).json({ error: "Aloqa xizmati hozir sozlanmoqda." });
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            from: process.env.EMAIL_FROM || "YES ENERGY <onboarding@resend.dev>",
            to: [recipient],
            reply_to: process.env.EMAIL_REPLY_TO || recipient,
            subject: `Saytdan yangi murojaat: ${name}`,
            text: [
                `Ism: ${name}`,
                `Kompaniya: ${company || "Kiritilmagan"}`,
                `Telefon: ${phone}`,
                `Email: ${email || "Kiritilmagan"}`,
                `Mahsulot: ${product || "Kiritilmagan"}`,
                `Sahifa: ${page || "Kiritilmagan"}`,
                `URL: ${url || "Kiritilmagan"}`,
                "",
                "Xabar:",
                message || "Xabar kiritilmagan."
            ].join("\n")
        })
    });

    if (!emailResponse.ok) {
        const details = await emailResponse.text();
        console.error("Resend request failed:", details);
        return response.status(502).json({ error: "Xabarni yuborib bo‘lmadi. Iltimos, qayta urinib ko‘ring." });
    }

    return response.status(200).json({ ok: true });
};
