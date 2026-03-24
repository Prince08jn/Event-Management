'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TeamWithMembers } from '@/lib/teams';

interface TeamManagementProps {
  eventId: string;
  isTeamEvent: boolean;
  minTeamSize?: number;
  maxTeamSize?: number;
}

export function TeamManagement({ eventId, isTeamEvent, minTeamSize = 1, maxTeamSize = 10 }: TeamManagementProps) {
  const { data: session } = useSession();
  const [userTeam, setUserTeam] = useState<TeamWithMembers | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showJoinTeam, setShowJoinTeam] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [error, setError] = useState<string>('');

  const fetchTeamData = useCallback(async () => {
    if (!session?.user?.email) return;
    
    setLoading(true);
    try {
      // Fetch user's team for this event
      const userTeamRes = await fetch(`/api/teams?eventId=${eventId}&userEmail=${session.user.email}`);
      if (userTeamRes.ok) {
        const userData = await userTeamRes.json();
        setUserTeam(userData.userTeam);
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
      setError('Failed to load team information');
    } finally {
      setLoading(false);
    }
  }, [eventId, session?.user?.email]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchTeamData();
    }
  }, [fetchTeamData, session?.user?.email]);

  // If not a team event, don't render anything
  if (!isTeamEvent) {
    return null;
  }

  // If user is not signed in, show sign-in prompt
  if (!session?.user?.email) {
    return (
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Please sign in to create or join a team for this event.</p>
      </div>
    );
  }

  const createTeam = async () => {
    if (!teamName.trim()) {
      setError('Team name is required');
      return;
    }

    setActionLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          teamName: teamName.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowCreateTeam(false);
        setTeamName('');
        await fetchTeamData();
      } else {
        setError(data.error || 'Failed to create team');
      }
    } catch (error) {
      console.error('Error creating team:', error);
      setError('Failed to create team');
    } finally {
      setActionLoading(false);
    }
  };

  const joinTeam = async () => {
    if (!teamCode.trim()) {
      setError('Team code is required');
      return;
    }

    setActionLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/teams/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamCode: teamCode.trim().toUpperCase(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowJoinTeam(false);
        setTeamCode('');
        await fetchTeamData();
      } else {
        setError(data.error || 'Failed to join team');
      }
    } catch (error) {
      console.error('Error joining team:', error);
      setError('Failed to join team');
    } finally {
      setActionLoading(false);
    }
  };

  const leaveTeam = async () => {
    if (!userTeam || !confirm('Are you sure you want to leave this team?')) return;

    setActionLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/teams/${userTeam.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        await fetchTeamData();
      } else {
        setError(data.error || 'Failed to leave team');
      }
    } catch (error) {
      console.error('Error leaving team:', error);
      setError('Failed to leave team');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteTeam = async () => {
    if (!userTeam || !confirm('Are you sure you want to delete this team? All members will be removed.')) return;

    setActionLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/teams/${userTeam.id}?action=delete`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        await fetchTeamData();
      } else {
        setError(data.error || 'Failed to delete team');
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      setError('Failed to delete team');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Loading team information...</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Team Management</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>Team Requirements:</strong> {minTeamSize} - {maxTeamSize} members
        </p>
      </div>

      {userTeam ? (
        // User has a team
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">{userTeam.team_name}</h4>
            <p className="text-green-700 text-sm mb-2">
              Team Code: <span className="font-mono font-bold">{userTeam.team_code}</span>
            </p>
            <p className="text-green-700 text-sm mb-3">
              Members: {userTeam.members.length}/{maxTeamSize}
            </p>
            
            <div className="space-y-1">
              {userTeam.members.map((member) => (
                <div key={member.id} className="text-sm text-green-700">
                  {member.user_email}
                  {member.user_email === userTeam.creator_email && ' (Creator)'}
                  {member.user_email === session?.user?.email && ' (You)'}
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              {userTeam.creator_email === session?.user?.email ? (
                <Button
                  onClick={deleteTeam}
                  disabled={actionLoading}
                  variant="destructive"
                  size="sm"
                >
                  {actionLoading ? 'Deleting...' : 'Delete Team'}
                </Button>
              ) : (
                <Button
                  onClick={leaveTeam}
                  disabled={actionLoading}
                  variant="outline"
                  size="sm"
                >
                  {actionLoading ? 'Leaving...' : 'Leave Team'}
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        // User doesn't have a team
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setShowCreateTeam(!showCreateTeam);
                setShowJoinTeam(false);
                setError('');
              }}
              variant="default"
            >
              Create Team
            </Button>
            <Button
              onClick={() => {
                setShowJoinTeam(!showJoinTeam);
                setShowCreateTeam(false);
                setError('');
              }}
              variant="outline"
            >
              Join Team
            </Button>
          </div>

          {showCreateTeam && (
            <div className="p-4 bg-gray-50 border rounded-lg">
              <h4 className="font-semibold mb-3">Create New Team</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter team name"
                    disabled={actionLoading}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={createTeam} disabled={actionLoading}>
                    {actionLoading ? 'Creating...' : 'Create Team'}
                  </Button>
                  <Button
                    onClick={() => setShowCreateTeam(false)}
                    variant="outline"
                    disabled={actionLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {showJoinTeam && (
            <div className="p-4 bg-gray-50 border rounded-lg">
              <h4 className="font-semibold mb-3">Join Existing Team</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="teamCode">Team Code</Label>
                  <Input
                    id="teamCode"
                    value={teamCode}
                    onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                    placeholder="Enter 6-digit team code"
                    maxLength={6}
                    disabled={actionLoading}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={joinTeam} disabled={actionLoading}>
                    {actionLoading ? 'Joining...' : 'Join Team'}
                  </Button>
                  <Button
                    onClick={() => setShowJoinTeam(false)}
                    variant="outline"
                    disabled={actionLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}