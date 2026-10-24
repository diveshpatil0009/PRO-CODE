import React, { useState } from 'react';
import {
  Database,
  Code2,
  Cpu,
  Layers,
  X,
  Copy,
  Check,
  Server,
  Terminal,
} from 'lucide-react';
import {
  PYTHON_FASTAPI_BACKEND_CODE,
  NEXTJS_SERVER_ROUTE_CODE,
} from '../../services/geminiService';

interface BackendArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POSTGRESQL_SCHEMA_SQL = `-- =============================================================================
-- PROCODE POSTGRESQL RELATIONAL DATABASE SCHEMA (MOCKED VIA FRONTEND STATE)
-- =============================================================================

CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('creator', 'reviewer', 'manager')),
    department VARCHAR(128) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE brand_rules (
    id VARCHAR(64) PRIMARY KEY,
    rule_code VARCHAR(32) UNIQUE NOT NULL,
    category VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    source_doc VARCHAR(255) NOT NULL,
    page_number INT,
    severity VARCHAR(16) NOT NULL,
    rule_excerpt TEXT,
    has_conflict BOOLEAN DEFAULT FALSE,
    conflict_resolution TEXT
);

CREATE TABLE living_facts (
    id VARCHAR(64) PRIMARY KEY,
    fact_code VARCHAR(32) UNIQUE NOT NULL,
    topic VARCHAR(255) NOT NULL,
    approved_statement TEXT NOT NULL,
    approved_statistic VARCHAR(128),
    source_reference TEXT NOT NULL,
    verified_by VARCHAR(255) NOT NULL,
    last_reviewed_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    is_expired BOOLEAN DEFAULT FALSE,
    status VARCHAR(32) NOT NULL DEFAULT 'active'
);

CREATE TABLE banned_words_dictionary (
    id VARCHAR(64) PRIMARY KEY,
    prohibited_term VARCHAR(128) NOT NULL,
    preferred_alternative VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    severity VARCHAR(16) NOT NULL,
    reason TEXT NOT NULL
);

CREATE TABLE content_submissions (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content_type VARCHAR(64) NOT NULL,
    original_text TEXT NOT NULL,
    current_text TEXT NOT NULL,
    creator_id VARCHAR(64) REFERENCES users(id),
    status VARCHAR(32) NOT NULL,
    active_version VARCHAR(16) NOT NULL,
    overall_compliance_score INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE compliance_findings (
    id VARCHAR(64) PRIMARY KEY,
    submission_id VARCHAR(64) REFERENCES content_submissions(id),
    rule_code VARCHAR(32) REFERENCES brand_rules(rule_code),
    severity VARCHAR(16) NOT NULL,
    title VARCHAR(255) NOT NULL,
    highlighted_text TEXT,
    suggested_correction TEXT NOT NULL,
    confidence_score NUMERIC(3, 2) NOT NULL,
    is_uncertain BOOLEAN DEFAULT FALSE,
    applied BOOLEAN DEFAULT FALSE
);

CREATE TABLE audit_trail_events (
    id VARCHAR(64) PRIMARY KEY,
    submission_id VARCHAR(64) REFERENCES content_submissions(id),
    actor_id VARCHAR(64) REFERENCES users(id),
    action VARCHAR(128) NOT NULL,
    version VARCHAR(16) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

export const BackendArchitectureModal: React.FC<BackendArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'sql' | 'python' | 'nextjs'>('python');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getActiveCode = () => {
    if (activeTab === 'sql') return POSTGRESQL_SCHEMA_SQL;
    if (activeTab === 'python') return PYTHON_FASTAPI_BACKEND_CODE;
    return NEXTJS_SERVER_ROUTE_CODE;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  System Architecture
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                  PostgreSQL & Python + Gemini 3.8
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Procode Backend & Database Specification
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between">
          <div className="flex bg-slate-800 p-1 rounded-xl text-xs font-medium space-x-1">
            <button
              onClick={() => setActiveTab('python')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
                activeTab === 'python'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Python / FastAPI (Gemini 3.8)</span>
            </button>

            <button
              onClick={() => setActiveTab('sql')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
                activeTab === 'sql'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>PostgreSQL Schema DDL</span>
            </button>

            <button
              onClick={() => setActiveTab('nextjs')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
                activeTab === 'nextjs'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Next.js API Handler</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code display */}
        <div className="flex-1 bg-slate-950 rounded-2xl p-4 border border-slate-800 overflow-y-auto font-mono text-[11px] leading-relaxed text-slate-300">
          <pre>{getActiveCode()}</pre>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>
            Simulated in the browser via TypeScript local PostgreSQL state persistence
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
