import { TraderProfile, TradingPost } from "@/datamodels/profile_model";
import { app, db } from "@/utils/firebaseConfig";
import { get, off, onValue, push, ref, set, update } from "@firebase/database";
import { getAuth } from "firebase/auth";
import { toast } from "@/components/ui/use-toast";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const FirebaseProfile = {
  // Create a new profile
  async createProfile(data: Partial<TraderProfile>): Promise<TraderProfile> {
    const auth = getAuth(app);
    const user = auth.currentUser;

    const suid = user?.uid;
    const photourl = user?.photoURL;
    const displayname = user?.displayName;

    const newProfile: TraderProfile = {
      id: suid ?? "",
      name: displayname ?? "",
      location: "",
      email: user?.email ?? "",
      bio: "",
      photoURL: photourl ?? "",
      role: "user",
      rating: 0,
      experience: "0",
      specialties: [],
      social: {
        twitter: "",
        linkedin: "",
      },
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      ...data,
    };

    try {
      // Start Firebase transaction
      await set(ref(db, `traders/${suid}`), newProfile);

      // Start Supabase transaction
      const { error } = await supabase.from("traders").upsert([newProfile]);

      if (error) {
        // Rollback Firebase
        await set(ref(db, `traders/${suid}`), null);
        throw error;
      }

      toast({
        title: "Hi " + user?.displayName,
        description: "Welcome to OptionXi, Update your profile to get started",
      });

      return newProfile;
    } catch (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
  },

  // Get profile
  async getProfile(userId: string): Promise<TraderProfile | null> {
    try {
      const snapshot = await get(ref(db, `traders/${userId}`));
      if (snapshot.exists()) {
        return { id: userId, ...snapshot.val() };
      } else {
        const auth = getAuth(app);
        const user = auth.currentUser;

        await this.createProfile({
          role: "user",
        });

        const defaultProfile: TraderProfile = {
          name: user?.displayName ?? "",
          email: user?.email ?? "",
          photoURL: user?.photoURL ?? "",
          id: userId,
          location: "",
          bio: "",
          role: "user",
          rating: 0,
          experience: "0",
          specialties: [],
          social: {
            twitter: "",
            linkedin: "",
          },
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
        };

        return defaultProfile;
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  // Update profile
  async updateProfile(userId: string, data: Partial<TraderProfile>): Promise<void> {
    try {
      const auth = getAuth(app);
      const user = auth.currentUser;
      const photourl = user?.photoURL;
      data.photoURL = photourl ?? "";

      // Start Firebase transaction
      await update(ref(db, `traders/${userId}`), data);

      // Start Supabase transaction
      const { error } = await supabase
        .from("traders")
        .update(data)
        .eq("id", userId);

      if (error) {
        // Rollback Firebase
        const snapshot = await get(ref(db, `traders/${userId}`));
        await set(ref(db, `traders/${userId}`), snapshot.val());
        throw error;
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // Delete post
  async deletePost(userId: string, postId: string): Promise<void> {
    try {
      // Start Firebase transaction
      await set(ref(db, `tradingposts/${userId}/${postId}`), null);

      // Start Supabase transaction
      const { error } = await supabase
        .from("tradingposts")
        .delete()
        .eq("id", postId);

      if (error) {
        // Rollback Firebase
        const snapshot = await get(ref(db, `tradingposts/${userId}/${postId}`));
        await set(ref(db, `tradingposts/${userId}/${postId}`), snapshot.val());
        throw error;
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  },

  // Subscribe to posts
  subscribeToPosts(userId: string, callback: (posts: TradingPost[]) => void) {
    const postsRef = ref(db, `tradingposts/${userId}`);
    onValue(postsRef, (snapshot) => {
      const posts: TradingPost[] = [];
      snapshot.forEach((childSnapshot) => {
        posts.push({
          id: childSnapshot.key!,
          ...childSnapshot.val(),
        });
      });
      callback(posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    });

    return () => off(postsRef);
  },

  // Subscribe to posts using Supabase Realtime
  subscribeToPostsSupabase(userId: string, callback: (posts: TradingPost[]) => void) {
    // Fetch initial posts
    const fetchInitialPosts = async () => {
      const { data, error } = await supabase
        .from("tradingposts")
        .select("*")
        .eq("user_id", userId)
        .order("createdAt", { ascending: false });

      if (error) {
        console.error("Error fetching initial posts:", error);
        return;
      }

      callback(data || []);
    };

    // Set up realtime listener
    const subscription = supabase
      .channel("tradingposts")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen for all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "tradingposts",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          // Fetch updated posts whenever there's a change
          fetchInitialPosts();
        }
      )
      .subscribe();

    // Fetch initial posts when the listener is set up
    fetchInitialPosts();

    // Return a cleanup function to unsubscribe
    return () => {
      supabase.removeChannel(subscription);
    };
  },

  // Create post
  async createPost(userId: string, post: Omit<TradingPost, "id">): Promise<string> {
    try {
      // Start Firebase transaction
      const newPostRef = push(ref(db, `tradingposts/${userId}`));
      await set(newPostRef, post);

      // Start Supabase transaction
      const { error } = await supabase
        .from("tradingposts")
        .insert([{ ...post, id: newPostRef.key }]);

      if (error) {
        // Rollback Firebase
        await set(newPostRef, null);
        throw error;
      }

      return newPostRef.key!;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },
};