import React, { useState } from 'react';
import { MessageSquare, Star, CheckCircle, ThumbsUp, Send } from 'lucide-react';

export const FeedbackView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: 'Citizen',
    feedbackType: 'Suggestion',
    rating: 5,
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please provide your name, email, and detailed feedback.');
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Title */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-[#EAF6EE] text-[#0B6B3A]">
            <MessageSquare className="w-4 h-4" />
          </span>
          <h1 className="text-xl font-bold text-slate-900 font-serif">
            Citizen & Planner Feedback
          </h1>
        </div>
        <p className="text-xs text-slate-500">
          Your feedback directly influences hotspot validation, tree canopy priorities, and user experience enhancements across Indian smart cities.
        </p>
      </div>

      {/* Main Feedback Form Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#0B6B3A] flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Thank You for Your Valuable Feedback!
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Your submission has been cataloged under Reference ID{' '}
              <span className="font-mono-data font-bold text-slate-900">
                #H2G-FDB-{Math.floor(1000 + Math.random() * 9000)}
              </span>
              . Our GIS analytics team regularly reviews citizen observations to recalibrate local heat anomaly models.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '',
                  email: '',
                  userType: 'Citizen',
                  feedbackType: 'Suggestion',
                  rating: 5,
                  message: '',
                });
              }}
              className="mt-3 px-4 py-2 bg-[#0B6B3A] text-white text-xs font-semibold rounded-md hover:bg-[#14532D] transition-colors"
            >
              Submit Another Response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Rao"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#F5F8F6] border border-slate-300 rounded-md p-2 text-slate-800 focus:ring-1 focus:ring-[#0B6B3A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Your Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ananya@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#F5F8F6] border border-slate-300 rounded-md p-2 text-slate-800 focus:ring-1 focus:ring-[#0B6B3A] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">I am a:</label>
                <select
                  value={formData.userType}
                  onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                  className="w-full bg-[#F5F8F6] border border-slate-300 rounded-md p-2 text-slate-800 font-medium focus:ring-1 focus:ring-[#0B6B3A]"
                >
                  <option value="Citizen">Resident Citizen</option>
                  <option value="Planner">Urban / Town Planner</option>
                  <option value="Researcher">Environmental Researcher / Academic</option>
                  <option value="Government Official">Government / Municipal Officer</option>
                  <option value="Other">Other Stakeholder</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category of Feedback:</label>
                <select
                  value={formData.feedbackType}
                  onChange={(e) => setFormData({ ...formData, feedbackType: e.target.value })}
                  className="w-full bg-[#F5F8F6] border border-slate-300 rounded-md p-2 text-slate-800 font-medium focus:ring-1 focus:ring-[#0B6B3A]"
                >
                  <option value="Suggestion">Greening Suggestion / Idea</option>
                  <option value="Data Issue">Data Discrepancy / Ward Boundary</option>
                  <option value="Bug">Technical Glitch / Bug</option>
                  <option value="General Feedback">General Platform Feedback</option>
                </select>
              </div>
            </div>

            {/* Rating Stars */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Platform Utility Rating:
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="p-1 hover:scale-110 transition-transform focus:outline-none"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= formData.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-slate-500 font-mono-data ml-2">
                  ({formData.rating} of 5 Stars)
                </span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Feedback & Observations *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Share your local ground experience regarding heat waves, tree planting opportunities, or tool improvements..."
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
              <span>Submit Feedback</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
