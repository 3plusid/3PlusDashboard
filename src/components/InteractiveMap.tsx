import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Project, ProjectStatus } from '../types';
import { formatIDR, formatDateID, getStatusBadge } from '../utils/formatters';
import { MapPin, ZoomIn, ZoomOut, Compass, ExternalLink, Filter, Layers } from 'lucide-react';

interface InteractiveMapProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  selectedStatus: 'all' | ProjectStatus;
  selectedRegion: string;
  onStatusChange: (status: 'all' | ProjectStatus) => void;
  onRegionChange: (region: string) => void;
}

const REGION_COORDINATES: Record<string, { lat: number; lng: number; zoom: number }> = {
  'Semua Wilayah': { lat: -2.5, lng: 118.0, zoom: 5 },
  'Jawa': { lat: -7.2, lng: 110.0, zoom: 7 },
  'Sumatra': { lat: -0.5, lng: 101.5, zoom: 6 },
  'Kalimantan': { lat: -0.5, lng: 114.5, zoom: 6 },
  'Sulawesi': { lat: -1.5, lng: 120.0, zoom: 6 },
  'Bali-Nusa Tenggara': { lat: -8.6, lng: 116.5, zoom: 7 },
  'Papua-Maluku': { lat: -3.5, lng: 137.0, zoom: 6 }
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  projects,
  onSelectProject,
  selectedStatus,
  selectedRegion,
  onStatusChange,
  onRegionChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Filter projects based on props
  const filteredProjects = projects.filter((p) => {
    const matchStatus = selectedStatus === 'all' || p.status === selectedStatus;
    const matchRegion = selectedRegion === 'Semua Wilayah' || p.region === selectedRegion;
    return matchStatus && matchRegion;
  });

  // Calculate statistics for map header summary
  const totalCount = filteredProjects.length;
  const prospekCount = filteredProjects.filter((p) => p.status === 'prospek').length;
  const onGoingCount = filteredProjects.filter((p) => p.status === 'on_going').length;
  const bastCount = filteredProjects.filter((p) => p.status === 'bast').length;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialView = REGION_COORDINATES[selectedRegion] || REGION_COORDINATES['Semua Wilayah'];
      
      const map = L.map(mapContainerRef.current, {
        center: [initialView.lat, initialView.lng],
        zoom: initialView.zoom,
        zoomControl: false,
        attributionControl: false
      });

      // OpenStreetMap tiles (free, no API key required)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
      }).addTo(map);

      // Attribution (required by the OpenStreetMap tile usage policy)
      L.control.attribution({ position: 'bottomright', prefix: '3Plus GIS Platform' }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map center when region changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const coords = REGION_COORDINATES[selectedRegion] || REGION_COORDINATES['Semua Wilayah'];
    mapInstanceRef.current.flyTo([coords.lat, coords.lng], coords.zoom, {
      duration: 1.2
    });
  }, [selectedRegion]);

  // Render project markers on map
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    // Clear existing markers
    markersLayerRef.current.clearLayers();

    filteredProjects.forEach((project) => {
      const badge = getStatusBadge(project.status);

      // Custom HTML Marker Icon with pulsing effect for active projects
      const isOngoing = project.status === 'on_going';
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="relative group cursor-pointer">
            ${
              isOngoing
                ? `<div class="absolute -inset-1 rounded-full bg-blue-500/30 animate-ping"></div>`
                : ''
            }
            <div class="relative w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform hover:scale-125" style="background-color: ${badge.markerHex};">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div class="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
              ${project.name}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([project.latitude, project.longitude], { icon: customIcon });

      // Click listener to set active project card & open detail
      marker.on('click', () => {
        setActiveProject(project);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([project.latitude, project.longitude], 10, { duration: 0.8 });
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [filteredProjects]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetZoom = () => {
    onRegionChange('Semua Wilayah');
    mapInstanceRef.current?.flyTo([-2.5, 118.0], 5);
  };

  return (
    <div className="relative w-full h-[calc(100vh-80px)] min-h-[600px] flex flex-col bg-slate-900 overflow-hidden">
      {/* Top Map Filter Bar overlay */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider px-2 py-1 bg-slate-100 rounded-md">
            <Filter className="w-3.5 h-3.5 text-blue-700" /> Filter Status:
          </span>
          <button
            onClick={() => onStatusChange('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedStatus === 'all'
                ? 'bg-slate-900 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({projects.length})
          </button>
          <button
            onClick={() => onStatusChange('prospek')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              selectedStatus === 'prospek'
                ? 'bg-amber-500 text-white shadow'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Prospek ({projects.filter((p) => p.status === 'prospek').length})
          </button>
          <button
            onClick={() => onStatusChange('on_going')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              selectedStatus === 'on_going'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            On Going ({projects.filter((p) => p.status === 'on_going').length})
          </button>
          <button
            onClick={() => onStatusChange('bast')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              selectedStatus === 'bast'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            BAST ({projects.filter((p) => p.status === 'bast').length})
          </button>
        </div>

        {/* Region Quick Zoom Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider hidden sm:inline-block">
            Wilayah:
          </span>
          <select
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            {Object.keys(REGION_COORDINATES).map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Zoom & Control Panel */}
      <div className="absolute bottom-6 right-6 z-[400] flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          title="Perbesar Peta"
          className="w-10 h-10 bg-white hover:bg-slate-50 text-slate-700 rounded-xl shadow-lg border border-slate-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Perkecil Peta"
          className="w-10 h-10 bg-white hover:bg-slate-50 text-slate-700 rounded-xl shadow-lg border border-slate-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleResetZoom}
          title="Reset Ke Seluruh Indonesia"
          className="w-10 h-10 bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        >
          <Compass className="w-5 h-5" />
        </button>
      </div>

      {/* Map Stats Badge Overlay (Bottom Left) */}
      <div className="absolute bottom-6 left-6 z-[400] bg-slate-900/90 backdrop-blur-md text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700/60 hidden md:block max-w-sm">
        <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-slate-800">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" /> Sebaran Proyek Indonesia
          </span>
          <span className="text-xs font-extrabold px-2 py-0.5 bg-blue-600/30 text-blue-300 rounded border border-blue-500/30">
            {totalCount} Proyek Total
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
            <div className="text-amber-400 font-extrabold text-sm">{prospekCount}</div>
            <div className="text-[10px] text-slate-400">Prospek</div>
          </div>
          <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
            <div className="text-blue-400 font-extrabold text-sm">{onGoingCount}</div>
            <div className="text-[10px] text-slate-400">On Going</div>
          </div>
          <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
            <div className="text-emerald-400 font-extrabold text-sm">{bastCount}</div>
            <div className="text-[10px] text-slate-400">BAST</div>
          </div>
        </div>
      </div>

      {/* Project Quick Summary Modal/Card Overlay (When a pin is clicked) */}
      {activeProject && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[450] w-[92%] max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border mb-1.5 ${
                  getStatusBadge(activeProject.status).bgColor
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${getStatusBadge(activeProject.status).dotColor}`}
                />
                {getStatusBadge(activeProject.status).label}
              </span>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                {activeProject.name}
              </h3>
            </div>
            <button
              onClick={() => setActiveProject(null)}
              className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 my-3 text-xs text-slate-600">
            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="text-slate-500 font-medium">Klien / Owner:</span>
              <span className="font-bold text-slate-800">{activeProject.clientName}</span>
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="text-slate-500 font-medium">Nilai Pekerjaan:</span>
              <span className="font-black text-blue-700 text-sm">
                {formatIDR(activeProject.contractValue)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Lokasi</span>
                <span className="font-semibold text-slate-800 line-clamp-1">{activeProject.location}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Project PIC</span>
                <span className="font-semibold text-slate-800 line-clamp-1">{activeProject.picName}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Timeline Target</span>
                <span className="font-semibold text-slate-800">
                  {formatDateID(activeProject.startDate)} — {formatDateID(activeProject.targetEndDate)}
                </span>
              </div>
              <span className="text-xs font-bold text-blue-600">{activeProject.progressPercent}% Selesai</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setActiveProject(null)}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                onSelectProject(activeProject);
                setActiveProject(null);
              }}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
            >
              Lihat Detail Proyek Lengkap <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Empty State when no marker matches filter */}
      {filteredProjects.length === 0 && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[400] bg-white/95 backdrop-blur-md px-6 py-4 rounded-xl shadow-xl border border-slate-200 text-center max-w-md">
          <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800">Tidak ada proyek ditemukan</p>
          <p className="text-xs text-slate-500 mt-1">
            Tidak ada proyek yang sesuai dengan filter status "{selectedStatus}" dan wilayah "{selectedRegion}".
          </p>
          <button
            onClick={() => {
              onStatusChange('all');
              onRegionChange('Semua Wilayah');
            }}
            className="mt-3 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
          >
            Reset Semua Filter
          </button>
        </div>
      )}
    </div>
  );
};
