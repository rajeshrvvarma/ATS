import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  User,
  BookOpen,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { getDeletionRequests, approveDeletionRequest, rejectDeletionRequest } from '@/services/courseService.js';

const AdminDeletionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingRequest, setProcessingRequest] = useState(null);

  useEffect(() => {
    loadDeletionRequests();
  }, []);

  const loadDeletionRequests = () => {
    try {
      const allRequests = getDeletionRequests();
      setRequests(allRequests);
    } catch (error) {
      console.error('Error loading deletion requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    setProcessingRequest(requestId);
    try {
      await approveDeletionRequest(requestId);
      loadDeletionRequests();
      alert('Course deletion request approved and course deleted successfully.');
    } catch (error) {
      console.error('Error approving deletion request:', error);
      alert('Error approving deletion request.');
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleRejectRequest = async (requestId) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    if (reason === null) return; // User cancelled
    
    setProcessingRequest(requestId);
    try {
      await rejectDeletionRequest(requestId, reason);
      loadDeletionRequests();
      alert('Course deletion request rejected.');
    } catch (error) {
      console.error('Error rejecting deletion request:', error);
      alert('Error rejecting deletion request.');
    } finally {
      setProcessingRequest(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const processedRequests = requests.filter(req => req.status !== 'pending');

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deletion requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Trash2 className="h-6 w-6 text-red-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Course Deletion Requests</h2>
          <p className="text-gray-600">Review and approve instructor deletion requests</p>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-yellow-600" />
          Pending Requests ({pendingRequests.length})
        </h3>
        
        {pendingRequests.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600">No pending deletion requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <h4 className="text-lg font-semibold text-gray-900">{request.courseName}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="h-4 w-4" />
                        <span className="text-sm">
                          <strong>Instructor:</strong> {request.instructorName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          <strong>Requested:</strong> {new Date(request.requestedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <BookOpen className="h-4 w-4" />
                        <span className="text-sm">
                          <strong>Course ID:</strong> {request.courseId}
                        </span>
                      </div>
                    </div>
                    
                    {request.reason && (
                      <div className="mb-4 p-3 bg-white rounded border">
                        <p className="text-sm text-gray-700">
                          <strong>Reason:</strong> {request.reason}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleApproveRequest(request.id)}
                      disabled={processingRequest === request.id}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {processingRequest === request.id ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      disabled={processingRequest === request.id}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                      {processingRequest === request.id ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Decisions ({processedRequests.length})
          </h3>
          
          <div className="space-y-3">
            {processedRequests.slice(0, 10).map((request) => (
              <div
                key={request.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="h-4 w-4 text-gray-600" />
                      <span className="font-medium text-gray-900">{request.courseName}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      by {request.instructorName} • {new Date(request.requestedAt).toLocaleDateString()}
                    </p>
                    {request.rejectionReason && (
                      <p className="text-sm text-red-600 mt-1">
                        <strong>Rejection reason:</strong> {request.rejectionReason}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {request.status === 'approved' && request.approvedAt && 
                      `Approved: ${new Date(request.approvedAt).toLocaleDateString()}`
                    }
                    {request.status === 'rejected' && request.rejectedAt && 
                      `Rejected: ${new Date(request.rejectedAt).toLocaleDateString()}`
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDeletionRequests;