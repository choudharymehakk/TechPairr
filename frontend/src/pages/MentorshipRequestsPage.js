import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Check, X, Mail, Clock, User } from 'lucide-react';
import { getUserMentorshipRequests, updateMentorshipRequestStatus } from '../services/api';
export default function MentorshipRequestsPage() {
    const [sentRequests, setSentRequests] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('received');
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
            }
            else {
                setError('Failed to load requests');
            }
        }
        catch (err) {
            console.error('Error fetching requests:', err);
            setError('Failed to load mentorship requests');
        }
        finally {
            setLoading(false);
        }
    };
    const handleStatusUpdate = async (requestId, status) => {
        try {
            const response = await updateMentorshipRequestStatus(requestId, status);
            if (response.data.status === 'success') {
                // Show success message
                setSuccessMessage(status === 'accepted'
                    ? '✅ Request accepted! You can now send an email to connect.'
                    : '❌ Request rejected.');
                // Refresh the list
                fetchRequests();
                // Clear message after 3 seconds
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        }
        catch (err) {
            console.error('Error updating request:', err);
            alert('Failed to update request status');
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Loading requests..." })] }) }));
    }
    const renderRequest = (request, isReceived) => {
        const otherUser = isReceived ? request.requester : request.recipient;
        const isPending = request.status === 'pending';
        const isAccepted = request.status === 'accepted';
        return (_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 mb-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl", children: request.request_type === 'student_to_mentor' ? '🎓' : '👨‍🏫' }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: otherUser?.full_name }), _jsx("p", { className: "text-sm text-gray-600", children: otherUser?.email }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: isReceived
                                                ? request.request_type === 'student_to_mentor'
                                                    ? 'Requesting mentorship from you'
                                                    : 'Offering to mentor you'
                                                : request.request_type === 'student_to_mentor'
                                                    ? 'You requested mentorship'
                                                    : 'You offered mentorship' })] })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    request.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                        request.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                            'bg-gray-100 text-gray-700'}`, children: request.status.charAt(0).toUpperCase() + request.status.slice(1) }) })] }), request.message && (_jsx("div", { className: "mb-4 p-3 bg-gray-50 rounded-lg", children: _jsxs("p", { className: "text-sm text-gray-700", children: [_jsx(Mail, { className: "w-4 h-4 inline mr-2 text-gray-500" }), request.message] }) })), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-500", children: [_jsx(Clock, { className: "w-4 h-4" }), _jsx("span", { children: new Date(request.created_at).toLocaleDateString() })] }), isReceived && isPending && (_jsxs("div", { className: "flex gap-3", children: [_jsxs("button", { onClick: () => handleStatusUpdate(request.id, 'accepted'), className: "flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors", children: [_jsx(Check, { className: "w-4 h-4" }), "Accept"] }), _jsxs("button", { onClick: () => handleStatusUpdate(request.id, 'rejected'), className: "flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors", children: [_jsx(X, { className: "w-4 h-4" }), "Reject"] })] })), isAccepted && (_jsxs("a", { href: `mailto:${otherUser?.email}?subject=Mentorship Connection - Let's Connect!&body=Hi ${otherUser?.full_name},%0D%0A%0D%0AI'm reaching out regarding our mentorship connection on Mentora.%0D%0A%0D%0ALooking forward to connecting with you!%0D%0A%0D%0ABest regards`, className: "flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors", children: [_jsx(Mail, { className: "w-4 h-4" }), "Send Email"] }))] })] }, request.id));
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-8", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 flex items-center gap-3", children: [_jsx(User, { className: "w-8 h-8 text-blue-600" }), "Mentorship Requests"] }), _jsx("p", { className: "mt-2 text-gray-600", children: "Manage your mentorship requests and offers" })] }), successMessage && (_jsx("div", { className: "mb-6 p-4 bg-green-50 border border-green-200 rounded-lg", children: _jsx("p", { className: "text-green-800 text-center font-medium", children: successMessage }) })), _jsx("div", { className: "bg-white rounded-lg shadow-md mb-6", children: _jsxs("div", { className: "flex border-b", children: [_jsxs("button", { onClick: () => setActiveTab('received'), className: `flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'received'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'}`, children: ["Received (", receivedRequests.filter(r => r.status === 'pending').length, ")"] }), _jsxs("button", { onClick: () => setActiveTab('sent'), className: `flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'sent'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'}`, children: ["Sent (", sentRequests.length, ")"] })] }) }), error ? (_jsx("div", { className: "text-center py-12 bg-white rounded-lg shadow", children: _jsx("p", { className: "text-red-600", children: error }) })) : activeTab === 'received' ? (receivedRequests.length === 0 ? (_jsxs("div", { className: "text-center py-12 bg-white rounded-lg shadow", children: [_jsx(Mail, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No requests received" }), _jsx("p", { className: "text-gray-600", children: "When someone sends you a mentorship request, it will appear here" })] })) : (_jsx("div", { children: receivedRequests.map(request => renderRequest(request, true)) }))) : (sentRequests.length === 0 ? (_jsxs("div", { className: "text-center py-12 bg-white rounded-lg shadow", children: [_jsx(Mail, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No requests sent" }), _jsx("p", { className: "text-gray-600", children: "Start exploring and send mentorship requests to connect with others" })] })) : (_jsx("div", { children: sentRequests.map(request => renderRequest(request, false)) })))] }) }));
}
