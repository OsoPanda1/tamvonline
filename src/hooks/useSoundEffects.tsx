 import { useCallback, useRef } from 'react';
 
 // Audio context for web audio API
 let audioContext: AudioContext | null = null;
 
 // Simple oscillator-based sound effects (no external files needed)
 const createOscillator = (ctx: AudioContext, frequency: number, duration: number, type: OscillatorType = 'sine') => {
   const oscillator = ctx.createOscillator();
   const gainNode = ctx.createGain();
   
   oscillator.connect(gainNode);
   gainNode.connect(ctx.destination);
   
   oscillator.type = type;
   oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
   
   gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
   gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
   
   oscillator.start(ctx.currentTime);
   oscillator.stop(ctx.currentTime + duration);
 };
 
 export const useSoundEffects = () => {
   const enabledRef = useRef(true);
 
   const getContext = useCallback(() => {
     if (!audioContext) {
       audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
     }
     return audioContext;
   }, []);
 
   const playClick = useCallback(() => {
     if (!enabledRef.current) return;
     try {
       const ctx = getContext();
       createOscillator(ctx, 800, 0.05, 'square');
     } catch (e) {
       console.log('Audio not supported');
     }
   }, [getContext]);
 
   const playHover = useCallback(() => {
     if (!enabledRef.current) return;
     try {
       const ctx = getContext();
       createOscillator(ctx, 1200, 0.03, 'sine');
     } catch (e) {
       console.log('Audio not supported');
     }
   }, [getContext]);
 
   const playSuccess = useCallback(() => {
     if (!enabledRef.current) return;
     try {
       const ctx = getContext();
       createOscillator(ctx, 523, 0.1, 'sine'); // C5
       setTimeout(() => createOscillator(ctx, 659, 0.1, 'sine'), 100); // E5
       setTimeout(() => createOscillator(ctx, 784, 0.15, 'sine'), 200); // G5
     } catch (e) {
       console.log('Audio not supported');
     }
   }, [getContext]);
 
   const playError = useCallback(() => {
     if (!enabledRef.current) return;
     try {
       const ctx = getContext();
       createOscillator(ctx, 200, 0.2, 'sawtooth');
     } catch (e) {
       console.log('Audio not supported');
     }
   }, [getContext]);
 
   const playNotification = useCallback(() => {
     if (!enabledRef.current) return;
     try {
       const ctx = getContext();
       createOscillator(ctx, 880, 0.08, 'sine');
       setTimeout(() => createOscillator(ctx, 1100, 0.08, 'sine'), 80);
     } catch (e) {
       console.log('Audio not supported');
     }
   }, [getContext]);
 
   const playTransaction = useCallback(() => {
     if (!enabledRef.current) return;
     try {
       const ctx = getContext();
       // "Coin" sound
       createOscillator(ctx, 1500, 0.05, 'sine');
       setTimeout(() => createOscillator(ctx, 2000, 0.05, 'sine'), 50);
       setTimeout(() => createOscillator(ctx, 2500, 0.08, 'sine'), 100);
     } catch (e) {
       console.log('Audio not supported');
     }
   }, [getContext]);
 
   const setEnabled = useCallback((enabled: boolean) => {
     enabledRef.current = enabled;
   }, []);
 
   return {
     playClick,
     playHover,
     playSuccess,
     playError,
     playNotification,
     playTransaction,
     setEnabled,
   };
 };