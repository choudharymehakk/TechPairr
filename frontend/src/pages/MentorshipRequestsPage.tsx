import { useState, useEffect } from 'react';
import { Check, X, Mail, Clock, User } from 'lucide-react';
import { getUserMentorshipRequests, updateMentorshipRequestStatus } from '../services/api';

interface MentorshipRequest {
  id: string;
  requester_id: string;
  requester_type: string;
  recipient_id: string;
  recipient_type: string;
  request_type: string;
  message: string;
  status: string;
  created_at: string;
  requester?: {
    full_name: string;
    email: string;
  };
  recipient?: {
    full_name: string;
    email: string;
  };
}

export default function MentorshipRequestsPage() {
  const [sentRequests, setSentRequests] = useState<MentorshipRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<MentorshipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await getUserMentorshipRequests(userData.id);
      
      if (response.data.status === 'success') {
        setSentRequests(response.data.data.sent || []);
        setReceivedRequests(response.data.data.received || []);
      } else {
        setError('Failed to load requests');
      }
    } catch (err: any) {
      console.error('Error fetching requests:', err);
      setError('Failed to load mentorship requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      const response = await updateMentorshipRequestStatus(requestId, status);
      
      if (response.data.status === 'success') {
        // Show success message
        setSuccessMessage(
          status === 'accepted' 
            ? '✅ Request accepted! You can now send an email to connect.' 
            : '❌ Request rejected.'
        );
        
        // Refresh the list
        fetchRequests();
        
        // Clear message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err: any) {
      console.error('Error updating request:', err);
      alert('Failed to update request status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  const renderRequest = (request: MentorshipRequest, isReceived: boolean) => {
    const otherUser = isReceived ? request.requester : request.recipient;
    const isPending = request.status === 'pending';
    const isAccepted = request.status === 'accepted';
    
    return (
      <div key={request.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
              {request.request_type === 'student_to_mentor' ? '🎓' : '👨‍🏫'}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {otherUser?.full_name}
              </h3>
              <p className="text-sm text-gray-600">{otherUser?.email}</p>
              <p className="text-xs text-gray-500 mt-1">
                {isReceived 
                  ? request.request_type === 'student_to_mentor' 
                    ? 'Requesting mentorship from you'
                    : 'Offering to mentor you'
                  : request.request_type === 'student_to_mentor'
                    ? 'You requested mentorship'
                    : 'You offered mentorship'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              request.status === 'accepted' ? 'bg-green-100 text-green-700' :
              request.status === 'rejected' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>
        </div>

        {request.message && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <Mail className="w-4 h-4 inline mr-2 text-gray-500" />
              {request.message}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{new Date(request.created_at).toLocaleDateString()}</span>
          </div>

          {isReceived && isPending && (
            <div className="flex gap-3">
              <button
                onClick={() => handleStatusUpdate(request.id, 'accepted')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Check className="w-4 h-4" />
                Accept
              </button>
              <button
                onClick={() => handleStatusUpdate(request.id, 'rejected')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <X className="w-4 h-4" />
                Reject
              </button>
            </div>
          )}

          {isAccepted && (
            <a
              href={`mailto:${otherUser?.email}?subject=Mentorship Connection - Let's Connect!&body=Hi ${otherUser?.full_name},%0D%0A%0D%0AI'm reaching out regarding our mentorship connection on Mentora.%0D%0A%0D%0ALooking forward to connecting with you!%0D%0A%0D%0ABest regards`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Mail className="w-4 h-4" />
              Send Email
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <User className="w-8 h-8 text-blue-600" />
            Mentorship Requests
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your mentorship requests and offers
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-center font-medium">{successMessage}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'received'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Received ({receivedRequests.filter(r => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'sent'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sent ({sentRequests.length})
            </button>
          </div>
        </div>

        {/* Requests List */}
        {error ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-red-600">{error}</p>
          </div>
        ) : activeTab === 'received' ? (
          receivedRequests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests received</h3>
              <p className="text-gray-600">
                When someone sends you a mentorship request, it will appear here
              </p>
            </div>
          ) : (
            <div>
              {receivedRequests.map(request => renderRequest(request, true))}
            </div>
          )
        ) : (
          sentRequests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests sent</h3>
              <p className="text-gray-600">
                Start exploring and send mentorship requests to connect with others
              </p>
            </div>
          ) : (
            <div>
              {sentRequests.map(request => renderRequest(request, false))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
