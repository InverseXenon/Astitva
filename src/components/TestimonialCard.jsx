import { Card } from './Card';
// import { Avatar } from './ui/Avatar';
import React from 'react';

export function TestimonialCard({ quote, name, role, avatar }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <blockquote className="text-gray-600 mb-6">"{quote}"</blockquote>
      <div className="flex items-center gap-4">
        {/* <Avatar src={avatar} /> */}
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
    </Card>
  );
}