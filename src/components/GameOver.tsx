import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { supabase } from '../lib/supabase';
import { Trophy, Clock, Save, RotateCcw } from 'lucide-react';

const GameOver: React.FC = () => {
  const { score, getFinalScore, resetGame, startTime } = useGameStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const timeAlive = Math.floor((Date.now() - startTime) / 1000);
  const timeBonus = timeAlive * 10;
  const finalScore = getFinalScore();

  const handleSaveScore = async () => {
    setIsSaving(true);
    try {
      await supabase.from('leaderboard').insert([
        {
          username: 'god_37',
          score: finalScore,
          created_by: 'Bolt'
        }
      ]);
      setSaved(true);
    } catch (error) {
      console.error('Error saving score:', error);
    }
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg text-white text-center max-w-md w-full mx-4">
        <h2 className="text-4xl font-bold mb-6">Game Over</h2>
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between gap-4 bg-gray-700 p-3 rounded">
            <span className="flex items-center gap-2">
              <Trophy className="text-yellow-500" />
              Kill Score:
            </span>
            <span className="text-xl font-bold">{score}</span>
          </div>
          <div className="flex items-center justify-between gap-4 bg-gray-700 p-3 rounded">
            <span className="flex items-center gap-2">
              <Clock className="text-blue-500" />
              Time Bonus:
            </span>
            <span className="text-xl font-bold text-blue-400">+{timeBonus}</span>
          </div>
          <div className="border-t border-gray-600 pt-4 mt-4">
            <div className="flex items-center justify-between gap-4 text-2xl font-bold">
              <span>Final Score:</span>
              <span className="text-yellow-400">{finalScore.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {!saved ? (
            <button
              onClick={handleSaveScore}
              disabled={isSaving}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-800 px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving...' : 'Save Score'}
            </button>
          ) : (
            <div className="text-green-400 mb-4">Score saved successfully!</div>
          )}
          <button
            onClick={resetGame}
            className="w-full bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;