import { Project, User } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 1,
    name: 'Ir. Budi Santoso, M.T.',
    email: 'direktur@3plus.co.id',
    role: 'direktur',
    title: 'Board of Director / Managing Director',
    phone: '+62 811-1234-5678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 2,
    name: 'Hendrik Wijaya, S.T., IAI',
    email: 'pm@3plus.co.id',
    role: 'project_manager',
    title: 'Senior Project Manager',
    phone: '+62 812-9876-5432',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 3,
    name: 'Siti Rahmawati, S.Ars',
    email: 'associate@3plus.co.id',
    role: 'representative_associate',
    title: 'Representative Associate - Regional Jawa & Bali',
    phone: '+62 813-5555-4433',
    regionAssigned: 'Jawa',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 4,
    name: 'Agus Pratama, S.T.',
    email: 'agus.p@3plus.co.id',
    role: 'project_manager',
    title: 'Project Manager - Eastern Region',
    phone: '+62 815-4321-8765',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 101,
    name: 'Pembangunan Menara Kantor 3Plus HQ & Showroom',
    clientName: 'PT Sampoerna Land Utama',
    clientContact: 'Bpk. Alexander S. (+62 811-9988-7766 / alex@sampoernaland.co.id)',
    location: 'Sudirman Central Business District (SCBD), Jakarta Selatan',
    province: 'DKI Jakarta',
    region: 'Jawa',
    latitude: -6.2238,
    longitude: 106.8086,
    status: 'on_going',
    contractValue: 24500000000, // Rp 24,5 Miliar
    startDate: '2026-01-15',
    targetEndDate: '2026-11-30',
    picId: 2,
    picName: 'Hendrik Wijaya, S.T., IAI',
    picEmail: 'pm@3plus.co.id',
    picPhone: '+62 812-9876-5432',
    progressPercent: 65,
    description: 'Pekerjaan Design & Build interior, lanskap, serta fasad arsitektural modern ramah lingkungan untuk gedung perkantoran 12 lantai.',
    stages: [
      { id: 1011, projectId: 101, stageName: 'desain', startDate: '2026-01-15', endDate: '2026-03-31', status: 'completed' },
      { id: 1012, projectId: 101, stageName: 'konstruksi', startDate: '2026-04-01', endDate: '2026-10-31', status: 'in_progress' },
      { id: 1013, projectId: 101, stageName: 'bast', startDate: '2026-11-01', endDate: '2026-11-30', status: 'pending' }
    ],
    payments: [
      { id: 1011, projectId: 101, stage: 'DP 20% Sign Contract & Schematics', amount: 4900000000, dueDate: '2026-01-20', status: 'lunas' },
      { id: 1012, projectId: 101, stage: 'Termin I 30% Progress Struktur & Fasad', amount: 7350000000, dueDate: '2026-05-15', status: 'lunas' },
      { id: 1013, projectId: 101, stage: 'Termin II 30% Interior Fit-Out & MEP', amount: 7350000000, dueDate: '2026-08-30', status: 'belum_lunas' },
      { id: 1014, projectId: 101, stage: 'Pelunasan 20% BAST & Handover', amount: 4900000000, dueDate: '2026-11-30', status: 'belum_lunas' }
    ]
  },
  {
    id: 102,
    name: 'Desain & Konstruksi Kompleks Office IKN Sub-Block 3',
    clientName: 'Otorita Ibu Kota Nusantara (IKN)',
    clientContact: 'Ir. Bambang Trihatmojo (+62 812-3344-5566)',
    location: 'KIPP Sepaku, Penajam Paser Utara, Kalimantan Timur',
    province: 'Kalimantan Timur',
    region: 'Kalimantan',
    latitude: -0.9634,
    longitude: 116.6974,
    status: 'on_going',
    contractValue: 48000000000, // Rp 48 Miliar
    startDate: '2025-10-01',
    targetEndDate: '2026-09-15',
    picId: 2,
    picName: 'Hendrik Wijaya, S.T., IAI',
    picEmail: 'pm@3plus.co.id',
    picPhone: '+62 812-9876-5432',
    progressPercent: 78,
    description: 'Proyek strategis nasional fasilitasi perkantoran kementerian berkonsep Smart Forest City dengan struktur kayu laminasi dan panel surya terintegrasi.',
    stages: [
      { id: 1021, projectId: 102, stageName: 'desain', startDate: '2025-10-01', endDate: '2025-12-15', status: 'completed' },
      { id: 1022, projectId: 102, stageName: 'konstruksi', startDate: '2025-12-16', endDate: '2026-08-15', status: 'in_progress' },
      { id: 1023, projectId: 102, stageName: 'bast', startDate: '2026-08-16', endDate: '2026-09-15', status: 'pending' }
    ],
    payments: [
      { id: 1021, projectId: 102, stage: 'Uang Muka 30%', amount: 14400000000, dueDate: '2025-10-10', status: 'lunas' },
      { id: 1022, projectId: 102, stage: 'Termin I Progress 50%', amount: 14400000000, dueDate: '2026-03-01', status: 'lunas' },
      { id: 1023, projectId: 102, stage: 'Termin II Progress 80%', amount: 12000000000, dueDate: '2026-07-20', status: 'terlambat' },
      { id: 1024, projectId: 102, stage: 'Retensi & BAST Final', amount: 7200000000, dueDate: '2026-09-15', status: 'belum_lunas' }
    ]
  },
  {
    id: 103,
    name: 'Interior Fit-Out Luxury Villa & Resort Seminyak',
    clientName: 'PT Bali Luxury Experience',
    clientContact: 'Mr. Jean-Luc Dupont (+62 819-0011-2233)',
    location: 'Jl. Kayu Aya, Seminyak, Badung, Bali',
    province: 'Bali',
    region: 'Bali-Nusa Tenggara',
    latitude: -8.6882,
    longitude: 115.1582,
    status: 'bast',
    contractValue: 12800000000, // Rp 12,8 Miliar
    startDate: '2025-04-01',
    targetEndDate: '2026-02-28',
    bastDate: '2026-03-05',
    picId: 3,
    picName: 'Siti Rahmawati, S.Ars',
    picEmail: 'associate@3plus.co.id',
    picPhone: '+62 813-5555-4433',
    progressPercent: 100,
    description: 'Pekerjaan kustom interior tropis kontemporer untuk 18 unit luxury villa termasuk kolam renang infinity dan clubhouse.',
    stages: [
      { id: 1031, projectId: 103, stageName: 'desain', startDate: '2025-04-01', endDate: '2025-06-30', status: 'completed' },
      { id: 1032, projectId: 103, stageName: 'konstruksi', startDate: '2025-07-01', endDate: '2026-02-15', status: 'completed' },
      { id: 1033, projectId: 103, stageName: 'bast', startDate: '2026-02-16', endDate: '2026-03-05', status: 'completed' }
    ],
    payments: [
      { id: 1031, projectId: 103, stage: 'DP 25%', amount: 3200000000, dueDate: '2025-04-10', status: 'lunas' },
      { id: 1032, projectId: 103, stage: 'Termin 1 (50%)', amount: 3200000000, dueDate: '2025-09-15', status: 'lunas' },
      { id: 1033, projectId: 103, stage: 'Termin 2 (90%)', amount: 5120000000, dueDate: '2026-01-20', status: 'lunas' },
      { id: 1034, projectId: 103, stage: 'Pelunasan BAST (100%)', amount: 1280000000, dueDate: '2026-03-05', status: 'lunas' }
    ]
  },
  {
    id: 104,
    name: 'Masterplan & Arsitektur Eco-Resort Dago Highland',
    clientName: 'PT Priangan Asri Development',
    clientContact: 'Ibu Ratna Juwita (+62 812-7777-8888)',
    location: 'Dago Pakar, Kabupaten Bandung, Jawa Barat',
    province: 'Jawa Barat',
    region: 'Jawa',
    latitude: -6.8617,
    longitude: 107.6256,
    status: 'prospek',
    contractValue: 18500000000, // Rp 18,5 Miliar
    startDate: '2026-09-01',
    targetEndDate: '2027-06-30',
    picId: 3,
    picName: 'Siti Rahmawati, S.Ars',
    picEmail: 'associate@3plus.co.id',
    picPhone: '+62 813-5555-4433',
    progressPercent: 15,
    description: 'Tahap penyusunan proposal desain arsitektur kontur lereng gunung dan analisis kelayakan lingkungan untuk eco-resort 4 bintang.',
    stages: [
      { id: 1041, projectId: 104, stageName: 'desain', startDate: '2026-09-01', endDate: '2026-11-30', status: 'in_progress' },
      { id: 1042, projectId: 104, stageName: 'konstruksi', startDate: '2026-12-01', endDate: '2027-05-31', status: 'pending' },
      { id: 1043, projectId: 104, stageName: 'bast', startDate: '2027-06-01', endDate: '2027-06-30', status: 'pending' }
    ],
    payments: [
      { id: 1041, projectId: 104, stage: 'Fee Desain Awal (Schematic)', amount: 1850000000, dueDate: '2026-09-15', status: 'belum_lunas' },
      { id: 1042, projectId: 104, stage: 'DP Konstruksi 30%', amount: 5550000000, dueDate: '2026-12-10', status: 'belum_lunas' }
    ]
  },
  {
    id: 105,
    name: 'Renovasi & Redesain Interior Hotel Grand Tunjungan',
    clientName: 'PT Tunjungan Hotelier Group',
    clientContact: 'Bpk. Hadi Wijaya (+62 811-3322-1100)',
    location: 'Jl. Tunjungan, Genteng, Surabaya, Jawa Timur',
    province: 'Jawa Timur',
    region: 'Jawa',
    latitude: -7.2575,
    longitude: 112.7521,
    status: 'on_going',
    contractValue: 15200000000, // Rp 15,2 Miliar
    startDate: '2025-11-01',
    targetEndDate: '2026-08-30',
    picId: 2,
    picName: 'Hendrik Wijaya, S.T., IAI',
    picEmail: 'pm@3plus.co.id',
    picPhone: '+62 812-9876-5432',
    progressPercent: 82,
    description: 'Revitalisasi ballroom, lobby utama, serta 120 kamar suite hotel heritage Surabaya dengan sentuhan art-deco modern.',
    stages: [
      { id: 1051, projectId: 105, stageName: 'desain', startDate: '2025-11-01', endDate: '2026-01-15', status: 'completed' },
      { id: 1052, projectId: 105, stageName: 'konstruksi', startDate: '2026-01-16', endDate: '2026-07-31', status: 'in_progress' },
      { id: 1053, projectId: 105, stageName: 'bast', startDate: '2026-08-01', endDate: '2026-08-30', status: 'pending' }
    ],
    payments: [
      { id: 1051, projectId: 105, stage: 'Uang Muka 25%', amount: 3800000000, dueDate: '2025-11-15', status: 'lunas' },
      { id: 1052, projectId: 105, stage: 'Termin I Progress 60%', amount: 5320000000, dueDate: '2026-03-30', status: 'lunas' },
      { id: 1053, projectId: 105, stage: 'Termin II Progress 90%', amount: 4560000000, dueDate: '2026-07-15', status: 'terlambat' },
      { id: 1054, projectId: 105, stage: 'Pelunasan BAST', amount: 1520000000, dueDate: '2026-08-30', status: 'belum_lunas' }
    ]
  },
  {
    id: 106,
    name: 'Pembangunan Pusat Logistik & Gudang Modern Balikpapan',
    clientName: 'PT Borneo Transport Logistics',
    clientContact: 'Bpk. Charles Tan (+62 813-9876-0000)',
    location: 'Kawasan Industri Kariangau, Balikpapan, Kalimantan Timur',
    province: 'Kalimantan Timur',
    region: 'Kalimantan',
    latitude: -1.1892,
    longitude: 116.8529,
    status: 'bast',
    contractValue: 21000000000, // Rp 21 Miliar
    startDate: '2025-02-01',
    targetEndDate: '2026-01-15',
    bastDate: '2026-01-20',
    picId: 4,
    picName: 'Agus Pratama, S.T.',
    picEmail: 'agus.p@3plus.co.id',
    picPhone: '+62 815-4321-8765',
    progressPercent: 100,
    description: 'Pembangunan gudang struktur baja span 40m dengan cold storage terintegrasi pendukung rantai pasok material IKN.',
    stages: [
      { id: 1061, projectId: 106, stageName: 'desain', startDate: '2025-02-01', endDate: '2025-03-31', status: 'completed' },
      { id: 1062, projectId: 106, stageName: 'konstruksi', startDate: '2025-04-01', endDate: '2025-12-31', status: 'completed' },
      { id: 1063, projectId: 106, stageName: 'bast', startDate: '2026-01-01', endDate: '2026-01-20', status: 'completed' }
    ],
    payments: [
      { id: 1061, projectId: 106, stage: 'DP 20%', amount: 4200000000, dueDate: '2025-02-15', status: 'lunas' },
      { id: 1062, projectId: 106, stage: 'Termin I 40%', amount: 8400000000, dueDate: '2025-07-01', status: 'lunas' },
      { id: 1063, projectId: 106, stage: 'Termin II 30%', amount: 6300000000, dueDate: '2025-11-30', status: 'lunas' },
      { id: 1064, projectId: 106, stage: 'Pelunasan BAST 10%', amount: 2100000000, dueDate: '2026-01-20', status: 'lunas' }
    ]
  },
  {
    id: 107,
    name: 'Desain Arsitektur & Interior Deli Plaza Hub',
    clientName: 'PT Medan Land Makmur',
    clientContact: 'H. Sultan Arifin (+62 812-6000-1122)',
    location: 'Jl. Pemuda, Medan Barat, Kota Medan, Sumatra Utara',
    province: 'Sumatra Utara',
    region: 'Sumatra',
    latitude: 3.5952,
    longitude: 98.6722,
    status: 'prospek',
    contractValue: 9800000000, // Rp 9,8 Miliar
    startDate: '2026-10-15',
    targetEndDate: '2027-05-30',
    picId: 3,
    picName: 'Siti Rahmawati, S.Ars',
    picEmail: 'associate@3plus.co.id',
    picPhone: '+62 813-5555-4433',
    progressPercent: 10,
    description: 'Prospek komersial pusat kuliner dan lifestyle hub semi-outdoor berkonsep tropical greenery di pusat Kota Medan.',
    stages: [
      { id: 1071, projectId: 107, stageName: 'desain', startDate: '2026-10-15', endDate: '2026-12-31', status: 'pending' },
      { id: 1072, projectId: 107, stageName: 'konstruksi', startDate: '2027-01-01', endDate: '2027-05-01', status: 'pending' },
      { id: 1073, projectId: 107, stageName: 'bast', startDate: '2027-05-02', endDate: '2027-05-30', status: 'pending' }
    ],
    payments: [
      { id: 1071, projectId: 107, stage: 'Retainer Desain Conceptual', amount: 980000000, dueDate: '2026-10-30', status: 'belum_lunas' }
    ]
  },
  {
    id: 108,
    name: 'Pembangunan South Sulawesi Commercial Center',
    clientName: 'PT Makassar Gateway Properties',
    clientContact: 'Drs. Andi Amiruddin (+62 811-4400-5566)',
    location: 'Kawasan Panakkukang, Kota Makassar, Sulawesi Selatan',
    province: 'Sulawesi Selatan',
    region: 'Sulawesi',
    latitude: -5.1477,
    longitude: 119.4327,
    status: 'on_going',
    contractValue: 31500000000, // Rp 31,5 Miliar
    startDate: '2025-08-01',
    targetEndDate: '2026-07-31',
    picId: 4,
    picName: 'Agus Pratama, S.T.',
    picEmail: 'agus.p@3plus.co.id',
    picPhone: '+62 815-4321-8765',
    progressPercent: 88,
    description: 'Pekerjaan struktur dan fasad kaca kurva tinggi untuk gedung pertokoan, office suite, serta sky bridge penghubung mall.',
    stages: [
      { id: 1081, projectId: 108, stageName: 'desain', startDate: '2025-08-01', endDate: '2025-10-15', status: 'completed' },
      { id: 1082, projectId: 108, stageName: 'konstruksi', startDate: '2025-10-16', endDate: '2026-06-30', status: 'in_progress' },
      { id: 1083, projectId: 108, stageName: 'bast', startDate: '2026-07-01', endDate: '2026-07-31', status: 'pending' }
    ],
    payments: [
      { id: 1081, projectId: 108, stage: 'DP 20%', amount: 6300000000, dueDate: '2025-08-15', status: 'lunas' },
      { id: 1082, projectId: 108, stage: 'Termin 1 (50%)', amount: 9450000000, dueDate: '2025-12-20', status: 'lunas' },
      { id: 1083, projectId: 108, stage: 'Termin 2 (85%)', amount: 11025000000, dueDate: '2026-05-10', status: 'lunas' },
      { id: 1084, projectId: 108, stage: 'Pelunasan BAST', amount: 4725000000, dueDate: '2026-07-31', status: 'belum_lunas' }
    ]
  },
  {
    id: 109,
    name: 'Interior Fit-Out Papua Creative & Youth Hub',
    clientName: 'Dinas PUPR Provinsi Papua',
    clientContact: 'Bpk. Martinus Kogoya (+62 812-9900-8877)',
    location: 'Kotaraja, Abepura, Kota Jayapura, Papua',
    province: 'Papua',
    region: 'Papua-Maluku',
    latitude: -2.5489,
    longitude: 140.7186,
    status: 'on_going',
    contractValue: 8600000000, // Rp 8,6 Miliar
    startDate: '2026-02-01',
    targetEndDate: '2026-10-15',
    picId: 4,
    picName: 'Agus Pratama, S.T.',
    picEmail: 'agus.p@3plus.co.id',
    picPhone: '+62 815-4321-8765',
    progressPercent: 55,
    description: 'Pekerjaan akustik studio rekaman, ruang pameran seni, auditorium interaktif, dan co-working space pemuda Papua.',
    stages: [
      { id: 1091, projectId: 109, stageName: 'desain', startDate: '2026-02-01', endDate: '2026-03-31', status: 'completed' },
      { id: 1092, projectId: 109, stageName: 'konstruksi', startDate: '2026-04-01', endDate: '2026-09-15', status: 'in_progress' },
      { id: 1093, projectId: 109, stageName: 'bast', startDate: '2026-09-16', endDate: '2026-10-15', status: 'pending' }
    ],
    payments: [
      { id: 1091, projectId: 109, stage: 'DP Kontrak 30%', amount: 2580000000, dueDate: '2026-02-15', status: 'lunas' },
      { id: 1092, projectId: 109, stage: 'Termin I 40%', amount: 3440000000, dueDate: '2026-06-30', status: 'lunas' },
      { id: 1093, projectId: 109, stage: 'Pelunasan BAST 30%', amount: 2580000000, dueDate: '2026-10-15', status: 'belum_lunas' }
    ]
  },
  {
    id: 110,
    name: 'Prospek Oceanfront Villa Resort Bunaken',
    clientName: 'PT Manado Paradise Realty',
    clientContact: 'Ibu Grace Sumendap (+62 811-432-100)',
    location: 'Kawasan Tongkaina, Bunaken, Kota Manado, Sulawesi Utara',
    province: 'Sulawesi Utara',
    region: 'Sulawesi',
    latitude: 1.5478,
    longitude: 124.8428,
    status: 'prospek',
    contractValue: 14700000000, // Rp 14,7 Miliar
    startDate: '2026-11-01',
    targetEndDate: '2027-08-31',
    picId: 3,
    picName: 'Siti Rahmawati, S.Ars',
    picEmail: 'associate@3plus.co.id',
    picPhone: '+62 813-5555-4433',
    progressPercent: 5,
    description: 'Prospek tahap persetujuan desain villa tebing laut dengan penekanan pada bahan tahan korosi air laut dan solar power grid.',
    stages: [
      { id: 1101, projectId: 110, stageName: 'desain', startDate: '2026-11-01', endDate: '2027-01-31', status: 'pending' },
      { id: 1102, projectId: 110, stageName: 'konstruksi', startDate: '2027-02-01', endDate: '2027-07-31', status: 'pending' },
      { id: 1103, projectId: 110, stageName: 'bast', startDate: '2027-08-01', endDate: '2027-08-31', status: 'pending' }
    ],
    payments: [
      { id: 1101, projectId: 110, stage: 'DP Desain', amount: 1470000000, dueDate: '2026-11-15', status: 'belum_lunas' }
    ]
  },
  {
    id: 111,
    name: 'Desain & Konstruksi Musi Riverside Walk Palembang',
    clientName: 'PT Musi Indah Permai',
    clientContact: 'H. Syamsul Bahri (+62 812-7100-2200)',
    location: 'Kawasan 16 Ilir, Kota Palembang, Sumatra Selatan',
    province: 'Sumatra Selatan',
    region: 'Sumatra',
    latitude: -2.9761,
    longitude: 104.7754,
    status: 'bast',
    contractValue: 11200000000, // Rp 11,2 Miliar
    startDate: '2025-03-01',
    targetEndDate: '2025-12-20',
    bastDate: '2025-12-28',
    picId: 2,
    picName: 'Hendrik Wijaya, S.T., IAI',
    picEmail: 'pm@3plus.co.id',
    picPhone: '+62 812-9876-5432',
    progressPercent: 100,
    description: 'Pembangunan pedestrian waterfront promenade, dermaga perahu wisata, dan plaza terbuka dengan penerangan LED tematik.',
    stages: [
      { id: 1111, projectId: 111, stageName: 'desain', startDate: '2025-03-01', endDate: '2025-04-30', status: 'completed' },
      { id: 1112, projectId: 111, stageName: 'konstruksi', startDate: '2025-05-01', endDate: '2025-11-30', status: 'completed' },
      { id: 1113, projectId: 111, stageName: 'bast', startDate: '2025-12-01', endDate: '2025-12-28', status: 'completed' }
    ],
    payments: [
      { id: 1111, projectId: 111, stage: 'DP 20%', amount: 2240000000, dueDate: '2025-03-10', status: 'lunas' },
      { id: 1112, projectId: 111, stage: 'Termin I 50%', amount: 5600000000, dueDate: '2025-08-15', status: 'lunas' },
      { id: 1113, projectId: 111, stage: 'Pelunasan BAST', amount: 3360000000, dueDate: '2025-12-28', status: 'lunas' }
    ]
  },
  {
    id: 112,
    name: 'Kantor Operasional & Data Center Kawasan Industri Kendal',
    clientName: 'PT Central Java Tech Park',
    clientContact: 'Bpk. Herman Susilo (+62 813-2500-4400)',
    location: 'Kawasan Industri Kendal, Semarang, Jawa Tengah',
    province: 'Jawa Tengah',
    region: 'Jawa',
    latitude: -6.9667,
    longitude: 110.2167,
    status: 'on_going',
    contractValue: 19600000000, // Rp 19,6 Miliar
    startDate: '2026-01-01',
    targetEndDate: '2026-09-30',
    picId: 2,
    picName: 'Hendrik Wijaya, S.T., IAI',
    picEmail: 'pm@3plus.co.id',
    picPhone: '+62 812-9876-5432',
    progressPercent: 60,
    description: 'Pembangunan smart building kantor pengelola industri dan fasilitas data center tier-3 berkinerja tinggi.',
    stages: [
      { id: 1121, projectId: 112, stageName: 'desain', startDate: '2026-01-01', endDate: '2026-02-28', status: 'completed' },
      { id: 1122, projectId: 112, stageName: 'konstruksi', startDate: '2026-03-01', endDate: '2026-08-31', status: 'in_progress' },
      { id: 1123, projectId: 112, stageName: 'bast', startDate: '2026-09-01', endDate: '2026-09-30', status: 'pending' }
    ],
    payments: [
      { id: 1121, projectId: 112, stage: 'DP 25%', amount: 4900000000, dueDate: '2026-01-15', status: 'lunas' },
      { id: 1122, projectId: 112, stage: 'Termin I 35%', amount: 6860000000, dueDate: '2026-05-15', status: 'lunas' },
      { id: 1123, projectId: 112, stage: 'Termin II 30%', amount: 5880000000, dueDate: '2026-08-15', status: 'belum_lunas' },
      { id: 1124, projectId: 112, stage: 'Pelunasan BAST', amount: 1960000000, dueDate: '2026-09-30', status: 'belum_lunas' }
    ]
  }
];

export const REGIONS_LIST = [
  'Semua Wilayah',
  'Jawa',
  'Sumatra',
  'Kalimantan',
  'Sulawesi',
  'Bali-Nusa Tenggara',
  'Papua-Maluku'
];
