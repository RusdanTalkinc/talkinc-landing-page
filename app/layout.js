import "@/styles/globals.css";

export const metadata = {
  title: "TALKINC",
  description: "Naikkan level komunikasi Anda dengan kelas publik TALKINC.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* ✅ Meta Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');

              fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
              fbq('track', 'LPPageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
      </head>
      <body className="min-h-screen text-slate-900">
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

