import Link from 'next/link';

export default function CoreValuesPage() {
  const values = [
    {
      number: 1,
      title: "Quality Excellence",
      description: "We are committed to providing high-quality day-old chicks and poultry products that meet the highest industry standards, ensuring the success and profitability of our farmers."
    },
    {
      number: 2,
      title: "Integrity",
      description: "We conduct our business with honesty, transparency, and accountability, building trust and long-term relationships with our customers, partners, and stakeholders."
    },
    {
      number: 3,
      title: "Customer Success",
      description: "Our farmers are at the heart of everything we do. We are dedicated to supporting their growth through reliable products, technical expertise, and responsive customer service."
    },
    {
      number: 4,
      title: "Innovation",
      description: "We embrace modern poultry farming practices, technologies, and continuous learning to improve productivity, efficiency, and sustainability in the poultry industry."
    },
    {
      number: 5,
      title: "Sustainability",
      description: "We promote responsible farming practices that enhance productivity while protecting the environment and supporting future generations of poultry farmers."
    },
    {
      number: 6,
      title: "Professionalism",
      description: "We uphold high standards of competence, reliability, and ethical conduct in all our operations and interactions."
    },
    {
      number: 7,
      title: "Teamwork",
      description: "We believe in collaboration and mutual respect, working closely with farmers, employees, and industry partners to achieve shared success."
    },
    {
      number: 8,
      title: "Empowerment",
      description: "We are committed to equipping poultry farmers with the knowledge, skills, and resources needed to build profitable and sustainable poultry enterprises."
    },
    {
      number: 9,
      title: "Biosecurity and Animal Welfare",
      description: "We prioritize the health, welfare, and proper management of poultry through strict biosecurity measures and best husbandry practices."
    },
    {
      number: 10,
      title: "Continuous Improvement",
      description: "We strive for excellence by continuously evaluating and improving our products, services, and farming solutions to meet the evolving needs of our customers."
    }
  ];

  return (
    <div className="bg-white text-charcoal min-h-screen pb-20">
      {/* Header */}
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">Our Core Values</h1>
        <p className="text-xl max-w-2xl mx-auto text-light-green">
          The principles that guide our commitment to farmers and the poultry industry
        </p>
      </section>

      {/* Values Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value) => (
            <div key={value.number} className="bg-light-green p-8 rounded-xl border-l-4 border-primary hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                  {value.number}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">{value.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{value.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/about" className="text-primary font-semibold hover:text-accent transition-colors">
            ← Back to About Us
          </Link>
        </div>
      </section>
    </div>
  );
}
