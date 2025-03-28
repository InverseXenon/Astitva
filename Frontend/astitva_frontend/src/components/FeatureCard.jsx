import { Card } from './ui/Card';
import { ArrowRight } from 'lucide-react';

export function FeatureCard({ icon, title, description, link }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col h-full">
        <div className="mb-4 text-2xl">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 flex-1">{description}</p>
        <a
          href={link}
          className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700 mt-auto"
        >
          Learn more
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    </Card>
  );
}