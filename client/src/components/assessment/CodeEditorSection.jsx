import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import {
  Play,
  Send,
  Code2,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  Loader2,
  FileCode,
} from 'lucide-react';

const LANGUAGE_MAP = {
  python: 'python',
  javascript: 'javascript',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
};

export const CodeEditorSection = ({
  codingQuestion,
  onRunCode,
  onSubmitCode,
  submitting,
}) => {
  const allowedLanguages = codingQuestion.allowedLanguages || ['python', 'java', 'c', 'cpp', 'javascript'];
  const [selectedLanguage, setSelectedLanguage] = useState(allowedLanguages[0] || 'python');
  
  // Starter code per language
  const [code, setCode] = useState(() => {
    return codingQuestion.starterCode?.[selectedLanguage] || '// Write your solution here\n';
  });

  const [activeTab, setActiveTab] = useState('problem'); // 'problem' or 'testcases'
  const [runResults, setRunResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState('');

  const handleLanguageChange = (newLang) => {
    setSelectedLanguage(newLang);
    const starter = codingQuestion.starterCode?.[newLang] || '// Write your solution here\n';
    setCode(starter);
  };

  const handleRun = async () => {
    setRunning(true);
    setRunError('');
    setRunResults(null);
    setActiveTab('testcases');

    try {
      const res = await onRunCode({
        codingQuestionId: codingQuestion._id,
        language: selectedLanguage,
        code,
      });
      setRunResults(res);
    } catch (err) {
      setRunError(err.message || 'Error executing test cases.');
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = () => {
    onSubmitCode({
      codingQuestionId: codingQuestion._id,
      language: selectedLanguage,
      code,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 flex-1">
      {/* Left Column: Problem Statement & Sample Cases */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm overflow-y-auto max-h-[750px]">
        <div className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-blue-600" />
              <span>Coding Challenge</span>
            </span>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {codingQuestion.topic || 'Algorithms'}
            </span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {codingQuestion.title}
            </h2>
            <div className="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {codingQuestion.problemStatement}
            </div>
          </div>

          {codingQuestion.constraints && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Constraints
              </span>
              <pre className="text-xs font-mono text-slate-600 whitespace-pre-wrap">
                {codingQuestion.constraints}
              </pre>
            </div>
          )}

          {/* Sample Examples */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Sample Examples
            </span>
            {(codingQuestion.sampleTestCases || []).map((tc, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono space-y-1.5">
                <div className="text-[11px] text-slate-500 font-sans font-semibold">Example {idx + 1}:</div>
                <div>
                  <span className="text-slate-500 font-sans font-semibold">Input: </span>
                  <span className="text-slate-900">{tc.input}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-sans font-semibold">Output: </span>
                  <span className="text-emerald-700 font-bold">{tc.expectedOutput}</span>
                </div>
                {tc.explanation && (
                  <div className="text-[11px] text-slate-500 font-sans mt-1">
                    <span className="font-semibold">Explanation: </span>
                    {tc.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
          Your solution will be evaluated against both sample and hidden edge-case test suites upon submission.
        </div>
      </div>

      {/* Right Column: Code Editor + Runner Output */}
      <div className="lg:col-span-7 flex flex-col space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Editor Header */}
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-blue-600" />
                <span>Monaco Code Editor</span>
              </span>

              {/* Language Dropdown */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span>Language:</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {allowedLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRun}
                disabled={running || submitting}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {running ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-blue-600" />
                )}
                <span>Run Code</span>
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || running}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Submit Code</span>
              </button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="h-[460px] border-b border-slate-200">
            <Editor
              height="100%"
              language={LANGUAGE_MAP[selectedLanguage] || 'javascript'}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-light"
              options={{
                fontSize: 13,
                fontFamily: 'JetBrains Mono, monospace',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                automaticLayout: true,
                tabSize: 4,
                lineNumbers: 'on',
                renderLineHighlight: 'all',
              }}
            />
          </div>

          {/* Output Console / Test Results Panel */}
          <div className="p-4 bg-slate-50 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                <span>Test Execution Results</span>
              </span>
              {runResults && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    runResults.allSamplePassed
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}
                >
                  {runResults.sampleTestsPassed} / {runResults.totalSampleTests} Tests Passed
                </span>
              )}
            </div>

            {running && (
              <div className="flex items-center gap-2 text-slate-600 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>Running sandboxed test suite...</span>
              </div>
            )}

            {runError && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-mono text-xs">
                {runError}
              </div>
            )}

            {!running && !runResults && !runError && (
              <div className="text-slate-500 py-3 text-center text-xs">
                Click <strong>"Run Code"</strong> to validate your solution against sample inputs.
              </div>
            )}

            {runResults && (
              <div className="space-y-2 mt-2">
                {(runResults.sampleResults || []).map((res, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border text-xs font-mono ${
                      res.passed
                        ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                        : 'bg-rose-50/50 border-rose-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold font-sans">Sample Case {i + 1}</span>
                      {res.passed ? (
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-700 font-semibold text-[11px]">
                          <XCircle className="w-3.5 h-3.5" /> Failed
                        </span>
                      )}
                    </div>
                    <div>Input: <span className="text-slate-600">{res.input}</span></div>
                    <div>Expected: <span className="text-emerald-700 font-bold">{res.expectedOutput}</span></div>
                    <div>Actual: <span className={res.passed ? 'text-slate-900' : 'text-rose-700 font-bold'}>{res.actualOutput}</span></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
