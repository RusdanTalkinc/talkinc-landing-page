import "@/styles/globals.css";
import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

if (process.env.NODE_ENV === "development" && !META_PIXEL_ID) {
  console.warn("NEXT_PUBLIC_META_PIXEL_ID belum di-set; Meta Pixel tidak akan dimuat.");
}

if (process.env.NODE_ENV === "development" && !GA_MEASUREMENT_ID) {
  console.warn("NEXT_PUBLIC_GA_ID belum di-set; Google Analytics tidak akan dimuat.");
}

if (process.env.NODE_ENV === "development" && !GTM_CONTAINER_ID) {
  console.warn("NEXT_PUBLIC_GTM_CONTAINER_ID belum di-set; Google Tag Manager tidak akan dimuat.");
}

export const metadata = {
  title: "TALKINC",
  description: "Naikkan level komunikasi Anda dengan kelas publik TALKINC.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* ✅ Meta Pixel */}
        {META_PIXEL_ID ? (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');

                fbq('init', '${META_PIXEL_ID}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              />
            </noscript>
          </>
        ) : null}
        {/* ✅ Google Tag Manager */}
        {GTM_CONTAINER_ID ? (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`}
          </Script>
        ) : null}
        {/* ✅ Google Analytics */}
        {GA_MEASUREMENT_ID ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
            <Script id="ga-bootstrap" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  anonymize_ip: true
                });
              `}
            </Script>
          </>
        ) : null}
      </head>
      <body className="min-h-screen text-slate-900">
        {GTM_CONTAINER_ID ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
        ) : null}
        {/* Ambient background */}
        <div className="fixed inset-0 -z-10">
          {/* radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_-10%,rgba(99,102,241,0.25),transparent_60%)]"></div>
          {/* subtle grid */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent,transparent),linear-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:100%_100%,20px_20px] opacity-40"></div>
          {/* gradient blob */}
          <div className="absolute -bottom-24 -left-20 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-25 bg-gradient-to-tr from-rose-400 via-fuchsia-400 to-indigo-400"></div>
        </div>

        {children}
      </body>
    </html>
  );
}

