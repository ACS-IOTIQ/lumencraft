import Logo from "@/components/Logo";

export default function Footer() {
  const productLinks = [
    "LINEA Pro",
    "LINEAflex",
    "DMX devices",
    "PIXAdot",
    "Beam Pro",
    "Controllers",
    "PIXAbar",
  ];

  const socialLinks = [
    {
      label: "LinkedIn",
      path: "M6.94 8.5H3.9V19h3.04V8.5ZM5.42 7.06c.98 0 1.62-.66 1.62-1.48-.02-.84-.64-1.48-1.6-1.48-.97 0-1.6.64-1.6 1.48 0 .82.61 1.48 1.56 1.48h.02ZM9 19h3.04v-5.86c0-.31.02-.63.12-.85.23-.63.82-1.28 1.78-1.28 1.26 0 1.76.96 1.76 2.37V19h3.04v-5.98c0-3.2-1.7-4.69-3.98-4.69-1.86 0-2.67 1.04-3.13 1.75h.02V8.5H9c.04.98 0 10.5 0 10.5Z",
    },
    {
      label: "Facebook",
      path: "M14.2 8.24h-1.62c-.48 0-1.02.3-1.02 1.08v1.52h2.54l-.4 2.56h-2.14V19H8.9v-5.6H6.7v-2.56h2.2V9.08C8.9 6.88 10.2 5.6 12.2 5.6c.96 0 1.78.07 2 .1v2.54Z",
    },
    {
      label: "Instagram",
      path: "M8.2 4h7.6A4.2 4.2 0 0 1 20 8.2v7.6a4.2 4.2 0 0 1-4.2 4.2H8.2A4.2 4.2 0 0 1 4 15.8V8.2A4.2 4.2 0 0 1 8.2 4Zm0 2A2.2 2.2 0 0 0 6 8.2v7.6A2.2 2.2 0 0 0 8.2 18h7.6a2.2 2.2 0 0 0 2.2-2.2V8.2A2.2 2.2 0 0 0 15.8 6H8.2Zm3.8 2.7A3.3 3.3 0 1 1 12 15.3a3.3 3.3 0 0 1 0-6.6Zm0 2A1.3 1.3 0 1 0 12 13.3a1.3 1.3 0 0 0 0-2.6Zm4.18-2.24a.77.77 0 1 1-.01 1.54.77.77 0 0 1 .01-1.54Z",
    },
    {
      label: "YouTube",
      path: "M20.2 8.12a2.25 2.25 0 0 0-1.58-1.6C17.22 6.14 12 6.14 12 6.14s-5.22 0-6.62.38a2.25 2.25 0 0 0-1.58 1.6A23.5 23.5 0 0 0 3.42 12a23.5 23.5 0 0 0 .38 3.88 2.25 2.25 0 0 0 1.58 1.6c1.4.38 6.62.38 6.62.38s5.22 0 6.62-.38a2.25 2.25 0 0 0 1.58-1.6 23.5 23.5 0 0 0 .38-3.88 23.5 23.5 0 0 0-.38-3.88ZM10.3 14.56V9.44L14.75 12l-4.45 2.56Z",
    },
  ];

  return (
    <footer className="bg-white text-black">
      <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-10 lg:px-20">
        <div className="flex justify-center">
          <Logo stacked textClassName="text-4xl sm:text-5xl" />
        </div>

        <nav className="mt-14 border-y border-black/8 py-8">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-black/76">
            {productLinks.map((link) => (
              <a key={link} href="#products" className="transition hover:text-black">
                {link}
              </a>
            ))}
          </div>
        </nav>

        <div className="mt-12 flex justify-center gap-5">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href="#"
              aria-label={social.label}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-black/18 text-black/80 transition hover:bg-black hover:text-white"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d={social.path} />
              </svg>
            </a>
          ))}
        </div>
      </div>

      <div className="bg-[#171717] px-6 py-5 text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>All rights reserved &copy; {new Date().getFullYear()}</p>
          <a href="#" className="transition hover:text-white/70">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
