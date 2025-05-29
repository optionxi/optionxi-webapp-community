import { UserX, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { TraderProfile } from '@/datamodels/profile_model';
import { FirebaseProfile } from '@/lib/fireabaseRTD/firebase_profile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { ProfileEditForm } from './profile-edit-form';



export function NoProfileFound() {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [profile, setProfile] = useState<TraderProfile | null>(null);

  const handleProfileSave = async (data: Partial<TraderProfile>) => {
    try {
      if (!profile) {
        // Create new profile
        const newProfile = await FirebaseProfile.createProfile(data);
        setProfile(newProfile);
      } else {
        // Update existing profile
        await FirebaseProfile.updateProfile(profile.id, data);
        setProfile((prev) => (prev ? { ...prev, ...data } : null));
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4 text-center bg-background rounded-lg shadow-md">
      <UserX className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-500" />
      <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">No Profile Found</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        We couldn&apos;t find any profile information. Would you like to create a new profile?
      </p>
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogTrigger asChild>
          <Button className="inline-flex items-center">
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Profile
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{profile ? 'Edit Profile' : 'Create Profile'}</DialogTitle>
          </DialogHeader>
          <ProfileEditForm
            profile={profile}
            onSave={handleProfileSave}
            onClose={() => setEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
