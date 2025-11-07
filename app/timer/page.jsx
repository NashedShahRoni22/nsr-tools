"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, Clock, Timer, Flag } from 'lucide-react';

export default function TimerStopwatch() {
  const [mode, setMode] = useState('stopwatch');
  
  // Stopwatch states
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  
  // Timer states
  const [timerHours, setTimerHours] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerTime, setTimerTime] = useState(300000); // 5 minutes in ms
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerInitialTime, setTimerInitialTime] = useState(300000);
  
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Stopwatch effect
  useEffect(() => {
    if (stopwatchRunning) {
      intervalRef.current = setInterval(() => {
        setStopwatchTime(prev => prev + 10);
      }, 10);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [stopwatchRunning]);

  // Timer effect
  useEffect(() => {
    if (timerRunning && timerTime > 0) {
      intervalRef.current = setInterval(() => {
        setTimerTime(prev => {
          if (prev <= 10) {
            setTimerRunning(false);
            playSound();
            return 0;
          }
          return prev - 10;
        });
      }, 10);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning, timerTime]);

  const playSound = () => {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    
    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
      milliseconds: String(milliseconds).padStart(2, '0')
    };
  };

  // Stopwatch functions
  const toggleStopwatch = () => setStopwatchRunning(!stopwatchRunning);
  
  const resetStopwatch = () => {
    setStopwatchRunning(false);
    setStopwatchTime(0);
    setLaps([]);
  };
  
  const addLap = () => {
    if (stopwatchTime > 0) {
      setLaps([{ time: stopwatchTime, lap: laps.length + 1 }, ...laps]);
    }
  };

  // Timer functions
  const toggleTimer = () => {
    if (!timerRunning && timerTime === 0) {
      const totalMs = (timerHours * 3600 + timerMinutes * 60 + timerSeconds) * 1000;
      setTimerTime(totalMs);
      setTimerInitialTime(totalMs);
    }
    setTimerRunning(!timerRunning);
  };
  
  const resetTimer = () => {
    setTimerRunning(false);
    const totalMs = (timerHours * 3600 + timerMinutes * 60 + timerSeconds) * 1000;
    setTimerTime(totalMs);
    setTimerInitialTime(totalMs);
  };

  const adjustTime = (type, amount) => {
    if (timerRunning) return;
    
    if (type === 'hours') {
      const newHours = Math.max(0, Math.min(23, timerHours + amount));
      setTimerHours(newHours);
      updateTimerTime(newHours, timerMinutes, timerSeconds);
    } else if (type === 'minutes') {
      const newMinutes = Math.max(0, Math.min(59, timerMinutes + amount));
      setTimerMinutes(newMinutes);
      updateTimerTime(timerHours, newMinutes, timerSeconds);
    } else if (type === 'seconds') {
      const newSeconds = Math.max(0, Math.min(59, timerSeconds + amount));
      setTimerSeconds(newSeconds);
      updateTimerTime(timerHours, timerMinutes, newSeconds);
    }
  };

  const updateTimerTime = (h, m, s) => {
    const totalMs = (h * 3600 + m * 60 + s) * 1000;
    setTimerTime(totalMs);
    setTimerInitialTime(totalMs);
  };

  const stopwatchFormatted = formatTime(stopwatchTime);
  const timerFormatted = formatTime(timerTime);
  const timerProgress = timerInitialTime > 0 ? ((timerInitialTime - timerTime) / timerInitialTime) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">⏱️ Timer & Stopwatch</h1>
          <p className="text-gray-600">Track your time with precision</p>
        </div>

        {/* Mode Switcher */}
        <div className="flex gap-3 mb-8 max-w-md mx-auto">
          <button
            onClick={() => setMode('stopwatch')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              mode === 'stopwatch'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300'
            }`}
          >
            <Clock size={20} />
            Stopwatch
          </button>
          <button
            onClick={() => setMode('timer')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              mode === 'timer'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300'
            }`}
          >
            <Timer size={20} />
            Timer
          </button>
        </div>

        {/* Stopwatch Mode */}
        {mode === 'stopwatch' && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              {/* Display */}
              <div className="text-center mb-8">
                <div className="text-7xl font-bold text-gray-800 mb-2 font-mono">
                  {stopwatchFormatted.hours}:{stopwatchFormatted.minutes}:{stopwatchFormatted.seconds}
                </div>
                <div className="text-3xl text-gray-500 font-mono">
                  .{stopwatchFormatted.milliseconds}
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={toggleStopwatch}
                  className={`w-20 h-20 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center ${
                    stopwatchRunning
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {stopwatchRunning ? <Pause size={32} /> : <Play size={32} />}
                </button>
                
                <button
                  onClick={resetStopwatch}
                  className="w-20 h-20 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <RotateCcw size={32} />
                </button>

                <button
                  onClick={addLap}
                  disabled={stopwatchTime === 0}
                  className="w-20 h-20 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Flag size={32} />
                </button>
              </div>
            </div>

            {/* Laps */}
            {laps.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <Flag size={24} className="text-blue-600" />
                  Laps ({laps.length})
                </h2>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {laps.map((lap, index) => {
                    const lapFormatted = formatTime(lap.time);
                    const prevLapTime = index < laps.length - 1 ? laps[index + 1].time : 0;
                    const lapDiff = lap.time - prevLapTime;
                    const diffFormatted = formatTime(lapDiff);
                    
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                            {lap.lap}
                          </div>
                          <div>
                            <div className="font-mono text-lg font-semibold text-gray-800">
                              {lapFormatted.hours}:{lapFormatted.minutes}:{lapFormatted.seconds}.{lapFormatted.milliseconds}
                            </div>
                            <div className="text-sm text-gray-600">
                              +{diffFormatted.minutes}:{diffFormatted.seconds}.{diffFormatted.milliseconds}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timer Mode */}
        {mode === 'timer' && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              {/* Display */}
              <div className="text-center mb-8">
                <div className="text-7xl font-bold text-gray-800 mb-4 font-mono">
                  {timerFormatted.hours}:{timerFormatted.minutes}:{timerFormatted.seconds}
                </div>
                
                {/* Progress Circle */}
                {timerRunning && (
                  <div className="relative w-48 h-48 mx-auto mb-6">
                    <svg className="transform -rotate-90 w-48 h-48">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="#9333ea"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 88}`}
                        strokeDashoffset={`${2 * Math.PI * 88 * (1 - timerProgress / 100)}`}
                        className="transition-all duration-100"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round(timerProgress)}%
                      </div>
                    </div>
                  </div>
                )}

                {/* Time Adjusters */}
                {!timerRunning && (
                  <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto mb-6">
                    {[
                      { label: 'Hours', value: timerHours, type: 'hours' },
                      { label: 'Minutes', value: timerMinutes, type: 'minutes' },
                      { label: 'Seconds', value: timerSeconds, type: 'seconds' }
                    ].map((item) => (
                      <div key={item.type} className="text-center">
                        <div className="text-sm text-gray-600 mb-2 font-semibold">{item.label}</div>
                        <button
                          onClick={() => adjustTime(item.type, 1)}
                          className="w-full py-2 bg-purple-100 hover:bg-purple-200 rounded-t-lg transition-colors"
                        >
                          <Plus size={20} className="mx-auto text-purple-600" />
                        </button>
                        <div className="py-3 bg-gray-50 text-2xl font-bold text-gray-800 border-x border-gray-200">
                          {String(item.value).padStart(2, '0')}
                        </div>
                        <button
                          onClick={() => adjustTime(item.type, -1)}
                          className="w-full py-2 bg-purple-100 hover:bg-purple-200 rounded-b-lg transition-colors"
                        >
                          <Minus size={20} className="mx-auto text-purple-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={toggleTimer}
                  disabled={timerTime === 0 && !timerRunning}
                  className={`w-20 h-20 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                    timerRunning
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {timerRunning ? <Pause size={32} /> : <Play size={32} />}
                </button>
                
                <button
                  onClick={resetTimer}
                  className="w-20 h-20 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <RotateCcw size={32} />
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Presets</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: '1 min', h: 0, m: 1, s: 0 },
                  { label: '5 min', h: 0, m: 5, s: 0 },
                  { label: '10 min', h: 0, m: 10, s: 0 },
                  { label: '15 min', h: 0, m: 15, s: 0 },
                  { label: '30 min', h: 0, m: 30, s: 0 },
                  { label: '45 min', h: 0, m: 45, s: 0 },
                  { label: '1 hour', h: 1, m: 0, s: 0 },
                  { label: '2 hours', h: 2, m: 0, s: 0 }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      if (!timerRunning) {
                        setTimerHours(preset.h);
                        setTimerMinutes(preset.m);
                        setTimerSeconds(preset.s);
                        updateTimerTime(preset.h, preset.m, preset.s);
                      }
                    }}
                    disabled={timerRunning}
                    className="py-3 px-4 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}