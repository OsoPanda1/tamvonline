 import { useState, useEffect, useCallback } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 import { useAuth } from './useAuth';
 import { useSoundEffects } from './useSoundEffects';
 import { toast } from 'sonner';
 
 export type NotificationType = 
   | 'like' | 'superlike' | 'comment' | 'follow' 
   | 'mention' | 'transaction' | 'achievement' 
   | 'dreamspace' | 'live' | 'system' | 'isabella';
 
 export type NotificationUrgency = 'low' | 'normal' | 'high' | 'critical';
 
 export interface Notification {
   id: string;
   user_id: string;
   type: NotificationType;
   urgency: NotificationUrgency;
   title: string;
   body: string | null;
   image_url: string | null;
   actor_id: string | null;
   target_type: string | null;
   target_id: string | null;
   is_read: boolean;
   read_at: string | null;
   sound_id: string;
   show_toast: boolean;
   metadata: Record<string, unknown>;
   created_at: string;
 }
 
 export interface NotificationPreferences {
   id: string;
   user_id: string;
   like_enabled: boolean;
   superlike_enabled: boolean;
   comment_enabled: boolean;
   follow_enabled: boolean;
   mention_enabled: boolean;
   transaction_enabled: boolean;
   achievement_enabled: boolean;
   dreamspace_enabled: boolean;
   live_enabled: boolean;
   system_enabled: boolean;
   isabella_enabled: boolean;
   sound_enabled: boolean;
   sound_volume: number;
   do_not_disturb: boolean;
   dnd_start: string | null;
   dnd_end: string | null;
 }
 
 const NOTIFICATION_ICONS: Record<NotificationType, string> = {
   like: '❤️',
   superlike: '⚡',
   comment: '💬',
   follow: '👤',
   mention: '@',
   transaction: '💰',
   achievement: '🏆',
   dreamspace: '🌌',
   live: '🔴',
   system: '🔔',
   isabella: '🤖',
 };
 
 export const useNotifications = () => {
   const { user } = useAuth();
   const { playClick, playSuccess, playTransaction } = useSoundEffects();
   const [notifications, setNotifications] = useState<Notification[]>([]);
   const [unreadCount, setUnreadCount] = useState(0);
   const [loading, setLoading] = useState(true);
   const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
 
   // Fetch notifications
   const fetchNotifications = useCallback(async () => {
     if (!user) return;
     
     try {
       const { data, error } = await supabase
         .from('notifications')
         .select('*')
         .eq('user_id', user.id)
         .order('created_at', { ascending: false })
         .limit(50);
 
       if (error) throw error;
       
       // Type cast since we know the shape
       const typedData = (data || []) as unknown as Notification[];
       setNotifications(typedData);
       setUnreadCount(typedData.filter(n => !n.is_read).length);
     } catch (err) {
       console.error('Error fetching notifications:', err);
     } finally {
       setLoading(false);
     }
   }, [user]);
 
   // Fetch preferences
   const fetchPreferences = useCallback(async () => {
     if (!user) return;
 
     const { data, error } = await supabase
       .from('notification_preferences')
       .select('*')
       .eq('user_id', user.id)
       .single();
 
     if (!error && data) {
       setPreferences(data as unknown as NotificationPreferences);
     }
   }, [user]);
 
   // Initial fetch
   useEffect(() => {
     fetchNotifications();
     fetchPreferences();
   }, [fetchNotifications, fetchPreferences]);
 
   // Realtime subscription
   useEffect(() => {
     if (!user) return;
 
     const channel = supabase
       .channel('notifications-realtime')
       .on(
         'postgres_changes',
         { 
           event: 'INSERT', 
           schema: 'public', 
           table: 'notifications',
           filter: `user_id=eq.${user.id}`
         },
         (payload) => {
           const newNotification = payload.new as unknown as Notification;
           
           // Add to state
           setNotifications(prev => [newNotification, ...prev]);
           setUnreadCount(prev => prev + 1);
 
           // Play sound based on urgency
           if (preferences?.sound_enabled !== false) {
             switch (newNotification.urgency) {
               case 'critical':
               case 'high':
                 playTransaction();
                 break;
               case 'normal':
                 playSuccess();
                 break;
               default:
                 playClick();
             }
           }
 
           // Show toast
           if (newNotification.show_toast) {
             const icon = NOTIFICATION_ICONS[newNotification.type] || '🔔';
             toast(`${icon} ${newNotification.title}`, {
               description: newNotification.body || undefined,
               duration: newNotification.urgency === 'critical' ? 10000 : 5000,
             });
           }
         }
       )
       .subscribe();
 
     return () => {
       supabase.removeChannel(channel);
     };
   }, [user, preferences, playClick, playSuccess, playTransaction]);
 
   // Mark as read
   const markAsRead = async (notificationId: string) => {
     const { error } = await supabase
       .from('notifications')
       .update({ is_read: true, read_at: new Date().toISOString() })
       .eq('id', notificationId);
 
     if (!error) {
       setNotifications(prev => 
         prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
       );
       setUnreadCount(prev => Math.max(0, prev - 1));
     }
   };
 
   // Mark all as read
   const markAllAsRead = async () => {
     if (!user) return;
 
     const { error } = await supabase
       .from('notifications')
       .update({ is_read: true, read_at: new Date().toISOString() })
       .eq('user_id', user.id)
       .eq('is_read', false);
 
     if (!error) {
       setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
       setUnreadCount(0);
     }
   };
 
   // Update preferences
   const updatePreferences = async (updates: Partial<NotificationPreferences>) => {
     if (!user) return;
 
     const { error } = await supabase
       .from('notification_preferences')
       .upsert({
         user_id: user.id,
         ...preferences,
         ...updates,
       });
 
     if (!error) {
       setPreferences(prev => prev ? { ...prev, ...updates } : null);
     }
   };
 
   return {
     notifications,
     unreadCount,
     loading,
     preferences,
     markAsRead,
     markAllAsRead,
     updatePreferences,
     refetch: fetchNotifications,
   };
 };