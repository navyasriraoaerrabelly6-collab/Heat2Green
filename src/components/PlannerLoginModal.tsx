import React, { useState } from 'react';
import { UserCheck, X, Shield, Lock, CheckCircle2, LogOut } from 'lucide-react';

interface PlannerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  loggedInRole: string | null;
  onLogin: (role: string) => void;
  onLogout: () => void;
}

export const PlannerLoginModal: React.FC<PlannerLoginModalProps> = ({
  isOpen,
  onClose,
  isLoggedIn,
  loggedInRole,
  onLogin,
  onLogout,
}) => {
  const [role, setRole] = useState<string>('Urban Development Officer');
  const [email, setEmail] = useState<string>('planner.officer@udd.gov.demo');
  const [password, setPassword] = useState<string>('••••••••••••');

  if (!isOpen) return null;

  const handlePreFill = (selectedRole: string) => {
    setRole(selectedRole);
    if (selectedRole === 'Urban Development Officer') {
      setEmail('director.urban@state.gov.demo');
    } else if (selectedRole === 'Municipal Commissioner') {
      setEmail('commissioner@ghmc.gov.demo');
    } else if (selectedRole === 'GIS Spatial Analyst') {
      setEmail('gis.analyst@heat2green.org');
    } else {
      setEmail('researcher@cept.ac.in');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-md overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#12304A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#0B6B3A] flex items-center justify-center border border-emerald-400">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Government / Planner Portal Access
              </h3>
              <p className="text-[11px] text-slate-300">
                Heat2Green Municipal Administrative Gateway
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-xs space-y-4">
          {isLoggedIn ? (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#0B6B3A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Authenticated Session Active
                </h4>
                <p className="text-slate-500 mt-1">
                  You are logged in with administrative planning privileges as:
                </p>
                <div className="inline-block mt-2 px-3 py-1 bg-[#EAF6EE] text-[#0B6B3A] font-bold rounded border border-emerald-200 text-xs">
                  {loggedInRole}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-md transition-colors"
                >
                  Return to Dashboard
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Designated Officer Role
                </label>
                <select
                  value={role}
                  onChange={(e) => handlePreFill(e.target.value)}
                  className="w-full bg-[#F5F8F6] border border-slate-300 rounded-md p-2 text-slate-800 font-medium focus:ring-1 focus:ring-[#0B6B3A]"
                >
                  <option value="Urban Development Officer">Urban Development Officer (State UDD)</option>
                  <option value="Municipal Commissioner">Municipal Commissioner (ULB / Smart City)</option>
                  <option value="GIS Spatial Analyst">GIS Spatial Analyst (Forestry Dept)</option>
                  <option value="Citizen Urban Planner">Citizen Urban Planner / Researcher</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Official Email / Gov ID
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F5F8F6] border border-slate-300 rounded-md p-2 text-slate-800 focus:ring-1 focus:ring-[#0B6B3A]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Security Passcode
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F5F8F6] border border-slate-300 rounded-md p-2 text-slate-800 focus:ring-1 focus:ring-[#0B6B3A]"
                />
              </div>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700 block mb-0.5">Demo Credentials:</span>
                Pre-filled credentials grant instant administrative access to municipal report export, scenario parameter tuning, and ward priority overrides.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-md font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B6B3A] hover:bg-[#14532D] text-white font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Access Platform</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
