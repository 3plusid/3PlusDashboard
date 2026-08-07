import React from 'react';
import { Project, ProjectStatus } from '../types';
import { formatIDR, formatDateID, getStatusBadge, getDeadlineStatus } from '../utils/formatters';
import { 
  Building2, Calendar, UserCheck, CreditCard, Layers, MapPin, 
  AlertTriangle, CheckCircle2, Clock, Phone, Mail, FileText, ArrowLeft,
  DollarSign, ShieldAlert, BadgeCheck
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
  onUpdateProject?: (updated: Project) => void;
  userRole: string;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onUpdateProject,
  userRole
}) => {
  const badge = getStatusBadge(project.status);
  const deadline = getDeadlineStatus(project.targetEndDate, project.status);
  const isOverdue = deadline.type === 'overdue';

  // Toggle payment status helper
  const handleTogglePaymentStatus = (paymentId: number) => {
    if (!onUpdateProject || (userRole !== 'direktur' && userRole !== 'project_manager')) return;

    const updatedPayments = project.payments.map((p) => {
      if (p.id === paymentId) {
        const nextStatus = p.status === 'lunas' ? 'belum_lunas' : 'lunas';
        return { ...p, status: nextStatus as any };
      }
      return p;
    });

    onUpdateProject({
      ...project,
      payments: updatedPayments
    });
  };

  // Toggle stage status helper
  const handleToggleStageStatus = (stageId: number) => {
    if (!onUpdateProject || (userRole !== 'direktur' && userRole !== 'project_manager')) return;

    const updatedStages = project.stages.map((s) => {
      if (s.id === stageId) {
        const nextStatus = s.status === 'completed' ? 'in_progress' : s.status === 'in_progress' ? 'completed' : 'in_progress';
        return { ...s, status: nextStatus as any };
      }
      return s;
    });

    // Recalculate progress percent
    const completedCount = updatedStages.filter((s) => s.status === 'completed').length;
    const newProgress = Math.round((completedCount / updatedStages.length) * 100);

    onUpdateProject({
      ...project,
      stages: updatedStages,
      progressPercent: newProgress
    });
  };

  return (
    <div className="fixed inset-0 z-[600] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-50 rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl my-auto overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 md:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-9 h-9 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full flex items-center justify-center transition-colors"
          >
            ✕
          </button>

          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${badge.bgColor}`}>
              <span className={`w-2 h-2 rounded-full ${badge.dotColor}`} />
              {badge.label}
            </span>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              ID Proyek: #{project.id} • {project.region}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
            {project.name}
          </h1>

          <p className="text-xs md:text-sm text-slate-400 flex items-center gap-1.5 mt-2">
            <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
            {project.location} ({project.province})
          </p>
        </div>

        {/* Overdue Warning Alert Banner if overdue */}
        {isOverdue && (
          <div className="bg-red-500 text-white px-6 py-3 flex items-center justify-between gap-3 text-xs font-extrabold shadow-inner">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>PERINGATAN JADWAL: Proyek ini telah melewati target tanggal selesai ({formatDateID(project.targetEndDate)})! Keterlambatan: {Math.abs(deadline.days || 0)} Hari.</span>
            </div>
            <span className="bg-white/20 px-2.5 py-1 rounded text-[10px] uppercase font-black">Perlu Tindakan PM</span>
          </div>
        )}

        <div className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Section 1: Ringkasan Proyek & Nilai Utama */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Value Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Nilai Kontrak Pekerjaan
                </span>
                <span className="text-2xl font-black text-blue-700 tracking-tight block mt-1">
                  {formatIDR(project.contractValue)}
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Status Pembayaran:</span>
                <span className="font-bold text-slate-800">
                  {project.payments.filter((p) => p.status === 'lunas').length} dari {project.payments.length} Lunas
                </span>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Progres Keseluruhan
                  </span>
                  <span className="text-sm font-black text-blue-700">{project.progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${project.progressPercent}%` }}
                  />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Fase Aktif:</span>
                <span className="font-bold text-slate-800">
                  {project.stages.find((s) => s.status === 'in_progress')?.stageName.toUpperCase() || 'BAST Handover'}
                </span>
              </div>
            </div>

            {/* Client Info Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Klien / Pemilik (Owner)
                </span>
                <span className="text-base font-black text-slate-900 block mt-1 line-clamp-1">
                  {project.clientName}
                </span>
                <span className="text-xs text-slate-500 block mt-0.5 line-clamp-1">
                  {project.clientContact || <i className="text-slate-400 font-normal">Kontak belum diisi</i>}
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Tipe Proyek:</span>
                <span className="font-bold text-slate-800">Design & Build</span>
              </div>
            </div>

          </div>

          {/* Section 2: Jadwal Proyek & Detail Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-blue-700" /> Jadwal & Milestone Proyek
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Tanggal Mulai (Kickoff)</span>
                <span className="text-sm font-extrabold text-slate-800 mt-1 block">
                  {formatDateID(project.startDate)}
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Tanggal Selesai</span>
                <span className="text-sm font-extrabold text-slate-800 mt-1 block">
                  {formatDateID(project.targetEndDate)}
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Tanggal BAST (Handover)</span>
                <span className="text-sm font-extrabold text-slate-800 mt-1 block">
                  {project.bastDate ? formatDateID(project.bastDate) : <span className="text-slate-400 font-normal">Belum BAST</span>}
                </span>
              </div>
            </div>

            {/* Stage Timeline Breakdown */}
            <div className="mt-5 pt-5 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 block mb-3">
                Tahapan Pekerjaan (Klik untuk memperbarui progres stage):
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {project.stages.map((stage) => {
                  const isDone = stage.status === 'completed';
                  const isInProg = stage.status === 'in_progress';

                  return (
                    <div
                      key={stage.id}
                      onClick={() => handleToggleStageStatus(stage.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isDone
                          ? 'bg-emerald-50/60 border-emerald-200 hover:bg-emerald-100/60'
                          : isInProg
                          ? 'bg-blue-50/60 border-blue-200 hover:bg-blue-100/60'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-black capitalize text-slate-900">
                          Fase {stage.stageName}
                        </span>
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                          </span>
                        ) : isInProg ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-blue-700">
                            <Clock className="w-3.5 h-3.5 animate-spin" /> Berjalan
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400">Menunggu</span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        {formatDateID(stage.startDate)} — {formatDateID(stage.endDate)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Kontak PIC & Klien */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* PIC Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                <UserCheck className="w-4 h-4 text-blue-700" /> Project PIC (Penanggung Jawab)
              </h3>
              <div className="space-y-2 text-xs">
                <div className="font-extrabold text-slate-900 text-sm">{project.picName}</div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{project.picPhone || <i className="text-slate-400 font-normal">Kontak telepon belum diisi</i>}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{project.picEmail || <i className="text-slate-400 font-normal">Email belum diisi</i>}</span>
                </div>
              </div>
            </div>

            {/* Client Owner Contact Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4 text-blue-700" /> Kontak Klien / Owner Proyek
              </h3>
              <div className="space-y-2 text-xs">
                <div className="font-extrabold text-slate-900 text-sm">{project.clientName}</div>
                <div className="flex items-center gap-2 text-slate-600">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>{project.clientContact || <i className="text-slate-400 font-normal">Detail kontak klien belum diisi</i>}</span>
                </div>
                <div className="text-[11px] text-slate-400 pt-1">
                  Lokasi Proyek: {project.location}
                </div>
              </div>
            </div>

          </div>

          {/* Section 4: Nilai Pekerjaan & Rincian Pembayaran */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-700" /> Rincian Nilai Pekerjaan & Tahapan Pembayaran
              </h3>
              <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                Total: {formatIDR(project.contractValue)}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-black uppercase text-[10px] tracking-wider">
                    <th className="p-3">Tahap Pembayaran</th>
                    <th className="p-3">Nominal (IDR)</th>
                    <th className="p-3">Jatuh Tempo</th>
                    <th className="p-3 text-center">Status</th>
                    {(userRole === 'direktur' || userRole === 'project_manager') && (
                      <th className="p-3 text-center">Tindakan</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {project.payments.map((payment) => {
                    const isPaid = payment.status === 'lunas';
                    const isLate = payment.status === 'terlambat';

                    return (
                      <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-bold text-slate-800">{payment.stage}</td>
                        <td className="p-3 font-black text-slate-900">{formatIDR(payment.amount)}</td>
                        <td className="p-3 text-slate-600">{formatDateID(payment.dueDate)}</td>
                        <td className="p-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                              isPaid
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : isLate
                                ? 'bg-red-100 text-red-800 border-red-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {isPaid ? 'Lunas' : isLate ? 'Terlambat Payment' : 'Belum Lunas'}
                          </span>
                        </td>
                        {(userRole === 'direktur' || userRole === 'project_manager') && (
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleTogglePaymentStatus(payment.id)}
                              className="px-2.5 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                            >
                              {isPaid ? 'Tandai Belum Lunas' : 'Tandai Lunas'}
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            PT 3Plus Indonesia Project Intelligence Platform
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-105"
          >
            Tutup Halaman Detail
          </button>
        </div>

      </div>
    </div>
  );
};
