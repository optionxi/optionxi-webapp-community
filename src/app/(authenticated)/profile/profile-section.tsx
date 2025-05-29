'use client'

import React, { useEffect, useState } from 'react';
import {  Award, Edit2, MapPin, MoreVertical, Send, Share2, TrendingUp } from 'lucide-react';
import { Card, CardContent} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FirebaseProfile } from '@/lib/fireabaseRTD/firebase_profile';
import { TraderProfile, TradingPost } from '@/datamodels/profile_model';
import { NoProfileFound } from './no-profile-found';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ProfileEditForm } from './profile-edit-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoadingTraderProfile } from './profile-loading';

const TraderProfilePage: React.FC<{ userId: string }> = ({ userId }) => {
const [profile, setProfile] = useState<TraderProfile | null>(null);
const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [posts, setPosts] = useState<TradingPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await FirebaseProfile.getProfile(userId);
        setProfile(profileData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };

    const unsubscribe = FirebaseProfile.subscribeToPosts(userId,setPosts);
    fetchProfile();
    return () => unsubscribe();
  }, [userId]);

  if (loading) {
    return <LoadingTraderProfile />;
  }

  // if (!loading && !profile) {
  //   return <NoProfileFound />;
  // }

  if ( !profile) {
    return <NoProfileFound />;
  }

    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
        <div className="max-w-6xl mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Section */}
            <div className="md:col-span-1 space-y-6">
              <Card className="overflow-hidden">
                {/* <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20" /> */}
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600" />
                
                <CardContent className="-mt-16 relative">
                  <div className="flex justify-between items-start">
                    <Avatar className="h-24 w-24 ring-4 ring-background">
                      <AvatarImage src={profile.photoURL} />
                      <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                        </DialogHeader>
                        <ProfileEditForm 
                          profile={profile}
                          onSave={async (data) => {
                            await FirebaseProfile.updateProfile(userId, data);
                            setProfile(prev => prev ? { ...prev, ...data } : null);
                          }}
                          onClose={() => setEditDialogOpen(false)}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">{profile.name}</h2>
                      <Badge variant="outline">{profile.role}</Badge>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{profile.location}</span>
                    </div>
                    {profile.bio && (
                      <p className="text-sm text-muted-foreground mt-2">{profile.bio}</p>
                    )}
                  </div>
  
                  <Tabs defaultValue="stats" className="mt-6">
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="stats">Stats</TabsTrigger>
                      <TabsTrigger value="specialties">Specialties</TabsTrigger>
                    </TabsList>
                    <TabsContent value="stats" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="text-center p-4 bg-secondary/20 rounded-lg">
                          <TrendingUp className="h-5 w-5 mx-auto mb-2" />
                          <div className="text-2xl font-bold">{profile.rating}</div>
                          <div className="text-sm text-muted-foreground">Rating</div>
                        </div>
                        <div className="text-center p-4 bg-secondary/20 rounded-lg">
                          <Award className="h-5 w-5 mx-auto mb-2" />
                          <div className="text-2xl font-bold">{profile.experience}y</div>
                          <div className="text-sm text-muted-foreground">Experience</div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="specialties">
                      <ScrollArea className="h-[100px] mt-4">
                        <div className="flex flex-wrap gap-2">
                          {profile.specialties?.map((specialty, index) => (
                            <Badge key={index} variant="secondary">{specialty}</Badge>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
  
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex gap-2">
                      {profile.social?.twitter && (
                        <Button variant="outline" size="sm" className="flex-1">Twitter</Button>
                      )}
                      {profile.social?.linkedin && (
                        <Button variant="outline" size="sm" className="flex-1">LinkedIn</Button>
                      )}
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
  
            {/* Posts Section */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <Textarea
                    placeholder="Share your trading insights..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="mt-4 flex justify-end">
                    <Button onClick={async () => {
                      if (!profile || !newPost.trim()) return;
                      await FirebaseProfile.createPost(userId, {
                        content: newPost,
                        authorId: profile.id,
                        author: profile.name,
                        role: profile.role,
                        createdAt: new Date().toISOString(),
                        authorPhotoURL: profile.photoURL,
                      });
                      setNewPost('');
                    }}>
                      <Send className="h-4 w-4 mr-2" />
                      Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
  
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={post.authorPhotoURL} />
                          <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{post.author}</span>
                            <Badge variant="outline" className="text-xs">{post.role}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        {/* <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem>Report</DropdownMenuItem> */}
                        {post.authorId === profile.id && (
                        <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                            Delete
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Delete Post</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete this post? This action cannot be undone.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={async () => {
                                await FirebaseProfile.deletePost(userId, post.id);
                                }}
                                className="bg-destructive hover:bg-destructive/90"
                            >
                                Delete
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>
                        )}
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <p className="mt-4">{post.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default TraderProfilePage;