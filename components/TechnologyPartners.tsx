import Image from "next/image";
import type { CmsPartner } from "@/lib/cms-types";
import { fallbackSiteContent } from "@/lib/cms-seed";

export default function TechnologyPartners({
  partners = fallbackSiteContent.partners,
}: {
  partners?: CmsPartner[];
}) {
  const scrollingPartners = [...partners, ...partners];

  return (
    <section id="resources" className="bg-[#f3f3f3] py-20 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-20">
        <h2 className="mb-12 text-3xl font-semibold tracking-normal text-black sm:text-4xl">
          Technology Partners
        </h2>

        <div className="partners-marquee">
          <div className="partners-marquee-track">
            {scrollingPartners.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="relative mx-3 flex h-28 w-[220px] shrink-0 items-center justify-center bg-white px-5 shadow-[0_18px_40px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[250px]"
              >
                <Image
                  src={partner.image}
                  alt={partner.name}
                  fill
                  className="object-contain p-5"
                  sizes="250px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
