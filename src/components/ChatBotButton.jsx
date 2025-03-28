import { MessageCircle } from 'lucide-react';

export function ChatbotButton() {
  return (
    <div className="fixed bottom-6 right-6">
      <button className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Open chat</span>
      </button>
    </div>
  );
}