export default function Stats() {
  const stats = [
    { number: "500+", label: "Projects Completed" },
    { number: "25+", label: "Countries Worldwide" },
    { number: "15", label: "Years Experience" },
    { number: "98%", label: "Client Satisfaction" },
  ];

  return (
    <section className="py-20 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-light text-white mb-2">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-white/80 font-light">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
