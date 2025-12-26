import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { VideoSDKMeeting } from '@videosdk.live/rtc-js-prebuilt';
import { consultationService } from '../services/consultation.service';
import { Loader2 } from 'lucide-react';

const Room = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const meetingInitialized = useRef(false);

  useEffect(() => {
    const getMeetingCredentials = async () => {
      if (!id) return;

      try {
        let currentToken = location.state?.token;
        let currentMeetingId = location.state?.roomId;

        if (!currentToken || !currentMeetingId) {
          const response = await consultationService.joinConsultation(id);
          if (response.success) {
            currentToken = response.data.token;
            currentMeetingId = response.data.roomId;
          } else {
            throw new Error('Failed to get meeting credentials');
          }
        }

        setToken(currentToken);
        setMeetingId(currentMeetingId);
      } catch (err: any) {
        console.error('Error fetching credentials:', err);
        setError('Failed to initialize meeting. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    getMeetingCredentials();
  }, [id, location.state]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        // Handle various meeting end/leave events
        if (
          data?.type === 'meeting-left' || 
          data?.event === 'meeting-left' ||
          data?.type === 'meeting-ended' ||
          data?.event === 'meeting-ended' ||
          data?.action === 'leave' ||
          (data?.type === 'participant-left' && data?.data?.isLocal)
        ) {
          navigate('/dashboard');
        }
      } catch (e) {
        // Ignore non-JSON messages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  useEffect(() => {
    if (token && meetingId && !meetingInitialized.current) {
      meetingInitialized.current = true;

      const config = {
        name: "RemediX User",
        meetingId: meetingId,
        containerId: null, // Full screen
        // redirectOnLeave removed to prevent browser security blocks
        micEnabled: true,
        webcamEnabled: true,
        participantCanToggleSelfWebcam: true,
        participantCanToggleSelfMic: true,
        chatEnabled: true,
        screenShareEnabled: true,
        realtimeTranscription: {
          enabled: true,
          visible: true,
        },
        permissions: {
          toggleRealtimeTranscription: true,
        },
        token: token,
        joinWithoutUserInteraction: true,
        joinScreen: {
          visible: false,
          title: "Consultation Room",
          meetingUrl: window.location.href,
        },
        leftScreen: {
          actionButton: {
            label: "Back to Dashboard",
            href: window.location.origin + '/dashboard',
          },
        },
      };

      const meeting = new VideoSDKMeeting();
      meeting.init(config);
    }
  }, [token, meetingId]);

  if (loading) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin" size={32} />
          <p>Preparing secure room...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-slate-200">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Room;
