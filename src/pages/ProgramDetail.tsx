import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { EmergencyButton } from '@/components/EmergencyButton';
import { EmergencyModal } from '@/components/EmergencyModal';
import { SeverityBadge } from '@/components/SeverityBadge';
import { VolunteerList } from '@/components/VolunteerList';
import { ResourceRequestCard } from '@/components/ResourceRequestCard';
import { DisasterMap } from '@/components/DisasterMap';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Label 
} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Building2,
  Users,
  UserPlus,
  Package,
  Check,
  AlertTriangle
} from 'lucide-react';
import { 
  getProgramById, 
  getVolunteersByProgram, 
  getResourceRequestsByProgram,
  mockVolunteers 
} from '@/data/mockData';
import type { ResourceType } from '@/types';

const resourceOptions: { value: ResourceType; label: string }[] = [
  { value: 'rope', label: 'Rope' },
  { value: 'torch', label: 'Torch/Flashlight' },
  { value: 'medical_kit', label: 'Medical Kit' },
  { value: 'stretcher', label: 'Stretcher' },
  { value: 'water', label: 'Water Supply' },
  { value: 'blanket', label: 'Blankets' },
  { value: 'tent', label: 'Tent' },
  { value: 'radio', label: 'Radio' },
];

export default function ProgramDetail() {
  const { id } = useParams();
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [joined, setJoined] = useState(false);
  const [resourceForm, setResourceForm] = useState({
    type: '' as ResourceType | '',
    quantity: 1,
    urgency: 'medium' as 'low' | 'medium' | 'high',
  });

  const program = getProgramById(id || '');
  const volunteers = getVolunteersByProgram(id || '');
  const resourceRequests = getResourceRequestsByProgram(id || '');

  if (!program) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Program not found</h1>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleJoinProgram = () => {
    setJoined(true);
  };

  const handleResourceRequest = () => {
    // In a real app, this would submit the request
    setResourceModalOpen(false);
    setResourceForm({ type: '', quantity: 1, urgency: 'medium' });
  };

  const handleProvideResource = (requestId: string) => {
    // In a real app, this would update the request status
    console.log('Providing resource:', requestId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onEmergencyClick={() => setEmergencyModalOpen(true)} />

      <main className="container mx-auto px-4 py-6">
        {/* Back button */}
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        {/* Program header */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <SeverityBadge severity={program.severity} />
                <span className="text-sm text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
                  {program.disasterType}
                </span>
                <span className="text-sm text-muted-foreground px-2 py-0.5 rounded-full bg-success/10 text-success">
                  {program.status}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{program.title}</h1>
              <p className="text-muted-foreground mb-4 max-w-2xl">{program.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {program.location.name}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  {program.ngoName}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Started {new Date(program.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:items-end">
              <EmergencyButton 
                size="large" 
                onClick={() => setEmergencyModalOpen(true)}
              />
              <p className="text-xs text-muted-foreground text-center">
                Emergency in<br />this area?
              </p>
            </div>
          </div>

          {/* Required skills */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm font-medium text-foreground mb-2">Required Skills</p>
            <div className="flex flex-wrap gap-2">
              {program.requiredSkills.map(skill => (
                <span 
                  key={skill}
                  className="text-sm px-3 py-1 rounded-full bg-secondary text-secondary-foreground capitalize"
                >
                  {skill.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column - Map and stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mini map */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h2 className="font-semibold text-foreground mb-4">Program Area</h2>
              <DisasterMap 
                programs={[program]}
                volunteers={mockVolunteers.filter(v => v.currentProgramId === program.id)}
                className="h-[250px]"
                showControls={false}
                interactive={false}
              />
            </div>

            {/* Volunteer progress */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">Volunteer Progress</h2>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{program.volunteerCount} / {program.maxVolunteers}</span>
                </div>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${(program.volunteerCount / program.maxVolunteers) * 100}%` }}
                />
              </div>
              
              {!joined ? (
                <Button className="w-full" onClick={handleJoinProgram}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join This Program
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-2 py-3 rounded-lg bg-success/10 text-success">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">You've joined this program</span>
                </div>
              )}
            </div>

            {/* Resource requests */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">Resource Requests</h2>
                <Button size="sm" onClick={() => setResourceModalOpen(true)} disabled={!joined}>
                  <Package className="h-4 w-4 mr-1" />
                  Request Resource
                </Button>
              </div>
              
              {resourceRequests.length > 0 ? (
                <div className="space-y-3">
                  {resourceRequests.map(request => (
                    <ResourceRequestCard 
                      key={request.id} 
                      request={request}
                      onProvide={handleProvideResource}
                      showProvideButton={joined}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-muted-foreground">No resource requests yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Right column - Volunteers */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">Active Volunteers</h2>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-success status-pulse" />
                  Live
                </div>
              </div>
              <VolunteerList volunteers={volunteers} maxDisplay={8} />
            </div>
          </div>
        </div>
      </main>

      {/* Emergency Modal */}
      <EmergencyModal 
        open={emergencyModalOpen} 
        onOpenChange={setEmergencyModalOpen}
      />

      {/* Resource Request Modal */}
      <Dialog open={resourceModalOpen} onOpenChange={setResourceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Resource</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Resource Type</Label>
              <Select 
                value={resourceForm.type} 
                onValueChange={(value) => setResourceForm({ ...resourceForm, type: value as ResourceType })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select resource type" />
                </SelectTrigger>
                <SelectContent>
                  {resourceOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input 
                type="number" 
                min={1}
                value={resourceForm.quantity}
                onChange={(e) => setResourceForm({ ...resourceForm, quantity: parseInt(e.target.value) || 1 })}
              />
            </div>

            <div className="space-y-2">
              <Label>Urgency</Label>
              <Select 
                value={resourceForm.urgency} 
                onValueChange={(value) => setResourceForm({ ...resourceForm, urgency: value as 'low' | 'medium' | 'high' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High - Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setResourceModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleResourceRequest}
              disabled={!resourceForm.type}
            >
              Submit Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
