import { useState } from 'react';
import { X } from 'lucide-react';
import { createMentorshipRequest } from '../services/api';

interface MentorshipRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  recipientType: 'student' | 'faculty' | 'industry';
  requestType: 'student_to_mentor' | 'mentor_to_student';
}

export default function MentorshipRequestModal({
  isOpen,
  onClose,
  recipientId,
  recipientName,
  recipientType,
  requestType
}: MentorshipRequestModalProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      const response = await createMentorshipRequest({
        requester_id: userData.id,
        requester_type: userData.user_type,
        recipient_id: recipientId,
        recipient_type: recipientType,
        request_type: requestType,
        message: message
      });

      if (response.data.status === 'success') {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setMessage('');
          setSuccess(false);
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to send request');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send mentorship request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {requestType === 'student_to_mentor' ? 'Request Mentorship' : 'Offer Mentorship'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <p className="text-lg font-semibold text-green-600">Request sent successfully!</p>
            </div>
          ) : (
            <>
              <p className="text-gray-700 mb-4">
                Send a mentorship {requestType === 'student_to_mentor' ? 'request' : 'offer'} to{' '}
                <span className="font-semibold">{recipientName}</span>
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Introduce yourself and explain why you'd like ${
                    requestType === 'student_to_mentor' ? 'them to mentor you' : 'to mentor them'
                  }...`}
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
