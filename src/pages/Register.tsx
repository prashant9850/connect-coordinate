import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Users,
  Building2,
  Check
} from 'lucide-react';
import type { VolunteerSkill } from '@/types';

type UserType = 'volunteer' | 'ngo';

const skills: { value: VolunteerSkill; label: string }[] = [
  { value: 'medical', label: 'Medical' },
  { value: 'rescue', label: 'Search & Rescue' },
  { value: 'first_aid', label: 'First Aid' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'transport', label: 'Transport' },
  { value: 'communication', label: 'Communication' },
  { value: 'shelter', label: 'Shelter Management' },
  { value: 'food_distribution', label: 'Food Distribution' },
];

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'ngo' ? 'ngo' : 'volunteer';
  
  const [userType, setUserType] = useState<UserType>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<VolunteerSkill[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const toggleSkill = (skill: VolunteerSkill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary">
              <AlertTriangle className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">DisasterConnect</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create your account</h1>
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {/* User type selection */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setUserType('volunteer')}
            className={cn(
              'p-6 rounded-xl border-2 transition-all text-left',
              userType === 'volunteer'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            )}
          >
            <div className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
              userType === 'volunteer' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            )}>
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Volunteer</h3>
            <p className="text-sm text-muted-foreground">
              Join relief efforts and help those in need
            </p>
            {userType === 'volunteer' && (
              <div className="mt-3 flex items-center gap-1 text-sm text-primary">
                <Check className="h-4 w-4" />
                Selected
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => setUserType('ngo')}
            className={cn(
              'p-6 rounded-xl border-2 transition-all text-left',
              userType === 'ngo'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            )}
          >
            <div className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
              userType === 'ngo' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            )}>
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">NGO / Organization</h3>
            <p className="text-sm text-muted-foreground">
              Coordinate disaster relief programs
            </p>
            {userType === 'ngo' && (
              <div className="mt-3 flex items-center gap-1 text-sm text-primary">
                <Check className="h-4 w-4" />
                Selected
              </div>
            )}
          </button>
        </div>

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Common fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {userType === 'volunteer' ? 'Full Name' : 'Organization Name'}
              </Label>
              <Input id="name" placeholder={userType === 'volunteer' ? 'John Doe' : 'Relief Foundation'} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="email@example.com" required />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">
                {userType === 'volunteer' ? 'Location' : 'Area of Operation'}
              </Label>
              <Input id="location" placeholder="City, State" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Volunteer specific fields */}
          {userType === 'volunteer' && (
            <div className="space-y-3">
              <Label>Skills (select all that apply)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {skills.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleSkill(value)}
                    className={cn(
                      'p-3 rounded-lg border text-sm font-medium transition-all',
                      selectedSkills.includes(value)
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* NGO specific fields */}
          {userType === 'ngo' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="description">Organization Description</Label>
                <textarea
                  id="description"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Briefly describe your organization's mission and activities..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manpower">Approximate Manpower Capacity</Label>
                <Input id="manpower" type="number" placeholder="e.g., 100" />
              </div>
            </>
          )}

          {/* Terms */}
          <div className="flex items-start gap-2">
            <Checkbox id="terms" required />
            <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
              I agree to the{' '}
              <Link to="#" className="text-primary hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>
              {userType === 'ngo' && (
                <>, and I confirm that my organization is legally registered and authorized to conduct relief operations.</>
              )}
            </label>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  );
}
