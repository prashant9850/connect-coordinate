import { 
  DisasterProgram, 
  Volunteer, 
  NGO, 
  ResourceRequest, 
  EmergencyRequest,
  CurrentUser 
} from '@/types';

// Mock NGOs
export const mockNGOs: NGO[] = [
  {
    id: 'ngo-1',
    name: 'Red Cross Relief Foundation',
    email: 'contact@redcross.org',
    description: 'International humanitarian organization providing emergency assistance, disaster relief, and disaster preparedness education.',
    areaOfOperation: ['California', 'Texas', 'Florida', 'New York'],
    manpowerCapacity: 500,
    verified: true,
    pastPrograms: 45,
    activePrograms: 3,
  },
  {
    id: 'ngo-2',
    name: 'Direct Relief International',
    email: 'help@directrelief.org',
    description: 'Humanitarian aid organization improving health and lives of people affected by poverty or emergencies.',
    areaOfOperation: ['California', 'Arizona', 'Nevada'],
    manpowerCapacity: 250,
    verified: true,
    pastPrograms: 28,
    activePrograms: 2,
  },
  {
    id: 'ngo-3',
    name: 'Team Rubicon',
    email: 'ops@teamrubicon.org',
    description: 'Disaster response organization uniting military veterans with first responders to deploy emergency response teams.',
    areaOfOperation: ['Nationwide'],
    manpowerCapacity: 1000,
    verified: true,
    pastPrograms: 120,
    activePrograms: 5,
  },
];

// Mock Disaster Programs
export const mockPrograms: DisasterProgram[] = [
  {
    id: 'prog-1',
    title: 'Hurricane Maria Relief',
    description: 'Emergency relief operation for Hurricane Maria survivors. Immediate need for medical personnel and rescue teams.',
    severity: 'red',
    disasterType: 'Hurricane',
    location: {
      lat: 28.5383,
      lng: -81.3792,
      name: 'Orlando, FL',
      radius: 25,
    },
    ngoId: 'ngo-1',
    ngoName: 'Red Cross Relief Foundation',
    requiredSkills: ['medical', 'rescue', 'first_aid', 'logistics'],
    volunteerCount: 47,
    maxVolunteers: 100,
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
  },
  {
    id: 'prog-2',
    title: 'Wildfire Evacuation Support',
    description: 'Supporting evacuation efforts and providing shelter for families displaced by wildfires.',
    severity: 'orange',
    disasterType: 'Wildfire',
    location: {
      lat: 34.0522,
      lng: -118.2437,
      name: 'Los Angeles, CA',
      radius: 40,
    },
    ngoId: 'ngo-2',
    ngoName: 'Direct Relief International',
    requiredSkills: ['transport', 'shelter', 'logistics', 'communication'],
    volunteerCount: 23,
    maxVolunteers: 50,
    status: 'active',
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'prog-3',
    title: 'Flood Recovery Program',
    description: 'Post-flood recovery assistance including food distribution and medical checkups.',
    severity: 'yellow',
    disasterType: 'Flood',
    location: {
      lat: 29.7604,
      lng: -95.3698,
      name: 'Houston, TX',
      radius: 30,
    },
    ngoId: 'ngo-3',
    ngoName: 'Team Rubicon',
    requiredSkills: ['food_distribution', 'medical', 'first_aid'],
    volunteerCount: 15,
    maxVolunteers: 40,
    status: 'active',
    createdAt: '2024-01-10T12:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
  },
  {
    id: 'prog-4',
    title: 'Earthquake Emergency Response',
    description: 'Critical search and rescue operations following 6.2 magnitude earthquake.',
    severity: 'red',
    disasterType: 'Earthquake',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      name: 'San Francisco, CA',
      radius: 20,
    },
    ngoId: 'ngo-3',
    ngoName: 'Team Rubicon',
    requiredSkills: ['rescue', 'medical', 'first_aid', 'communication'],
    volunteerCount: 62,
    maxVolunteers: 80,
    status: 'active',
    createdAt: '2024-01-15T06:00:00Z',
    updatedAt: '2024-01-15T15:00:00Z',
  },
];

// Mock Volunteers
export const mockVolunteers: Volunteer[] = [
  {
    id: 'vol-1',
    name: 'John Martinez',
    email: 'john.m@email.com',
    phone: '+1-555-0101',
    skills: ['medical', 'first_aid'],
    location: { lat: 28.54, lng: -81.38 },
    availability: 'available',
    currentProgramId: 'prog-1',
  },
  {
    id: 'vol-2',
    name: 'Sarah Chen',
    email: 'sarah.c@email.com',
    phone: '+1-555-0102',
    skills: ['rescue', 'logistics'],
    location: { lat: 28.53, lng: -81.37 },
    availability: 'busy',
    currentProgramId: 'prog-1',
  },
  {
    id: 'vol-3',
    name: 'Mike Johnson',
    email: 'mike.j@email.com',
    phone: '+1-555-0103',
    skills: ['transport', 'communication'],
    location: { lat: 34.05, lng: -118.24 },
    availability: 'available',
    currentProgramId: 'prog-2',
  },
  {
    id: 'vol-4',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    phone: '+1-555-0104',
    skills: ['shelter', 'food_distribution'],
    location: { lat: 29.76, lng: -95.37 },
    availability: 'available',
    currentProgramId: 'prog-3',
  },
  {
    id: 'vol-5',
    name: 'David Kim',
    email: 'david.k@email.com',
    phone: '+1-555-0105',
    skills: ['medical', 'rescue', 'first_aid'],
    location: { lat: 37.77, lng: -122.42 },
    availability: 'busy',
    currentProgramId: 'prog-4',
  },
];

// Mock Resource Requests
export const mockResourceRequests: ResourceRequest[] = [
  {
    id: 'res-1',
    programId: 'prog-1',
    requesterId: 'vol-1',
    requesterName: 'John Martinez',
    resourceType: 'medical_kit',
    quantity: 5,
    urgency: 'high',
    status: 'open',
    createdAt: '2024-01-15T14:00:00Z',
  },
  {
    id: 'res-2',
    programId: 'prog-1',
    requesterId: 'vol-2',
    requesterName: 'Sarah Chen',
    resourceType: 'rope',
    quantity: 10,
    urgency: 'medium',
    status: 'claimed',
    providerId: 'vol-3',
    providerName: 'Mike Johnson',
    createdAt: '2024-01-15T13:30:00Z',
  },
  {
    id: 'res-3',
    programId: 'prog-4',
    requesterId: 'vol-5',
    requesterName: 'David Kim',
    resourceType: 'stretcher',
    quantity: 3,
    urgency: 'high',
    status: 'open',
    createdAt: '2024-01-15T14:30:00Z',
  },
  {
    id: 'res-4',
    programId: 'prog-2',
    requesterId: 'vol-3',
    requesterName: 'Mike Johnson',
    resourceType: 'water',
    quantity: 50,
    urgency: 'medium',
    status: 'fulfilled',
    providerId: 'ngo-2',
    providerName: 'Direct Relief International',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'res-5',
    programId: 'prog-1',
    requesterId: 'vol-1',
    requesterName: 'John Martinez',
    resourceType: 'torch',
    quantity: 8,
    urgency: 'low',
    status: 'open',
    createdAt: '2024-01-15T12:00:00Z',
  },
];

// Mock Emergency Requests
export const mockEmergencyRequests: EmergencyRequest[] = [
  {
    id: 'emg-1',
    type: 'medical',
    location: { lat: 28.535, lng: -81.375 },
    programId: 'prog-1',
    status: 'responding',
    createdAt: '2024-01-15T14:45:00Z',
    description: 'Person with severe injuries needs immediate medical attention',
  },
  {
    id: 'emg-2',
    type: 'trapped',
    location: { lat: 37.772, lng: -122.415 },
    programId: 'prog-4',
    status: 'pending',
    createdAt: '2024-01-15T15:00:00Z',
    description: 'Family trapped in collapsed building',
  },
  {
    id: 'emg-3',
    type: 'evacuation',
    location: { lat: 34.055, lng: -118.248 },
    programId: 'prog-2',
    status: 'resolved',
    createdAt: '2024-01-15T11:00:00Z',
  },
];

// Mock current user (for demo purposes)
export const mockCurrentUser: CurrentUser = {
  id: 'user-1',
  role: 'volunteer',
  name: 'Alex Thompson',
  email: 'alex.t@email.com',
  volunteer: {
    id: 'user-1',
    name: 'Alex Thompson',
    email: 'alex.t@email.com',
    phone: '+1-555-0199',
    skills: ['medical', 'first_aid', 'rescue'],
    location: { lat: 28.54, lng: -81.38 },
    availability: 'available',
  },
};

// Helper functions
export const getProgramsByStatus = (status: 'active' | 'completed' | 'paused') => 
  mockPrograms.filter(p => p.status === status);

export const getProgramById = (id: string) => 
  mockPrograms.find(p => p.id === id);

export const getVolunteersByProgram = (programId: string) => 
  mockVolunteers.filter(v => v.currentProgramId === programId);

export const getResourceRequestsByProgram = (programId: string) => 
  mockResourceRequests.filter(r => r.programId === programId);

export const getNGOById = (id: string) => 
  mockNGOs.find(n => n.id === id);
