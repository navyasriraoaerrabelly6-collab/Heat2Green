import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Building, ShieldCheck } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    state: '',
    city: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in your name, email, and message inquiry.');
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-2">
        <h1 className="text-xl font-bold text-slate-900 font-serif">
          Technical Support & Project Office
        </h1>
        <p className="text-xs text-slate-500">
          Inquiries for municipal GIS integration, urban heat sensor deployment, and academic research collaborations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#0B6B3A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Inquiry Submitted Successfully
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. Your communication has been dispatched to the Heat2Green Technical Project Support Desk. A designated GIS planning officer will respond to <strong>{formData.email}</strong> within 2 business days.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    organization: '',
                    state: '',
                    city: '',
                    subject: '',
                    message: '',
                  });
                }}
                className="mt-3 px-4 py-2 bg-[#0B6B3A] text-white text-xs font-semibold rounded-md hover:bg-[#14532D] transition-colors"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">
                Official Correspondence Form
              </h3>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#F5F8F6] border border-slate-300 rounded-md p-2 text-slate-800 focus:ring-1 focus:ring-[#0B6B3A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rajesh@urban.gov.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F5F8F6] border border-slate-300 rounded-md p-2 text-slate-800 focus:ring-1 focus:ring-[#0B6B3A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Organization / Dept</label>
                  <input
                    type="text"
                    placeholder="e.g. Municipal Corporation"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full bg-[#F5F8F6] border border-slate-300 rounded-md p-2 text-slate-800 focus:ring-1 focus:ring-[#0B6B3A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">State</label>
                  <input
                    type="text"
                    placeholder="e.g. Telangana"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-[#F5F8F6] border border-slate-300 rounded-md p-2 text-slate-800 focus:ring-1 focus:ring-[#0B6B3A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Hyderabad"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#F5F8F6] border border-slate-300 rounded-md p-2 text-slate-800 focus:ring-1 focus:ring-[#0B6B3A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Integration of Ward Level Satellite Data"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-[#F5F8F6] border border-slate-300 rounded-md p-2 text-slate-800 focus:ring-1 focus:ring-[#0B6B3A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Detailed Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Please specify your query, ward GIS boundary requirements, or research objective..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#F5F8F6] border border-slate-300 rounded-md p-2 text-slate-800 focus:ring-1 focus:ring-[#0B6B3A] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 bg-[#0B6B3A] hover:bg-[#14532D] text-white font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Office Information Side Card */}
        <div className="bg-[#12304A] text-white rounded-xl p-6 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 border-b border-slate-700 pb-2">
              National Project Office
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Urban Heat Intelligence Cell</div>
                  <div>Environmental GIS Planning Node</div>
                  <div>Lodhi Institutional Area, New Delhi 110003</div>
                  <div className="text-[10px] text-slate-400 font-mono-data">(Sample Reference Address)</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Electronic Desk</div>
                  <div>support@heat2green.gov-portal.demo</div>
                  <div>technical.query@heat2green.org</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Technical Support Line</div>
                  <div className="font-mono-data">+91 (011) 2468-XXXX</div>
                  <div className="text-[10px] text-slate-400">Toll-free Helpdesk Mon–Fri</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Working Hours</div>
                  <div>Monday to Friday: 09:30 AM – 06:00 PM IST</div>
                  <div>Closed on National Holidays</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 p-3 rounded-lg border border-white/10 text-[11px] text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
            <div>
              Heat2Green is maintained under public-interest scientific benchmarks. Contact information is for demo and simulation inquiries.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
