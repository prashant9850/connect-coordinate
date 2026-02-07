// User roles
export type UserRole = 'victim' | 'volunteer' | 'ngo' | 'authority';

// Severity levels
export type SeverityLevel = 'red' | 'orange' | 'yellow';

// Emergency types
export type EmergencyType = 'medical' | 'trapped' | 'evacuation' | 'food' | 'other';

// Volunteer skills
export type VolunteerSkill = 
  | 'medical' 
  | 'rescue' 
  | 'logistics' 
  | 'transport' 
  | 'communication' 
  | 'shelter' 
  | 'food_distribution'
  | 'first_aid';

// Resource types
export type ResourceType = 
  | 'rope' 
  | 'torch' 
  | 'medical_kit' 
  | 'stretcher' 
  | 'water' 
  | 'blanket' 
  | 'tent'
  | 'radio';

// Disaster program
export interface DisasterProgram {
  id: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  disasterType: string;
  location: {
    lat: number;
    lng: number;
    name: string;
    radius: number; // in km
  };
  ngoId: string;
  ngoName: string;
  requiredSkills: VolunteerSkill[];
  volunteerCount: number;
  maxVolunteers: number;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  updatedAt: string;
}

// Volunteer
export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: VolunteerSkill[];
  location: {
    lat: number;
    lng: number;
  };
  availability: 'available' | 'busy' | 'offline';
  currentProgramId?: string;
  avatar?: string;
}

// NGO
export interface NGO {
  id: string;
  name: string;
  email: string;
  description: string;
  areaOfOperation: string[];
  manpowerCapacity: number;
  verified: boolean;
  logo?: string;
  pastPrograms: number;
  activePrograms: number;
}

// Emergency request
export interface EmergencyRequest {
  id: string;
  type: EmergencyType;
  location: {
    lat: number;
    lng: number;
  };
  programId?: string;
  status: 'pending' | 'responding' | 'resolved';
  createdAt: string;
  description?: string;
}

// Resource request
export interface ResourceRequest {
  id: string;
  programId: string;
  requesterId: string;
  requesterName: string;
  resourceType: ResourceType;
  quantity: number;
  urgency: 'low' | 'medium' | 'high';
  status: 'open' | 'claimed' | 'fulfilled';
  providerId?: string;
  providerName?: string;
  createdAt: string;
}

// Current user context
export interface CurrentUser {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  avatar?: string;
  // Role-specific data
  volunteer?: Volunteer;
  ngo?: NGO;
}
