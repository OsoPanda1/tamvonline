 import { useState, useEffect, useCallback } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 import { useAuth } from './useAuth';
 
 export interface Post {
   id: string;
   author_id: string;
   kind: string;
   content: string | null;
   media_urls: string[];
   visibility_mode: string;
   unlock_price_msr: number;
   likes_count: number;
   superlike_count: number;
   comments_count: number;
   shares_count: number;
   ethical_score: number;
   risk_score: number;
   is_censored: boolean;
   curation_status: string;
   created_at: string;
   updated_at: string;
   // Joined data
   author?: {
     display_name: string;
     avatar_url: string | null;
     trust_level: string;
   };
 }
 
 interface UsePostsOptions {
   pageSize?: number;
   authorId?: string;
 }
 
 export const usePosts = (options: UsePostsOptions = {}) => {
   const { pageSize = 10, authorId } = options;
   const { user } = useAuth();
   const [posts, setPosts] = useState<Post[]>([]);
   const [loading, setLoading] = useState(true);
   const [hasMore, setHasMore] = useState(true);
   const [page, setPage] = useState(0);
   const [error, setError] = useState<string | null>(null);
 
   const fetchPosts = useCallback(async (pageNum: number, append = false) => {
     try {
       setLoading(true);
       
       let query = supabase
         .from('posts')
         .select(`
           *,
           profiles!posts_author_id_fkey (
             display_name,
             avatar_url,
             trust_level
           )
         `)
         .order('created_at', { ascending: false })
         .range(pageNum * pageSize, (pageNum + 1) * pageSize - 1);
 
       if (authorId) {
         query = query.eq('author_id', authorId);
       }
 
       const { data, error: fetchError } = await query;
 
       if (fetchError) throw fetchError;
 
       const formattedPosts = (data || []).map((post: any) => ({
         ...post,
         author: post.profiles ? {
           display_name: post.profiles.display_name,
           avatar_url: post.profiles.avatar_url,
           trust_level: post.profiles.trust_level,
         } : undefined,
       }));
 
       if (append) {
         setPosts(prev => [...prev, ...formattedPosts]);
       } else {
         setPosts(formattedPosts);
       }
 
       setHasMore(formattedPosts.length === pageSize);
       setError(null);
     } catch (err) {
       setError(err instanceof Error ? err.message : 'Error loading posts');
       console.error('Error fetching posts:', err);
     } finally {
       setLoading(false);
     }
   }, [pageSize, authorId]);
 
   // Initial fetch
   useEffect(() => {
     fetchPosts(0);
   }, [fetchPosts]);
 
   // Realtime subscription
   useEffect(() => {
     const channel = supabase
       .channel('posts-realtime')
       .on(
         'postgres_changes',
         { event: '*', schema: 'public', table: 'posts' },
         () => {
           fetchPosts(0);
         }
       )
       .subscribe();
 
     return () => {
       supabase.removeChannel(channel);
     };
   }, [fetchPosts]);
 
   const loadMore = useCallback(() => {
     if (!loading && hasMore) {
       const nextPage = page + 1;
       setPage(nextPage);
       fetchPosts(nextPage, true);
     }
   }, [loading, hasMore, page, fetchPosts]);
 
   const createPost = async (postData: {
     kind: string;
     content?: string;
     media_urls?: string[];
     visibility_mode?: string;
   }) => {
     if (!user) throw new Error('Must be authenticated');
 
     const { data, error } = await supabase
       .from('posts')
       .insert([{
         author_id: user.id,
         kind: postData.kind,
         content: postData.content,
         media_urls: postData.media_urls || [],
         visibility_mode: postData.visibility_mode || 'PUBLIC_FREE',
       }])
       .select()
       .single();
 
     if (error) throw error;
     return data;
   };
 
   const likePost = async (postId: string) => {
     const post = posts.find(p => p.id === postId);
     if (post) {
       const { error } = await supabase
         .from('posts')
         .update({ likes_count: post.likes_count + 1 })
         .eq('id', postId);
       
       if (!error) {
         setPosts(prev => prev.map(p => 
           p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p
         ));
       }
     }
   };
 
   return {
     posts,
     loading,
     hasMore,
     error,
     loadMore,
     createPost,
     likePost,
     refetch: () => fetchPosts(0),
   };
 };