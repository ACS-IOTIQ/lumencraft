export default function Services() {
  const services = [
    {
      icon: (
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 20h16M6 20V8l6-4 6 4v12M9 12h6M9 16h6" />
        </svg>
      ),
      title: "Services",
      description:
        "Design support, DMX programming, installation coordination, commissioning, and long-term maintenance for complex architectural lighting projects.",
    },
    {
      icon: (
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 3 4 7v10l8 4 8-4V7l-8-4Zm0 8 8-4M12 11 4 7M12 11v10" />
        </svg>
      ),
      title: "Products",
      description:
        "Outdoor-rated luminaires, controllers, pixel systems, linear fixtures, and beam products selected for durable landmark-scale performance.",
    },
  ];

  return (
    <section id="services" className="border-y border-black/5 bg-white py-20">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
          {services.map((service, index) => (
            <article key={service.title} className="group border-t border-black/10 pt-8">
              <div className="mb-5 flex h-11 w-11 items-center justify-center border border-black/15 text-black">
                {service.icon}
              </div>
              <h3 className="mb-4 text-2xl font-semibold tracking-normal text-black">{service.title}</h3>
              <p className="mb-6 max-w-xl text-sm leading-7 text-black/62 sm:text-base">
                {service.description}
              </p>
              <a
                href={index === 0 ? "#contact" : "#products"}
                className="inline-flex items-center gap-3 text-sm font-semibold text-black transition hover:text-black/55"
              >
                Know more
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 5 7 7-7 7" />
                </svg>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
