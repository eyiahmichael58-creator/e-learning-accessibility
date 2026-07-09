'use client';

export function FeaturesSection() {
  const features = [
    {
      icon: '🔊',
      title: 'Text-to-Speech',
      description: 'Listen to course content with high-quality audio narration'
    },
    {
      icon: '🎤',
      title: 'Speech-to-Text',
      description: 'Easily submit assignments and notes using voice input'
    },
    {
      icon: '🅰️',
      title: 'Adjustable Fonts',
      description: 'Customize font size, spacing, and contrast for comfortable reading'
    },
    {
      icon: '🧭',
      title: 'Navigation Support',
      description: 'Full keyboard navigation and screen reader compatibility'
    },
    {
      icon: '💾',
      title: 'Profile Persistence',
      description: 'Your accessibility preferences are saved automatically'
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      description: 'Learn on any device - desktop, tablet, or mobile'
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Key Features</h2>
          <p className="text-xl text-slate-600">
            Powerful accessibility tools to enhance your learning experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
