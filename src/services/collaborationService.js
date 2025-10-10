import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  onSnapshot,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { analyzeWithGemini } from '../api/gemini';

/**
 * Real-time Collaboration Service
 * Provides virtual study rooms, shared whiteboards, and collaborative tools
 * Using Firebase for real-time synchronization (free tier compatible)
 */

// Create a new study room
export const createStudyRoom = async (roomData, userId) => {
  try {
    const docRef = await addDoc(collection(db, 'studyRooms'), {
      ...roomData,
      hostId: userId,
      createdAt: serverTimestamp(),
      isActive: true,
      participants: [userId],
      maxParticipants: roomData.maxParticipants || 8,
      roomType: roomData.roomType || 'general', // general, whiteboard, document, presentation
      privacy: roomData.privacy || 'public', // public, private, invite-only
      tools: {
        whiteboard: roomData.tools?.whiteboard || true,
        sharedDocuments: roomData.tools?.sharedDocuments || true,
        screenShare: roomData.tools?.screenShare || false, // Note: Actual screen sharing requires WebRTC
        voiceChat: roomData.tools?.voiceChat || false,
        videoChat: roomData.tools?.videoChat || false
      },
      settings: {
        allowDrawing: true,
        allowEditing: true,
        moderationRequired: false,
        recordSession: false
      }
    });

    // Create initial whiteboard canvas
    if (roomData.tools?.whiteboard !== false) {
      await addDoc(collection(db, 'whiteboards'), {
        roomId: docRef.id,
        elements: [],
        lastModified: serverTimestamp(),
        modifiedBy: userId
      });
    }

    return { id: docRef.id, ...roomData };
  } catch (error) {
    console.error('Error creating study room:', error);
    throw error;
  }
};

// Get available study rooms
export const getStudyRooms = async (filters = {}) => {
  try {
    let q = collection(db, 'studyRooms');
    
    // Apply filters
    if (filters.roomType) {
      q = query(q, where('roomType', '==', filters.roomType));
    }
    
    if (filters.privacy) {
      q = query(q, where('privacy', '==', filters.privacy));
    }
    
    // Only active rooms
    q = query(q, where('isActive', '==', true));
    
    // Sort by most recent
    q = query(q, orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      participantCount: doc.data().participants?.length || 0
    }));
  } catch (error) {
    console.error('Error getting study rooms:', error);
    throw error;
  }
};

// Join a study room
export const joinStudyRoom = async (roomId, userId) => {
  try {
    const roomRef = doc(db, 'studyRooms', roomId);
    const roomDoc = await getDoc(roomRef);
    
    if (!roomDoc.exists()) {
      throw new Error('Study room not found');
    }
    
    const roomData = roomDoc.data();
    
    // Check if room is full
    if (roomData.participants?.length >= roomData.maxParticipants) {
      throw new Error('Study room is full');
    }
    
    // Check if user is already in the room
    if (roomData.participants?.includes(userId)) {
      return { success: true, message: 'Already in room' };
    }
    
    // Add user to participants
    await updateDoc(roomRef, {
      participants: arrayUnion(userId)
    });
    
    // Add join activity
    await addDoc(collection(db, 'roomActivities'), {
      roomId,
      userId,
      action: 'joined',
      timestamp: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error joining study room:', error);
    throw error;
  }
};

// Leave a study room
export const leaveStudyRoom = async (roomId, userId) => {
  try {
    const roomRef = doc(db, 'studyRooms', roomId);
    
    await updateDoc(roomRef, {
      participants: arrayRemove(userId)
    });
    
    // Add leave activity
    await addDoc(collection(db, 'roomActivities'), {
      roomId,
      userId,
      action: 'left',
      timestamp: serverTimestamp()
    });
    
    // Check if room should be closed (no participants left)
    const roomDoc = await getDoc(roomRef);
    const roomData = roomDoc.data();
    
    if (roomData.participants?.length === 0) {
      await updateDoc(roomRef, {
        isActive: false,
        closedAt: serverTimestamp()
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error leaving study room:', error);
    throw error;
  }
};

// Real-time room listener
export const subscribeToRoom = (roomId, callback) => {
  const roomRef = doc(db, 'studyRooms', roomId);
  return onSnapshot(roomRef, (doc) => {
    if (doc.exists()) {
      callback({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        participantCount: doc.data().participants?.length || 0
      });
    }
  });
};

// Whiteboard operations
export const updateWhiteboard = async (roomId, elements, userId) => {
  try {
    const whiteboardQuery = query(
      collection(db, 'whiteboards'),
      where('roomId', '==', roomId)
    );
    
    const snapshot = await getDocs(whiteboardQuery);
    
    if (snapshot.empty) {
      // Create new whiteboard
      await addDoc(collection(db, 'whiteboards'), {
        roomId,
        elements,
        lastModified: serverTimestamp(),
        modifiedBy: userId
      });
    } else {
      // Update existing whiteboard
      const whiteboardDoc = snapshot.docs[0];
      await updateDoc(whiteboardDoc.ref, {
        elements,
        lastModified: serverTimestamp(),
        modifiedBy: userId
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating whiteboard:', error);
    throw error;
  }
};

// Subscribe to whiteboard changes
export const subscribeToWhiteboard = (roomId, callback) => {
  const whiteboardQuery = query(
    collection(db, 'whiteboards'),
    where('roomId', '==', roomId)
  );
  
  return onSnapshot(whiteboardQuery, (snapshot) => {
    if (!snapshot.empty) {
      const whiteboardDoc = snapshot.docs[0];
      callback({
        id: whiteboardDoc.id,
        ...whiteboardDoc.data(),
        lastModified: whiteboardDoc.data().lastModified?.toDate()
      });
    }
  });
};

// Shared document operations
export const createSharedDocument = async (roomId, documentData, userId) => {
  try {
    const docRef = await addDoc(collection(db, 'sharedDocuments'), {
      roomId,
      title: documentData.title || 'Untitled Document',
      content: documentData.content || '',
      createdBy: userId,
      createdAt: serverTimestamp(),
      lastModified: serverTimestamp(),
      modifiedBy: userId,
      collaborators: [userId],
      version: 1,
      isLocked: false
    });
    
    return { id: docRef.id, ...documentData };
  } catch (error) {
    console.error('Error creating shared document:', error);
    throw error;
  }
};

// Update shared document
export const updateSharedDocument = async (documentId, content, userId) => {
  try {
    const docRef = doc(db, 'sharedDocuments', documentId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Document not found');
    }
    
    const currentData = docSnap.data();
    
    await updateDoc(docRef, {
      content,
      lastModified: serverTimestamp(),
      modifiedBy: userId,
      version: (currentData.version || 1) + 1,
      collaborators: arrayUnion(userId)
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating shared document:', error);
    throw error;
  }
};

// Get room documents
export const getRoomDocuments = async (roomId) => {
  try {
    const documentsQuery = query(
      collection(db, 'sharedDocuments'),
      where('roomId', '==', roomId),
      orderBy('lastModified', 'desc')
    );
    
    const snapshot = await getDocs(documentsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      lastModified: doc.data().lastModified?.toDate()
    }));
  } catch (error) {
    console.error('Error getting room documents:', error);
    throw error;
  }
};

// Subscribe to shared document changes
export const subscribeToDocument = (documentId, callback) => {
  const docRef = doc(db, 'sharedDocuments', documentId);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        lastModified: doc.data().lastModified?.toDate()
      });
    }
  });
};

// Room chat functionality
export const sendRoomMessage = async (roomId, message, userId) => {
  try {
    await addDoc(collection(db, 'roomMessages'), {
      roomId,
      userId,
      message: message.trim(),
      timestamp: serverTimestamp(),
      type: 'text' // text, system, file, drawing
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error sending room message:', error);
    throw error;
  }
};

// Subscribe to room messages
export const subscribeToRoomMessages = (roomId, callback) => {
  const messagesQuery = query(
    collection(db, 'roomMessages'),
    where('roomId', '==', roomId),
    orderBy('timestamp', 'asc')
  );
  
  return onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }));
    callback(messages);
  });
};

// AI-powered room recommendations
export const getRoomRecommendations = async (userId, userInterests = []) => {
  try {
    const rooms = await getStudyRooms({ privacy: 'public' });
    
    if (rooms.length === 0) {
      return [];
    }
    
    const recommendationPrompt = `
You are an AI assistant helping students find the best study rooms for cybersecurity learning.

User Interests: ${userInterests.join(', ') || 'General cybersecurity learning'}

Available Study Rooms:
${rooms.map(room => `
ID: ${room.id}
Name: ${room.name}
Description: ${room.description}
Type: ${room.roomType}
Participants: ${room.participantCount}/${room.maxParticipants}
Topics: ${room.topics?.join(', ') || 'General'}
Host: ${room.hostId}
`).join('\n---\n')}

Please recommend the top 5 most relevant study rooms based on:
1. User interests alignment
2. Room activity level (participants)
3. Room type relevance
4. Learning objectives match

Return only room IDs, one per line, in order of recommendation priority.
If no rooms are suitable, return "NO_RECOMMENDATIONS".
`;

    const aiResponse = await analyzeWithGemini(recommendationPrompt);
    const recommendedIds = aiResponse.split('\n')
      .map(line => line.trim())
      .filter(line => line && line !== 'NO_RECOMMENDATIONS')
      .slice(0, 5);
    
    return recommendedIds
      .map(id => rooms.find(room => room.id === id))
      .filter(room => room);
  } catch (error) {
    console.error('Error getting room recommendations:', error);
    // Fallback to most active rooms
    return rooms
      .sort((a, b) => b.participantCount - a.participantCount)
      .slice(0, 5);
  }
};

// Session recording (metadata only - actual recording would need additional setup)
export const startSessionRecording = async (roomId, userId) => {
  try {
    await addDoc(collection(db, 'sessionRecordings'), {
      roomId,
      startedBy: userId,
      startedAt: serverTimestamp(),
      isActive: true,
      participants: [],
      duration: 0,
      recordingType: 'activity' // Only activity logging, not actual video/audio
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error starting session recording:', error);
    throw error;
  }
};

// Get room statistics
export const getRoomStatistics = async (roomId) => {
  try {
    const [messagesQuery, activitiesQuery] = await Promise.all([
      getDocs(query(collection(db, 'roomMessages'), where('roomId', '==', roomId))),
      getDocs(query(collection(db, 'roomActivities'), where('roomId', '==', roomId)))
    ]);
    
    const messageCount = messagesQuery.size;
    const activities = activitiesQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }));
    
    const joinCount = activities.filter(a => a.action === 'joined').length;
    const uniqueParticipants = [...new Set(activities.map(a => a.userId))].length;
    
    return {
      messageCount,
      joinCount,
      uniqueParticipants,
      totalActivities: activities.length,
      lastActivity: activities.length > 0 ? 
        Math.max(...activities.map(a => a.timestamp?.getTime() || 0)) : null
    };
  } catch (error) {
    console.error('Error getting room statistics:', error);
    throw error;
  }
};