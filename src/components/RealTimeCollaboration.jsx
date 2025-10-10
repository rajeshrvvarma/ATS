import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Video, 
  Users, 
  MessageSquare, 
  Share, 
  Settings,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Monitor,
  FileText,
  Palette,
  Plus,
  Clock,
  Eye,
  Lock,
  Unlock,
  X,
  Send,
  Download,
  Edit3,
  Trash2,
  Star,
  RefreshCw,
  Activity,
  Globe,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  createStudyRoom,
  getStudyRooms,
  joinStudyRoom,
  leaveStudyRoom,
  subscribeToRoom,
  updateWhiteboard,
  subscribeToWhiteboard,
  createSharedDocument,
  updateSharedDocument,
  getRoomDocuments,
  subscribeToDocument,
  sendRoomMessage,
  subscribeToRoomMessages,
  getRoomRecommendations,
  getRoomStatistics
} from '../services/collaborationService';

const RealTimeCollaboration = ({ onClose }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  
  const [activeView, setActiveView] = useState('rooms'); // rooms, create, room, whiteboard, documents
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomFilter, setRoomFilter] = useState('all');
  
  // Room state
  const [roomMessages, setRoomMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomDocuments, setRoomDocuments] = useState([]);
  const [whiteboardData, setWhiteboardData] = useState({ elements: [] });
  
  // Whiteboard state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const canvasRef = useRef(null);
  
  // Document editor state
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentContent, setDocumentContent] = useState('');
  
  // Room creation form
  const [roomForm, setRoomForm] = useState({
    name: '',
    description: '',
    roomType: 'general',
    privacy: 'public',
    maxParticipants: 8,
    topics: [],
    tools: {
      whiteboard: true,
      sharedDocuments: true,
      screenShare: false,
      voiceChat: false,
      videoChat: false
    }
  });

  const roomTypes = [
    { value: 'general', label: 'General Study', icon: Users },
    { value: 'whiteboard', label: 'Whiteboard Session', icon: Palette },
    { value: 'document', label: 'Document Collaboration', icon: FileText },
    { value: 'presentation', label: 'Presentation/Demo', icon: Monitor }
  ];

  const whiteboardTools = [
    { name: 'pen', icon: Edit3, label: 'Pen' },
    { name: 'eraser', icon: Trash2, label: 'Eraser' },
    { name: 'text', icon: FileText, label: 'Text' }
  ];

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000'
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [roomsData, recommendationsData] = await Promise.all([
        getStudyRooms(),
        getRoomRecommendations(currentUser?.uid, ['cybersecurity', 'networking', 'security'])
      ]);
      
      setRooms(roomsData);
      setRecommendations(recommendationsData);
    } catch (error) {
      console.error('Error loading collaboration data:', error);
      showToast('Failed to load collaboration tools', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    if (!roomForm.name.trim()) {
      showToast('Room name is required', 'error');
      return;
    }

    try {
      setLoading(true);
      const newRoom = await createStudyRoom(roomForm, currentUser.uid);
      setRooms(prev => [newRoom, ...prev]);
      setRoomForm({
        name: '',
        description: '',
        roomType: 'general',
        privacy: 'public',
        maxParticipants: 8,
        topics: [],
        tools: {
          whiteboard: true,
          sharedDocuments: true,
          screenShare: false,
          voiceChat: false,
          videoChat: false
        }
      });
      setActiveView('rooms');
      showToast('Study room created successfully!', 'success');
    } catch (error) {
      console.error('Error creating room:', error);
      showToast('Failed to create room', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      await joinStudyRoom(roomId, currentUser.uid);
      const room = rooms.find(r => r.id === roomId);
      setCurrentRoom(room);
      setActiveView('room');
      
      // Subscribe to room updates
      const unsubscribeRoom = subscribeToRoom(roomId, (updatedRoom) => {
        setCurrentRoom(updatedRoom);
      });
      
      // Subscribe to messages
      const unsubscribeMessages = subscribeToRoomMessages(roomId, (messages) => {
        setRoomMessages(messages);
      });
      
      // Load room documents
      const documents = await getRoomDocuments(roomId);
      setRoomDocuments(documents);
      
      // Subscribe to whiteboard if enabled
      if (room.tools?.whiteboard) {
        const unsubscribeWhiteboard = subscribeToWhiteboard(roomId, (whiteboardData) => {
          setWhiteboardData(whiteboardData);
          redrawCanvas(whiteboardData.elements);
        });
      }
      
      showToast('Joined study room successfully!', 'success');
    } catch (error) {
      console.error('Error joining room:', error);
      showToast('Failed to join room', 'error');
    }
  };

  const handleLeaveRoom = async () => {
    try {
      await leaveStudyRoom(currentRoom.id, currentUser.uid);
      setCurrentRoom(null);
      setActiveView('rooms');
      setRoomMessages([]);
      setRoomDocuments([]);
      setWhiteboardData({ elements: [] });
      showToast('Left study room', 'success');
    } catch (error) {
      console.error('Error leaving room:', error);
      showToast('Failed to leave room', 'error');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentRoom) return;

    try {
      await sendRoomMessage(currentRoom.id, newMessage, currentUser.uid);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Failed to send message', 'error');
    }
  };

  const handleCreateDocument = async () => {
    if (!currentRoom) return;

    try {
      const newDoc = await createSharedDocument(
        currentRoom.id,
        { title: 'New Document', content: '' },
        currentUser.uid
      );
      setRoomDocuments(prev => [newDoc, ...prev]);
      showToast('Document created successfully!', 'success');
    } catch (error) {
      console.error('Error creating document:', error);
      showToast('Failed to create document', 'error');
    }
  };

  // Whiteboard functions
  const startDrawing = (e) => {
    if (currentTool === 'pen') {
      setIsDrawing(true);
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newElement = {
        type: 'path',
        points: [{ x, y }],
        color: currentColor,
        strokeWidth,
        timestamp: Date.now()
      };
      
      setWhiteboardData(prev => ({
        ...prev,
        elements: [...prev.elements, newElement]
      }));
    }
  };

  const draw = (e) => {
    if (!isDrawing || currentTool !== 'pen') return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setWhiteboardData(prev => {
      const elements = [...prev.elements];
      const lastElement = elements[elements.length - 1];
      
      if (lastElement && lastElement.type === 'path') {
        lastElement.points.push({ x, y });
      }
      
      return { ...prev, elements };
    });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (currentRoom && whiteboardData.elements.length > 0) {
      updateWhiteboard(currentRoom.id, whiteboardData.elements, currentUser.uid);
    }
  };

  const redrawCanvas = (elements) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    elements.forEach(element => {
      if (element.type === 'path' && element.points.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = element.color;
        ctx.lineWidth = element.strokeWidth;
        ctx.lineCap = 'round';
        
        ctx.moveTo(element.points[0].x, element.points[0].y);
        element.points.forEach(point => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      }
    });
  };

  const clearWhiteboard = () => {
    setWhiteboardData({ elements: [] });
    if (currentRoom) {
      updateWhiteboard(currentRoom.id, [], currentUser.uid);
    }
  };

  const filteredRooms = useMemo(() => {
    let filtered = rooms;
    
    if (roomFilter === 'available') {
      filtered = filtered.filter(room => room.participantCount < room.maxParticipants);
    } else if (roomFilter === 'active') {
      filtered = filtered.filter(room => room.participantCount > 0);
    } else if (roomFilter === 'whiteboard') {
      filtered = filtered.filter(room => room.roomType === 'whiteboard');
    } else if (roomFilter === 'document') {
      filtered = filtered.filter(room => room.roomType === 'document');
    }
    
    return filtered;
  }, [rooms, roomFilter]);

  if (loading && rooms.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setActiveView('rooms')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'rooms'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Study Rooms</span>
            </button>
            
            <button
              onClick={() => setActiveView('create')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'create'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create Room</span>
            </button>
            
            {currentRoom && (
              <div className="flex items-center space-x-4 ml-8 pl-8 border-l border-gray-300">
                <span className="text-sm text-gray-600">Current Room:</span>
                <span className="font-medium text-gray-900">{currentRoom.name}</span>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {currentRoom.participantCount}/{currentRoom.maxParticipants}
                  </span>
                </div>
                <button
                  onClick={handleLeaveRoom}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Leave Room
                </button>
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            {rooms.length} rooms available • Real-time collaboration
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'rooms' && (
          <div className="h-full flex">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
              {/* Filters */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Filter Rooms</h3>
                <select
                  value={roomFilter}
                  onChange={(e) => setRoomFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Rooms</option>
                  <option value="available">Available to Join</option>
                  <option value="active">Active Rooms</option>
                  <option value="whiteboard">Whiteboard Sessions</option>
                  <option value="document">Document Collaboration</option>
                </select>
              </div>

              {/* AI Recommendations */}
              {recommendations.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    AI Recommendations
                  </h3>
                  <div className="space-y-2">
                    {recommendations.slice(0, 3).map(room => (
                      <button
                        key={room.id}
                        onClick={() => handleJoinRoom(room.id)}
                        className="w-full text-left p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg hover:from-yellow-100 hover:to-orange-100 transition-colors"
                      >
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {room.name}
                        </div>
                        <div className="text-xs text-gray-600 flex items-center space-x-2">
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {room.participantCount}/{room.maxParticipants}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            {room.roomType}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Room Statistics */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Platform Stats</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Active Rooms:</span>
                    <span>{rooms.filter(r => r.participantCount > 0).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Participants:</span>
                    <span>{rooms.reduce((sum, r) => sum + r.participantCount, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Spots:</span>
                    <span>{rooms.reduce((sum, r) => sum + (r.maxParticipants - r.participantCount), 0)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rooms List */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid gap-4">
                {filteredRooms.map(room => (
                  <div
                    key={room.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {room.name}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            room.privacy === 'public' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {room.privacy === 'public' ? (
                              <><Globe className="w-3 h-3 inline mr-1" />Public</>
                            ) : (
                              <><Lock className="w-3 h-3 inline mr-1" />Private</>
                            )}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {roomTypes.find(t => t.value === room.roomType)?.label || room.roomType}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4">
                          {room.description || 'No description available'}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {room.participantCount}/{room.maxParticipants} participants
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {room.createdAt?.toLocaleDateString()}
                          </span>
                          {room.tools?.whiteboard && (
                            <span className="flex items-center">
                              <Palette className="w-4 h-4 mr-1" />
                              Whiteboard
                            </span>
                          )}
                          {room.tools?.sharedDocuments && (
                            <span className="flex items-center">
                              <FileText className="w-4 h-4 mr-1" />
                              Documents
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {room.participantCount < room.maxParticipants ? (
                              <span className="flex items-center text-green-600 text-sm">
                                <Activity className="w-4 h-4 mr-1" />
                                Available to Join
                              </span>
                            ) : (
                              <span className="flex items-center text-red-600 text-sm">
                                <Users className="w-4 h-4 mr-1" />
                                Room Full
                              </span>
                            )}
                          </div>
                          
                          <button
                            onClick={() => handleJoinRoom(room.id)}
                            disabled={room.participantCount >= room.maxParticipants}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Join Room
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredRooms.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No study rooms found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters or create a new study room.
                    </p>
                    <button
                      onClick={() => setActiveView('create')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create New Room
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeView === 'create' && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Study Room</h2>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room Name *
                    </label>
                    <input
                      type="text"
                      value={roomForm.name}
                      onChange={(e) => setRoomForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter room name..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={roomForm.description}
                      onChange={(e) => setRoomForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this room is for..."
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Room Type
                      </label>
                      <select
                        value={roomForm.roomType}
                        onChange={(e) => setRoomForm(prev => ({ ...prev, roomType: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {roomTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Privacy
                      </label>
                      <select
                        value={roomForm.privacy}
                        onChange={(e) => setRoomForm(prev => ({ ...prev, privacy: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="invite-only">Invite Only</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Participants: {roomForm.maxParticipants}
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="20"
                      value={roomForm.maxParticipants}
                      onChange={(e) => setRoomForm(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>2</span>
                      <span>20</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Available Tools
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={roomForm.tools.whiteboard}
                          onChange={(e) => setRoomForm(prev => ({
                            ...prev,
                            tools: { ...prev.tools, whiteboard: e.target.checked }
                          }))}
                          className="mr-2"
                        />
                        <Palette className="w-4 h-4 mr-2 text-purple-600" />
                        <span className="text-sm">Whiteboard</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={roomForm.tools.sharedDocuments}
                          onChange={(e) => setRoomForm(prev => ({
                            ...prev,
                            tools: { ...prev.tools, sharedDocuments: e.target.checked }
                          }))}
                          className="mr-2"
                        />
                        <FileText className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="text-sm">Shared Documents</span>
                      </label>
                      
                      <label className="flex items-center opacity-50">
                        <input
                          type="checkbox"
                          checked={roomForm.tools.screenShare}
                          onChange={(e) => setRoomForm(prev => ({
                            ...prev,
                            tools: { ...prev.tools, screenShare: e.target.checked }
                          }))}
                          className="mr-2"
                          disabled
                        />
                        <Monitor className="w-4 h-4 mr-2 text-green-600" />
                        <span className="text-sm">Screen Share (Coming Soon)</span>
                      </label>
                      
                      <label className="flex items-center opacity-50">
                        <input
                          type="checkbox"
                          checked={roomForm.tools.voiceChat}
                          onChange={(e) => setRoomForm(prev => ({
                            ...prev,
                            tools: { ...prev.tools, voiceChat: e.target.checked }
                          }))}
                          className="mr-2"
                          disabled
                        />
                        <Mic className="w-4 h-4 mr-2 text-red-600" />
                        <span className="text-sm">Voice Chat (Coming Soon)</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setActiveView('rooms')}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateRoom}
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Creating...' : 'Create Room'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'room' && currentRoom && (
          <div className="h-full flex">
            {/* Main Room Area */}
            <div className="flex-1 flex flex-col">
              {/* Room Tools */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {currentRoom.tools?.whiteboard && (
                      <button
                        onClick={() => setActiveView('whiteboard')}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                      >
                        <Palette className="w-4 h-4" />
                        <span>Whiteboard</span>
                      </button>
                    )}
                    
                    {currentRoom.tools?.sharedDocuments && (
                      <button
                        onClick={() => setActiveView('documents')}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Documents</span>
                      </button>
                    )}
                    
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg opacity-50 cursor-not-allowed">
                      <Monitor className="w-4 h-4" />
                      <span>Screen Share (Coming Soon)</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {currentRoom.participantCount} participants online
                    </span>
                    <button
                      onClick={() => setActiveView('room')}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      Room Chat
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Room Content Area */}
              <div className="flex-1 bg-gray-50 p-6">
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Welcome to {currentRoom.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Use the tools above to start collaborating with your study group
                  </p>
                  <div className="flex justify-center space-x-4">
                    {currentRoom.tools?.whiteboard && (
                      <button
                        onClick={() => setActiveView('whiteboard')}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Open Whiteboard
                      </button>
                    )}
                    {currentRoom.tools?.sharedDocuments && (
                      <button
                        onClick={() => setActiveView('documents')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Documents
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Chat Sidebar */}
            <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">Room Chat</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {roomMessages.map(message => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {message.userId === currentUser.uid ? 'You' : 'User'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {message.timestamp?.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'whiteboard' && currentRoom && (
          <div className="h-full flex flex-col">
            {/* Whiteboard Tools */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {whiteboardTools.map(tool => (
                      <button
                        key={tool.name}
                        onClick={() => setCurrentTool(tool.name)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                          currentTool === tool.name
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <tool.icon className="w-4 h-4" />
                        <span className="text-sm">{tool.label}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Color:</span>
                    <div className="flex space-x-1">
                      {colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setCurrentColor(color)}
                          className={`w-6 h-6 rounded-full border-2 ${
                            currentColor === color ? 'border-gray-400' : 'border-gray-200'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Size:</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={strokeWidth}
                      onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm text-gray-600 w-8">{strokeWidth}px</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={clearWhiteboard}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setActiveView('room')}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Back to Room
                  </button>
                </div>
              </div>
            </div>
            
            {/* Whiteboard Canvas */}
            <div className="flex-1 bg-white">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-full cursor-crosshair border border-gray-200"
              />
            </div>
          </div>
        )}

        {activeView === 'documents' && currentRoom && (
          <div className="h-full flex">
            {/* Documents List */}
            <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Documents</h3>
                <button
                  onClick={handleCreateDocument}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                {roomDocuments.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDocument(doc)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedDocument?.id === doc.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {doc.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      Modified {doc.lastModified?.toLocaleDateString()}
                    </div>
                  </button>
                ))}
                
                {roomDocuments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No documents yet</p>
                    <p className="text-xs">Click + to create one</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Document Editor */}
            <div className="flex-1 flex flex-col">
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">
                    {selectedDocument ? selectedDocument.title : 'Select a document'}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveView('room')}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Back to Room
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-6">
                {selectedDocument ? (
                  <textarea
                    value={documentContent}
                    onChange={(e) => setDocumentContent(e.target.value)}
                    onBlur={() => {
                      if (documentContent !== selectedDocument.content) {
                        updateSharedDocument(selectedDocument.id, documentContent, currentUser.uid);
                      }
                    }}
                    placeholder="Start typing your document..."
                    className="w-full h-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No document selected
                      </h3>
                      <p className="text-gray-600">
                        Select a document from the sidebar or create a new one
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTimeCollaboration;