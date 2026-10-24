import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  MessageSquare,
  AlertCircle,
  Send,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  ContentSubmission,
  User,
  ReviewStatus,
  ReviewComment,
} from '../../types/governance';

interface HumanReviewModalProps {
  submission: ContentSubmission;
  currentUser: User;
  onUpdateStatus: (newStatus: ReviewStatus, commentText?: string) => void;
  onAddComment: (comment: string) => void;
  onProceedToFinalise: () => void;
}

export const HumanReviewModal: React.FC<HumanReviewModalProps> = ({
  submission,
  currentUser,
  onUpdateStatus,
  onAddComment,
  onProceedToFinalise,
}) => {
  const [commentInput, setCommentInput] = useState('');
  const [managerSignoffNote, setManagerSignoffNote] = useState(
    'I have verified all living facts, legal claims, and tone standards. Content approved for public release.'
  );

  const isManager = currentUser.role === 'manager';
  const isReviewer = currentUser.role === 'reviewer' || isManager;
  const isCreator = currentUser.role === 'creator';

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(commentInput.trim());
    setCommentInput('');
  };

  const handleApprove = () => {
    // Fire celebratory confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    onUpdateStatus('approved', managerSignoffNote);
  };

  const handleRequestChanges = () => {
    onUpdateStatus(
      'changes_requested',
      'Please revise highlighted terms and update living statistics.'
    );
  };

  const handleReject = () => {
    onUpdateStatus(
      'rejected',
      'Content does not meet core brand tone guidelines. Rework needed.'
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/30 border border-blue-500/30 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Editorial Review & Sign-Off
              </span>
              <span className="text-xs text-slate-400">
                Role-Gated Publication Governance
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">
              Human Review & Authorized Approval System
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              AI empowers and accelerates reviews, but final publication decisions remain
              strictly under authorized human editorial governance.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            {submission.status === 'approved' && (
              <button
                onClick={onProceedToFinalise}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition group"
              >
                <span>Proceed to Step 7: Finalise & Maintain</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Content Preview & Human Review Decision Console */}
        <div className="lg:col-span-7 space-y-6">
          {/* Content Document Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <div>
                <span className="text-slate-400">Title: </span>
                <strong className="text-slate-100">{submission.title}</strong>
              </div>
              <span
                className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                  submission.status === 'approved'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : submission.status === 'changes_requested'
                    ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                    : submission.status === 'rejected'
                    ? 'bg-red-500/20 text-red-300 border-red-500/30'
                    : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                }`}
              >
                Status: {submission.status.replace('_', ' ')}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {submission.currentText}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
              <span>Current Score: <strong className="text-emerald-400 font-mono">{submission.overallComplianceScore}%</strong></span>
              <span>Active Version: <strong className="text-blue-400 font-mono">{submission.activeVersion}</strong></span>
            </div>
          </div>

          {/* Reviewer Action Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  Authorized Governance Decision
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                Acting as: <strong className="text-slate-200">{currentUser.name}</strong> ({currentUser.role})
              </span>
            </div>

            {/* Role capability warning if creator */}
            {isCreator && (
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-start space-x-2">
                <Lock className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200">Creator View: </strong>
                  You can submit drafts and add feedback notes. Switch to <strong>Lead Compliance Reviewer</strong> or <strong>Brand Governance Director</strong> in the top header role selector to grant final approvals.
                </div>
              </div>
            )}

            {/* Directive note input */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Official Sign-Off / Reviewer Directive:
              </label>
              <textarea
                rows={2}
                value={managerSignoffNote}
                onChange={(e) => setManagerSignoffNote(e.target.value)}
                disabled={!isReviewer}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleApprove}
                disabled={!isReviewer}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-2 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Certify for Publishing</span>
              </button>

              <button
                onClick={handleRequestChanges}
                disabled={!isReviewer}
                className="py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-1.5 transition"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Request Changes</span>
              </button>

              <button
                onClick={handleReject}
                disabled={!isReviewer}
                className="py-2.5 px-4 rounded-xl bg-red-600/80 hover:bg-red-600 disabled:opacity-40 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-1.5 transition"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Editorial Comment Log & Feedback Thread */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>Editorial Review Thread</span>
                </h3>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                  {submission.reviewComments.length} Notes
                </span>
              </div>

              {/* Messages List */}
              <div className="space-y-3 mt-3 max-h-96 overflow-y-auto pr-1">
                {submission.reviewComments.map((comm) => (
                  <div
                    key={comm.id}
                    className="p-3 rounded-xl bg-slate-800/60 border border-slate-800 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <strong className="text-slate-200">{comm.authorName}</strong>
                        <span className="text-[10px] text-blue-400 uppercase font-mono">
                          ({comm.authorRole})
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {comm.timestamp.split('T')[1]?.slice(0, 5) || 'Just now'}
                      </span>
                    </div>

                    <p className="text-slate-300 leading-relaxed">{comm.comment}</p>

                    {comm.actionTaken && (
                      <span className="inline-block text-[10px] font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        Action: {comm.actionTaken.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                ))}

                {submission.reviewComments.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No comments logged yet. Add instructions or approvals below.
                  </div>
                )}
              </div>
            </div>

            {/* Comment Input */}
            <form onSubmit={handleSendComment} className="mt-4 pt-3 border-t border-slate-800 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add editorial review note or directive..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
