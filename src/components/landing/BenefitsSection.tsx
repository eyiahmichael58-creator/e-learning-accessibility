'use client';

export function BenefitsSection() {
  const benefits = [
    {
      title: 'For Visually Impaired Learners',
      points: [
        'Screen reader compatible interface',
        'High contrast mode options',
        'Text-to-speech for all content',
        'Large, adjustable fonts'
      ]
    },
    {
      title: 'For Hearing Impaired Learners',
      points: [
        'Video captions and transcripts',
        'Visual notifications',
        'Written content alternatives',
        'Communication support'
      ]
    },
    {
      title: 'For Motor Impairment Learners',
      points: [
        'Full keyboard navigation',
        'Voice control support',
        'Extended time for activities',
        'Simplified interfaces'
      ]
    },
  ];

  return (
    <section className="py-16 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Designed for Everyone</h2>
          <p className="text-xl text-slate-600">
            Tailored accessibility features for different learning needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-2xl font-bold text-blue-600 mb-4">{benefit.title}</h3>
              <ul className="space-y-3">
                {benefit.points.map((point, pointIndex) => (
                  <li key={pointIndex} className="flex items-start gap-3">
                    <span className="text-green-500 font-bold text-lg mt-0.5">✓</span>
                    <span className="text-slate-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
