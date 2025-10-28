import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Send } from 'lucide-react';
import api from '../config/api';

interface Request {
  id: string;
  title: string;
  description: string;
  location: string;
  category?: {
    name: string;
  };
}

interface SubmitOfferModalProps {
  request: Request;
  onClose: () => void;
}

const SubmitOfferModal: React.FC<SubmitOfferModalProps> = ({ request, onClose }) => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');

  const submitMutation = useMutation({
    mutationFn: async (data: { requestId: string; message: string }) => {
      const response = await api.post('/organizations/offers', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['csr-offers'] });
      queryClient.invalidateQueries({ queryKey: ['csr-offers-list'] });
      alert('✅ Volunteer offer submitted successfully!');
      onClose();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to submit offer';
      alert(`❌ Error: ${errorMessage}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    if (message.trim().length < 20) {
      alert('Please provide a more detailed message (at least 20 characters)');
      return;
    }

    submitMutation.mutate({
      requestId: request.id,
      message: message.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Submit Volunteer Offer</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={submitMutation.isPending}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Request Details */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Request Details:</h3>
            <p className="text-lg font-semibold text-blue-900 mb-1">{request.title}</p>
            <p className="text-sm text-gray-700 mb-2">{request.description}</p>
            <div className="flex gap-4 text-sm text-gray-600">
              {request.category && (
                <span className="bg-white px-2 py-1 rounded">
                  Category: {request.category.name}
                </span>
              )}
              <span className="bg-white px-2 py-1 rounded">
                Location: {request.location}
              </span>
            </div>
          </div>

          {/* Offer Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Your Volunteer Offer Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              rows={6}
              placeholder="Describe how your organization can help with this request. Include:&#10;- What services/assistance you can provide&#10;- When you're available&#10;- Any questions you have&#10;- How to best contact you&#10;&#10;(Minimum 20 characters)"
              required
              disabled={submitMutation.isPending}
            />
            <p className="text-sm text-gray-500 mt-1">
              {message.length} characters {message.length < 20 && `(minimum 20 required)`}
            </p>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">💡 Tips for a Great Offer:</h4>
            <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
              <li>Be specific about what help you can provide</li>
              <li>Include your availability and timeline</li>
              <li>Mention any relevant experience or expertise</li>
              <li>Be professional and friendly</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={submitMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitMutation.isPending || message.trim().length < 20}
              className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              {submitMutation.isPending ? 'Submitting...' : 'Submit Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitOfferModal;
