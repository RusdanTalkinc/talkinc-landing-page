"use client";
import React from "react";
import { gtmEvent } from "@/lib/gtm";

export default function FloatingWhatsApp({ label = "Chat Admin", bottom = "20px", right = "20px" }) {
  const number = process.env.NEXT_PUBLIC_WA_NUMBER;
  const text = process.env.NEXT_PUBLIC_WA_TEXT || "";
  const href = number ? `https://wa.me/${number}?text=${text}` : "#";

  const onClick = () => {
    gtmEvent("cta_click", {
      cta_type: "whatsapp_floating",
      cta_location: "floating_button",
    });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      aria-label="Chat WhatsApp Admin"
      className="group fixed z-50 flex items-center gap-3 rounded-full bg-green-500 text-white shadow-lg hover:shadow-xl transition
                 pr-4 pl-3 py-3"
      style={{ bottom, right }}
    >
      <span className="grid place-items-center rounded-full bg-white/20" style={{ width: 36, height: 36 }} aria-hidden="true">
        {/* Ikon WA inline (SVG) */}
        <svg viewBox="0 0 32 32" width="22" height="22" fill="currentColor">
          <path d="M19.11 17.49c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.46-.88-.78-1.47-1.73-1.64-2.03-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.09 4.48.71.31 1.26.5 1.69.64.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z" />
          <path d="M26.7 5.3C23.9 2.5 20.2 1 16.2 1 8.7 1 2.6 7.1 2.6 14.6c0 2.3.6 4.5 1.7 6.5L2 31l9.1-2.4c1.9 1 4.1 1.6 6.1 1.6 7.5 0 13.6-6.1 13.6-13.6 0-3.9-1.5-7.6-4.4-10.3zM16.2 28.6c-1.8 0-3.6-.5-5.2-1.3l-.4-.2-5.4 1.4 1.4-5.3-.2-.4c-.9-1.6-1.4-3.5-1.4-5.4 0-6.2 5.1-11.3 11.3-11.3 3 0 5.8 1.2 7.9 3.3s3.3 4.9 3.3 7.9c0 6.2-5.1 11.3-11.3 11.3z" />
        </svg>
      </span>
      <span className="font-semibold">{label}</span>
    </a>
  );
}
