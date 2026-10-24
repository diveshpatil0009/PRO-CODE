/**
 * Procode Brand Governance - AI & Gemini Engine Orchestration Layer
 * 
 * Provides:
 * 1. Client-safe AI structured output orchestration.
 * 2. Documentation of the exact Python / FastAPI and Next.js / Express backend route.
 */

export const PYTHON_FASTAPI_BACKEND_CODE = `# ==============================================================================
# PROCODE BRAND GOVERNANCE PLATFORM - PYTHON / FASTAPI BACKEND ORCHESTRATION
# Architecture: Cloud Run + FastAPI + Gemini 3.8 Flash
# ==============================================================================

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
import google.genai as genai
from google.genai import types
import os

app = FastAPI(title="Procode AI Brand Governance Engine", version="1.0.0")

# Setup Gemini Client (gemini-3.8-flash for high-speed semantic governance)
client = genai.Client(
    api_key=os.environ.get("GEMINI_API_KEY"),
    http_options={"headers": {"User-Agent": "aistudio-build"}}
)

class ComplianceFindingSchema(BaseModel):
    rule_code: str = Field(description="Referenced brand rule code e.g. RULE-TERM-03")
    severity: str = Field(description="'critical' | 'high' | 'medium' | 'low'")
    highlighted_text: str = Field(description="Exact snippet in content that triggers issue")
    supporting_evidence: str = Field(description="Excerpt from approved brand guidelines")
    suggested_correction: str = Field(description="Contextual revised wording preserving intent")
    explanation: str = Field(description="Clear explanation of why this was flagged")
    confidence_score: float = Field(description="Confidence between 0.0 and 1.0")
    is_uncertain: bool = Field(description="Flag True if ambiguous and requires human review")

class BrandAnalysisResponse(BaseModel):
    overall_compliance_score: int
    detected_tone: str
    tone_match_percentage: int
    findings: List[ComplianceFindingSchema]
    is_conflicting_rule_detected: bool

@app.post("/api/v1/compliance/analyze", response_model=BrandAnalysisResponse)
async def analyze_brand_compliance(payload: dict):
    """
    Orchestrates deterministic rule verification and Gemini 3.8 Flash
    semantic reasoning with strict Pydantic JSON schema output.
    """
    content = payload.get("content", "")
    guidelines_context = payload.get("guidelines_context", "")
    living_facts = payload.get("living_facts", "")

    prompt = f"""
    You are the Procode Brand Governance Engine. Analyze the following content
    against the provided brand guidelines and living facts.
    
    LIVING FACTS (SOURCE OF TRUTH):
    {living_facts}
    
    BRAND GUIDELINES:
    {guidelines_context}
    
    SUBMITTED CONTENT:
    {content}
    
    Check for:
    1. Prohibited terminology and tone mismatches.
    2. Outdated facts or statistics passing review expiry dates.
    3. Contradictory rules requiring human clarification.
    """

    response = client.models.generate_content(
        model="gemini-3.8-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=BrandAnalysisResponse,
            temperature=0.2,
        ),
    )
    return response.parsed
`;

export const NEXTJS_SERVER_ROUTE_CODE = `// ==============================================================================
// PROCODE BRAND GOVERNANCE - NEXT.JS / EXPRESS SERVER-SIDE ROUTE HANDLER
// ==============================================================================

import { GoogleGenAI, Type } from "@google/genai";
import { Request, Response } from "express";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: { 'User-Agent': 'aistudio-build' }
  }
});

export async function handleBrandAnalysis(req: Request, res: Response) {
  try {
    const { content, guidelines, facts } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: \`Analyze brand governance compliance for: \${content}\`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallComplianceScore: { type: Type.INTEGER },
            detectedTone: { type: Type.STRING },
            findings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  ruleCode: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  suggestedCorrection: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  confidenceScore: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    return res.json(JSON.parse(response.text || '{}'));
  } catch (error) {
    return res.status(500).json({ error: "Failed to run Gemini governance analysis" });
  }
}
`;
