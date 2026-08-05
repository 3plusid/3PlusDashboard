export type UserRole = 'direktur' | 'project_manager' | 'representative_associate';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  phone: string;
  avatar?: string;
  regionAssigned?: string;
}

export type ProjectStatus = 'prospek' | 'on_going' | 'bast';

export interface ProjectStage {
  id: number;
  projectId: number;
  stageName: 'desain' | 'konstruksi' | 'bast' | string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface PaymentTerm {
  id: number;
  projectId: number;
  stage: string;
  amount: number;
  dueDate: string;
  status: 'lunas' | 'belum_lunas' | 'terlambat';
}

export interface Project {
  id: number;
  name: string;
  clientName: string;
  clientContact: string;
  location: string;
  province: string;
  region: 'Jawa' | 'Sumatra' | 'Kalimantan' | 'Sulawesi' | 'Bali-Nusa Tenggara' | 'Papua-Maluku';
  latitude: number;
  longitude: number;
  status: ProjectStatus;
  contractValue: number;
  startDate: string;
  targetEndDate: string;
  bastDate?: string;
  picId: number;
  picName: string;
  picEmail: string;
  picPhone: string;
  progressPercent: number;
  description?: string;
  stages: ProjectStage[];
  payments: PaymentTerm[];
}

export interface FilterState {
  status: 'all' | ProjectStatus;
  region: string;
  searchQuery: string;
  sortBy: 'contractValue' | 'targetEndDate' | 'startDate' | 'name';
  sortOrder: 'asc' | 'desc';
  dateRangeStart?: string;
  dateRangeEnd?: string;
}
