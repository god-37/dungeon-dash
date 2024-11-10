import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Crown, Medal } from 'lucide-react';

interface LeaderboardEntry {
  username: string;
  score: number;
  created_at: string;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timeFrame, setTimeFrame] = useState<'all' | 'daily' | 'weekly'>('all');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      let query = supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);

      if (timeFrame === 'daily') {
        query = query.gte('created_at', new Date(Date.now() - 86400000).toISOString());
      } else if (timeFrame === 'weekly') {
        query = query.gte('created_at', new Date(Date.now() - 604800000).toISOString());
      }

      const { data, error } = await query;

      if (!error && data) {
        setLeaderboard(data);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [timeFrame]);

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 2:
        return <Medal className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed right-0 top-20 bg-gray-800 bg-opacity-90 p-4 text-white w-80 rounded-l-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          <h2 className="text-xl font-bold">Leaderboard</h2>
        </div>
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => setTimeFrame('all')}
            className={`px-2 py-1 rounded ${
              timeFrame === 'all' ? 'bg-blue-500' : 'bg-gray-700'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setTimeFrame('daily')}
            className={`px-2 py-1 rounded ${
              timeFrame === 'daily' ? 'bg-blue-500' : 'bg-gray-700'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeFrame('weekly')}
            className={`px-2 py-1 rounded ${
              timeFrame === 'weekly' ? 'bg-blue-500' : 'bg-gray-700'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {leaderboard.map((entry, index) => (
          <div
            key={index}
            className={`flex justify-between items-center p-2 rounded ${
              index === 0 ? 'bg-yellow-500 bg-opacity-20' : 'hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-6 text-center font-medium">
                {getMedalIcon(index) || `${index + 1}.`}
              </span>
              <span className="font-medium">{entry.username}</span>
            </div>
            <span className="text-yellow-500 font-bold">{entry.score.toLocaleString()}</span>
          </div>
        ))}
        {leaderboard.length === 0 && (
          <div className="text-center text-gray-400 py-4">
            No scores recorded for this time period
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;