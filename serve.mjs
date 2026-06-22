import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";

const PORT = 3001;
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".json": "application/json",
};

// SMTP configuration for sending contact form emails
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.office365.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "Enquiries@cimmeriancrane.com",
    pass: process.env.SMTP_PASS || "CimmerianS75$",
  },
});

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve(null);
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  // Handle contact form submissions
  if (req.method === "POST" && req.url === "/api/contact") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const data = await parseBody(req);
    if (!data || !data.name || !data.email || !data.message) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing required fields" }));
      return;
    }

    const htmlBody = `
      <h2>New Enquiry from Website</h2>
      <table style="border-collapse:collapse; width:100%; max-width:600px;">
        <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">Name</td><td style="padding:8px; border:1px solid #ddd;">${data.name}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">Company</td><td style="padding:8px; border:1px solid #ddd;">${data.company || "N/A"}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">Email</td><td style="padding:8px; border:1px solid #ddd;">${data.email}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">Phone</td><td style="padding:8px; border:1px solid #ddd;">${data.phone || "N/A"}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">Service</td><td style="padding:8px; border:1px solid #ddd;">${data.service || "N/A"}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">Message</td><td style="padding:8px; border:1px solid #ddd;">${(data.message || "").replace(/\n/g, "<br>")}</td></tr>
      </table>
    `;

    try {
      await transporter.sendMail({
        from: `"Cimmerian Website" <Enquiries@cimmeriancrane.com>`,
        to: "Enquiries@cimmeriancrane.com",
        replyTo: data.email,
        subject: `Website Enquiry: ${data.name} - ${data.service || "General"}`,
        text: `New enquiry from ${data.name} (${data.company || "N/A"}):\nEmail: ${data.email}\nPhone: ${data.phone || "N/A"}\nService: ${data.service || "N/A"}\n\nMessage:\n${data.message}`,
        html: htmlBody,
      });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
    } catch (err) {
      console.error("Email send failed:", err.message);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to send email" }));
    }
    return;
  }

  // Static file serving
  let urlPath = req.url.split("?")[0];
  if (urlPath === "/") urlPath = "/index.html";
  urlPath = decodeURIComponent(urlPath);

  const filePath = path.join(process.cwd(), urlPath);
  const ext = path.extname(filePath);
  const mimeType = MIME_TYPES[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": mimeType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
