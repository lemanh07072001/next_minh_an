// app/utils/sendEmail.ts hoặc 1 component cần dùng
import emailTemplates from "@/app/data/emailTemplates.json";

export function renderTemplate(templateKey: keyof typeof emailTemplates, data: Record<string, string>) {
    const template = emailTemplates[templateKey];

    if (!template) throw new Error("Template không tồn tại");

    let subject = template.subject;
    let body = template.body;
    let viewTemplate = '';

    Object.entries(data).forEach(([key, value]) => {
        console.log(value)
        const pattern = new RegExp(`{{${key}}}`, "g");
        subject = subject.replace(pattern, value);
        body = body.replace(pattern, value);
        viewTemplate = template.template
    });

    return { subject, body, viewTemplate };
}
