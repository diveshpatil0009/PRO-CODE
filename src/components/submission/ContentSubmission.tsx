import React, { useState } from 'react';
import {
  PenTool,
  Upload,
  Globe2,
  Users,
  Image as ImageIcon,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { ContentSubmission as ContentSubmissionType, User } from '../../types/governance';

interface ContentSubmissionProps {
  onSubmit: (data: {
    title: string;
    content: string;
    contentType: ContentSubmissionType['contentType'];
    targetAudience: string;
    targetLanguage: string;
    imageUrl?: string;
  }) => void;
  currentUser: User;
}

const PRESET_SCENARIOS = [
  {
    name: '🔴 High-Risk Press Release (With Violations)',
    badge: 'Contains 6 Violations & Contradiction',
    title: 'Q3 Enterprise Governance Launch Press Release',
    contentType: 'press_release' as const,
    targetAudience: 'Enterprise CMOs, Brand Directors, Communications Teams',
    targetLanguage: 'Spanish (ES)',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
    content: `Headline: Procode Enterprise Governance is Here

We are excited to unveil our disruptive magic tool that makes content review completely infallible. With over 1.2M active users worldwide, Procode offers the most cheap pricing in the brand compliance sector.

Our new engine provides guaranteed 100% brand consistency across every marketing email, blog, and social post. Say goodbye to your legacy nightmare manual workflows and let our autonomous AI make the final calls for your organization.`,
  },
  {
    name: '🟡 Multilingual Global Campaign Copy',
    badge: 'Cross-Language Translation Shift',
    title: 'Procode Global Security Campaign - EU & LATAM',
    contentType: 'marketing_ad' as const,
    targetAudience: 'Global Compliance Officers & Data Protection Leads',
    targetLanguage: 'Spanish (ES)',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    content: `Procode delivers unified brand governance safeguards for multinational enterprises.

With our living fact sheet and verified SLA of 99.95%, teams eliminate translation discrepancies before localized assets are launched across Latin America and Europe.`,
  },
  {
    name: '🟢 High Compliance Benchmark Draft',
    badge: 'Aligned with Living Facts & Tone',
    title: 'Procode Enterprise Cloud Governance Update',
    contentType: 'blog_post' as const,
    targetAudience: 'Product Marketing & Corporate Communications',
    targetLanguage: 'English (US)',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    content: `Headline: Procode Unveils Enterprise Governance Platform

Today we are proud to introduce our verified brand compliance engine, built to support editorial teams with human-in-the-loop assurance.

Trusted by over 4.8M active creators and backed by our enterprise 99.95% availability SLA, Procode enables organizations to maintain consistent messaging with budget-friendly starter options.`,
  },
];

export const ContentSubmission: React.FC<ContentSubmissionProps> = ({
  onSubmit,
  currentUser,
}) => {
  const [title, setTitle] = useState(PRESET_SCENARIOS[0].title);
  const [content, setContent] = useState(PRESET_SCENARIOS[0].content);
  const [contentType, setContentType] = useState<ContentSubmissionType['contentType']>(
    PRESET_SCENARIOS[0].contentType
  );
  const [targetAudience, setTargetAudience] = useState(PRESET_SCENARIOS[0].targetAudience);
  const [targetLanguage, setTargetLanguage] = useState(PRESET_SCENARIOS[0].targetLanguage);
  const [imageUrl, setImageUrl] = useState<string | undefined>(PRESET_SCENARIOS[0].imageUrl);
  const [imageFileName, setImageFileName] = useState<string>('campaign_hero_banner.png');

  const handleApplyPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setTitle(preset.title);
    setContent(preset.content);
    setContentType(preset.contentType);
    setTargetAudience(preset.targetAudience);
    setTargetLanguage(preset.targetLanguage);
    setImageUrl(preset.imageUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSubmit({
      title,
      content,
      contentType,
      targetAudience,
      targetLanguage,
      imageUrl,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/30 border border-blue-500/30 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Step 3 of 7
              </span>
              <span className="text-xs text-slate-400">
                Submit Content for Review
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">
              Content Submission & Pre-Flight Checks
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Creators upload text, press releases, marketing copy, and visual creative assets.
              Select target channels, audience, and languages for automated multi-dimensional governance.
            </p>
          </div>

          <div className="text-xs text-slate-400 flex items-center space-x-2 self-start md:self-auto bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
            <span>Author:</span>
            <span className="font-semibold text-slate-200">{currentUser.name}</span>
            <span className="text-blue-400">({currentUser.role})</span>
          </div>
        </div>
      </div>

      {/* Quick Load Test Scenarios */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>QUICK LOAD REALISTIC EVALUATION SCENARIOS</span>
          <span className="text-slate-400">Click to autofill content form</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESET_SCENARIOS.map((preset, idx) => (
            <div
              key={idx}
              onClick={() => handleApplyPreset(preset)}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/60 cursor-pointer transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition">
                    {preset.name}
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 block mb-2">
                  {preset.badge}
                </span>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {preset.content.split('\n')[2] || preset.content}
                </p>
              </div>

              <div className="text-[10px] text-blue-400 mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                <span>Load Scenario</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Content Type */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Content Format / Channel
            </label>
            <select
              value={contentType}
              onChange={(e) =>
                setContentType(e.target.value as ContentSubmissionType['contentType'])
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
            >
              <option value="press_release">Press Release / News Announcement</option>
              <option value="marketing_ad">Marketing Copy / Ad Creative</option>
              <option value="social_copy">Social Media Post</option>
              <option value="blog_post">Thought Leadership Blog</option>
              <option value="technical_doc">Technical Documentation & API Guide</option>
            </select>
          </div>

          {/* Target Audience */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center space-x-1">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Target Audience</span>
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Enterprise CMOs, IT Directors"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
              required
            />
          </div>

          {/* Target Language (Cross-Language Guardian) */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center space-x-1">
              <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Target Language (Multilingual Check)</span>
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
            >
              <option value="English (US)">English (US) - Primary</option>
              <option value="Spanish (ES)">Spanish (ES) - European & Latin America</option>
              <option value="French (FR)">French (FR) - European</option>
              <option value="German (DE)">German (DE) - DACH Region</option>
              <option value="Hindi (IN)">Hindi (IN) - India Regional</option>
              <option value="Japanese (JA)">Japanese (JA) - APAC</option>
            </select>
          </div>
        </div>

        {/* Content Title */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Content Headline / Working Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q3 Enterprise Governance Launch Press Release"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 font-medium"
            required
          />
        </div>

        {/* Body Text Area */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Content Draft (Text, Markdown, or Copy)</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              {content.length} characters • {content.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your content draft here for automated brand governance analysis..."
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        {/* FEATURE #7: Image Asset Drag-and-Drop Dropzone */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center space-x-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>Image & Visual Compliance Asset (Feature #7: Image Asset Checker)</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 border border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl p-4 bg-slate-800/30 flex items-center space-x-4">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Creative asset"
                  className="w-16 h-16 rounded-lg object-cover ring-1 ring-slate-700"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
              <div className="flex-1 text-xs">
                <div className="font-semibold text-slate-200">{imageFileName}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Checks logo clear-space, contrast ratio, and brand color palette (#2563EB, #0F172A)
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl(
                        'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80'
                      );
                      setImageFileName('procode_enterprise_campaign_hero.png');
                    }}
                    className="text-[11px] text-blue-400 hover:underline"
                  >
                    Select Official Procode Hero Image
                  </button>
                  <span className="text-slate-600">•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl(
                        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80'
                      );
                      setImageFileName('global_team_announcement.png');
                    }}
                    className="text-[11px] text-blue-400 hover:underline"
                  >
                    Select Team Banner
                  </button>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-[11px] text-slate-300 space-y-1">
              <div className="font-semibold text-slate-200 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pre-Flight Checks Enabled:</span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                <li>Banned word dictionary lookup</li>
                <li>Living fact expiry radar validation</li>
                <li>Tone & voice confidence rating</li>
                <li>Contradictory rules detection</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            Automated compliance scan takes ~1.5s using hybrid rule-matching & Gemini reasoning.
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-500/25 flex items-center space-x-2 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Run Intelligent Brand Compliance Analysis</span>
          </button>
        </div>
      </form>
    </div>
  );
};
