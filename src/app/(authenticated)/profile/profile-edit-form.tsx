import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TraderProfile } from "@/datamodels/profile_model";
import { useState } from "react";
interface ProfileEditFormProps {
    profile: TraderProfile| null;
    onSave: (data: Partial<TraderProfile>) => Promise<void>;
    onClose: () => void;
  }
  
  export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ profile, onSave, onClose }) => {
    const [formData, setFormData] = useState({
      name: profile?.name || '',
      location: profile?.location || '',
      bio: profile?.bio || '',
      role: profile?.role || '',
      experience: profile?.experience || '',
      specialties: profile?.specialties || [],
      social: {
        twitter: profile?.social?.twitter || '',
        linkedin: profile?.social?.linkedin || '',
      }
    });
  
    const handleSpecialtyAdd = (specialty: string) => {
      if (specialty && !formData.specialties.includes(specialty)) {
        setFormData(prev => ({
          ...prev,
          specialties: [...prev.specialties, specialty]
        }));
      }
    };
  
    return (
      <form onSubmit={async (e) => {
        e.preventDefault();
        await onSave(formData);
        onClose();
      }} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div>
            <Label>Role</Label>
            <Input
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            />
          </div>
  
          <div>
            <Label>Location</Label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
  
          <div>
            <Label>Bio</Label>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="h-24"
            />
          </div>
  
          <div>
            <Label>Trading Experience (years)</Label>
            <Input
              type="number"
              value={formData.experience}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
            />
          </div>
  
          <div className="space-y-2">
            <Label>Specialties</Label>
            <div className="flex gap-2 flex-wrap">
              {formData.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary">
                  {specialty}
                  <button
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      specialties: prev.specialties.filter((_, i) => i !== index)
                    }))}
                    className="ml-2"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Add specialty"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSpecialtyAdd((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
          </div>
  
          <div>
            <Label>Social Links</Label>
            <div className="space-y-2">
              <Input
                placeholder="Twitter URL"
                value={formData.social.twitter}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  social: { ...prev.social, twitter: e.target.value }
                }))}
              />
              <Input
                placeholder="LinkedIn URL"
                value={formData.social.linkedin}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  social: { ...prev.social, linkedin: e.target.value }
                }))}
              />
            </div>
          </div>
        </div>
  
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    );
  };
  