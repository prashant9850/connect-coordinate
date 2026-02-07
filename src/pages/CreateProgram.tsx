import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { EmergencyModal } from '@/components/EmergencyModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, 
  MapPin, 
  AlertTriangle,
  Check
} from 'lucide-react';
import type { SeverityLevel, VolunteerSkill } from '@/types';

const severityOptions: { value: SeverityLevel; label: string; description: string; color: string }[] = [
  { value: 'red', label: 'Critical', description: 'Immediate, life-threatening situation', color: 'border-severity-red bg-severity-red-bg text-severity-red' },
  { value: 'orange', label: 'High', description: 'Urgent situation requiring rapid response', color: 'border-severity-orange bg-severity-orange-bg text-severity-orange' },
  { value: 'yellow', label: 'Moderate', description: 'Significant situation, response needed', color: 'border-severity-yellow bg-severity-yellow-bg text-severity-yellow' },
];

const disasterTypes = [
  'Hurricane',
  'Earthquake',
  'Flood',
  'Wildfire',
  'Tornado',
  'Tsunami',
  'Landslide',
  'Other',
];

const skills: { value: VolunteerSkill; label: string }[] = [
  { value: 'medical', label: 'Medical' },
  { value: 'rescue', label: 'Search & Rescue' },
  { value: 'first_aid', label: 'First Aid' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'transport', label: 'Transport' },
  { value: 'communication', label: 'Communication' },
  { value: 'shelter', label: 'Shelter' },
  { value: 'food_distribution', label: 'Food Distribution' },
];

export default function CreateProgram() {
  const navigate = useNavigate();
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: '' as SeverityLevel | '',
    disasterType: '',
    locationName: '',
    maxVolunteers: 50,
    requiredSkills: [] as VolunteerSkill[],
  });

  const toggleSkill = (skill: VolunteerSkill) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter(s => s !== skill)
        : [...prev.requiredSkills, skill]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard');
    }, 1500);
  };

  const isValid = formData.title && formData.severity && formData.disasterType && formData.locationName;

  return (
    <div className="min-h-screen bg-background">
      <Header onEmergencyClick={() => setEmergencyModalOpen(true)} />

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Back button */}
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">Create Relief Program</h1>
            <p className="text-muted-foreground">
              Start a new disaster relief program to coordinate volunteers and resources.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Program Title</Label>
                <Input 
                  id="title"
                  placeholder="e.g., Hurricane Relief Operation - Miami"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Describe the situation, immediate needs, and objectives..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            {/* Severity selection */}
            <div className="space-y-3">
              <Label>Severity Level</Label>
              <div className="grid gap-3">
                {severityOptions.map(({ value, label, description, color }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData({ ...formData, severity: value })}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left',
                      formData.severity === value 
                        ? color
                        : 'border-border hover:border-muted-foreground/30'
                    )}
                  >
                    <div className={cn(
                      'w-4 h-4 rounded-full',
                      value === 'red' && 'bg-severity-red',
                      value === 'orange' && 'bg-severity-orange',
                      value === 'yellow' && 'bg-severity-yellow',
                    )} />
                    <div className="flex-1">
                      <p className="font-medium">{label}</p>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                    {formData.severity === value && (
                      <Check className="h-5 w-5" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Disaster type */}
            <div className="space-y-3">
              <Label>Disaster Type</Label>
              <div className="flex flex-wrap gap-2">
                {disasterTypes.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, disasterType: type })}
                    className={cn(
                      'px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                      formData.disasterType === type
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="location"
                    className="pl-9"
                    placeholder="City, State or select on map"
                    value={formData.locationName}
                    onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Map placeholder */}
              <div className="h-[200px] rounded-lg bg-muted/50 border border-dashed border-border flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Map selection would appear here</p>
                  <p className="text-xs">Click to select disaster area</p>
                </div>
              </div>
            </div>

            {/* Max volunteers */}
            <div className="space-y-2">
              <Label htmlFor="maxVolunteers">Maximum Volunteers</Label>
              <Input 
                id="maxVolunteers"
                type="number"
                min={1}
                value={formData.maxVolunteers}
                onChange={(e) => setFormData({ ...formData, maxVolunteers: parseInt(e.target.value) || 50 })}
              />
            </div>

            {/* Required skills */}
            <div className="space-y-3">
              <Label>Required Skills (select all that apply)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {skills.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleSkill(value)}
                    className={cn(
                      'p-3 rounded-lg border text-sm font-medium transition-all',
                      formData.requiredSkills.includes(value)
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" className="flex-1" asChild>
                <Link to="/dashboard">Cancel</Link>
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? (
                  'Creating Program...'
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Create Program
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <EmergencyModal 
        open={emergencyModalOpen} 
        onOpenChange={setEmergencyModalOpen}
      />
    </div>
  );
}
