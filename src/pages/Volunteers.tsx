import { useState } from 'react';
import { Header } from '@/components/Header';
import { EmergencyModal } from '@/components/EmergencyModal';
import { VolunteerList } from '@/components/VolunteerList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Filter,
  UserPlus
} from 'lucide-react';
import { mockVolunteers } from '@/data/mockData';
import { Link } from 'react-router-dom';
import type { VolunteerSkill } from '@/types';

const skills: VolunteerSkill[] = [
  'medical',
  'rescue',
  'first_aid',
  'logistics',
  'transport',
  'communication',
  'shelter',
  'food_distribution',
];

export default function Volunteers() {
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState<VolunteerSkill | 'all'>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'available' | 'all'>('all');

  const filteredVolunteers = mockVolunteers.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = skillFilter === 'all' || v.skills.includes(skillFilter);
    const matchesAvailability = availabilityFilter === 'all' || v.availability === availabilityFilter;
    return matchesSearch && matchesSkill && matchesAvailability;
  });

  // Expand the mock data for display
  const expandedVolunteers = [...filteredVolunteers, ...filteredVolunteers.map(v => ({
    ...v,
    id: v.id + '-2',
    name: v.name.split(' ').reverse().join(' ')
  }))];

  return (
    <div className="min-h-screen bg-background">
      <Header onEmergencyClick={() => setEmergencyModalOpen(true)} />

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Volunteers</h1>
            <p className="text-muted-foreground">Browse registered volunteers and their skills</p>
          </div>
          <Button asChild>
            <Link to="/register">
              <UserPlus className="h-4 w-4 mr-2" />
              Become a Volunteer
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search volunteers..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Availability filter */}
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setAvailabilityFilter('all')}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors',
                  availabilityFilter === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )}
              >
                All
              </button>
              <button
                onClick={() => setAvailabilityFilter('available')}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors',
                  availabilityFilter === 'available'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )}
              >
                Available
              </button>
            </div>
          </div>

          {/* Skill filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSkillFilter('all')}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                skillFilter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              )}
            >
              All Skills
            </button>
            {skills.map(skill => (
              <button
                key={skill}
                onClick={() => setSkillFilter(skill)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors capitalize',
                  skillFilter === skill
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80'
                )}
              >
                {skill.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {expandedVolunteers.length} volunteer{expandedVolunteers.length !== 1 ? 's' : ''}
        </p>

        {/* Volunteers list */}
        <div className="bg-card border border-border rounded-xl p-4">
          <VolunteerList volunteers={expandedVolunteers} maxDisplay={20} />
        </div>
      </main>

      <EmergencyModal 
        open={emergencyModalOpen} 
        onOpenChange={setEmergencyModalOpen}
      />
    </div>
  );
}
