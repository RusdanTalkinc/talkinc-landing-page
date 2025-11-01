import "@/styles/globals.css";

export const metadata = {
  title: "TALKINC",
  description: "Naikkan level komunikasi Anda dengan kelas publik TALKINC.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
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

