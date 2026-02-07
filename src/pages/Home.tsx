import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EmergencyButton } from '@/components/EmergencyButton';
import { EmergencyModal } from '@/components/EmergencyModal';
import { ProgramCard } from '@/components/ProgramCard';
import { DisasterMap } from '@/components/DisasterMap';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Users, 
  MapPin, 
  Clock, 
  ArrowRight,
  Building2,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { mockPrograms, mockVolunteers } from '@/data/mockData';

export default function Home() {
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const activePrograms = mockPrograms.filter(p => p.status === 'active');

  const stats = [
    { icon: Shield, value: '24/7', label: 'Emergency Response' },
    { icon: Users, value: '1,200+', label: 'Active Volunteers' },
    { icon: MapPin, value: '4', label: 'Active Programs' },
    { icon: Building2, value: '15', label: 'Partner NGOs' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M54%2028h-4v-4h-4v4h-4v4h4v4h4v-4h4v-4z%22%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%2F%3E%3C%2Fsvg%3E')] opacity-50" />
        
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/20 text-destructive-foreground text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                4 Active Emergency Programs
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 md:mb-6">
                Coordinating
                <span className="text-destructive"> Disaster Relief</span>
                <br />in Real-Time
              </h1>
              
              <p className="text-base md:text-lg text-primary-foreground/80 mb-6 md:mb-8 max-w-lg mx-auto lg:mx-0">
                Connecting verified NGOs, skilled volunteers, and those in need. 
                One platform for efficient, coordinated disaster response.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 md:mb-12">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/register">
                    <UserCheck className="mr-2 h-5 w-5" />
                    Join as Volunteer
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link to="/register?role=ngo">
                    <Building2 className="mr-2 h-5 w-5" />
                    Register NGO
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                      <Icon className="h-4 w-4 text-destructive" />
                      <span className="text-xl md:text-2xl font-bold">{value}</span>
                    </div>
                    <p className="text-xs md:text-sm text-primary-foreground/60">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Emergency Button */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-destructive/20 rounded-full blur-3xl scale-150" />
                <EmergencyButton 
                  size="hero" 
                  onClick={() => setEmergencyModalOpen(true)}
                />
              </div>
              <p className="mt-6 text-primary-foreground/60 text-center text-sm md:text-base">
                No registration required<br />
                One tap sends your location
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Live Disaster Map</h2>
              <p className="text-muted-foreground">Real-time view of active relief programs</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/dashboard">
                View Full Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <DisasterMap 
            programs={activePrograms}
            volunteers={mockVolunteers}
            className="h-[300px] md:h-[400px]"
          />
        </div>
      </section>

      {/* Active Programs */}
      <section className="py-8 md:py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Active Programs</h2>
              <p className="text-muted-foreground">Join ongoing relief efforts</p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/programs">
                View All Programs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {activePrograms.slice(0, 4).map(program => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">How DisasterConnect Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A coordinated approach to disaster relief, connecting those who need help with those who can provide it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Victims */}
            <div className="p-6 rounded-xl bg-card border border-border text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-7 w-7 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">For Those in Need</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Press the Emergency button - no registration needed. Your location is shared instantly with nearby responders.
              </p>
              <ul className="text-sm text-left space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  One-tap emergency alert
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  Automatic location sharing
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  Optional situation tags
                </li>
              </ul>
            </div>

            {/* Volunteers */}
            <div className="p-6 rounded-xl bg-card border border-border text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">For Volunteers</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Register your skills and join relief programs. See real-time maps and coordinate with other volunteers on-field.
              </p>
              <ul className="text-sm text-left space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  Skill-based matching
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  Live volunteer positions
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  Resource request system
                </li>
              </ul>
            </div>

            {/* NGOs */}
            <div className="p-6 rounded-xl bg-card border border-border text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-severity-orange/10 flex items-center justify-center">
                <Building2 className="h-7 w-7 text-severity-orange" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">For NGOs</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Verified organizations can create and manage relief programs, coordinate volunteers, and track resource allocation.
              </p>
              <ul className="text-sm text-left space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  Create relief programs
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  Real-time coordination
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  Resource management
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join thousands of volunteers and NGOs working together to provide faster, more coordinated disaster relief.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/programs">
                View Active Programs
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary">
                <AlertTriangle className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">DisasterConnect</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2024 DisasterConnect. Coordinating relief efforts worldwide.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link to="#" className="hover:text-foreground">About</Link>
              <Link to="#" className="hover:text-foreground">Contact</Link>
              <Link to="#" className="hover:text-foreground">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Emergency Modal */}
      <EmergencyModal 
        open={emergencyModalOpen} 
        onOpenChange={setEmergencyModalOpen}
      />
    </div>
  );
}
