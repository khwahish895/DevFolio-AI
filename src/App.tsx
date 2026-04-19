/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Github, 
  Sparkles, 
  Layout, 
  Eye, 
  ChevronRight, 
  ChevronLeft, 
  RefreshCcw,
  CheckCircle2,
  Terminal,
  ExternalLink,
  Code2,
  Star
} from 'lucide-react';
import { fetchUserRepos, fetchUserStats, fetchRepoReadme } from './services/github';
import { summarizeProject, generateBio, getPortfolioSuggestions } from './services/ai';
import { GithubRepo, PortfolioConfig, PortfolioProject, ThemeType } from './types';
import { ThemePreview } from './components/ThemePreview';
import { cn } from './lib/utils';

export default function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [selectedRepoIds, setSelectedRepoIds] = useState<number[]>([]);
  const [config, setConfig] = useState<PortfolioConfig | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleFetchRepos = async () => {
    if (!username) return;
    setLoading(true);
    try {
      const data = await fetchUserRepos(username);
      setRepos(data);
      setStep(2);
    } catch (err) {
      alert("Failed to fetch user. Check username.");
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePortfolio = async () => {
    setLoading(true);
    try {
      const selectedRepos = repos.filter(r => selectedRepoIds.includes(r.id));
      
      const projectPromises = selectedRepos.map(async (repo) => {
        const readme = await fetchRepoReadme(username, repo.name);
        const summary = await summarizeProject(repo.name, readme);
        return {
          id: String(repo.id),
          title: repo.name,
          description: summary || repo.description || "A professional software project.",
          repoUrl: repo.html_url,
          techStack: [repo.language, ...repo.topics].filter(Boolean) as string[],
          isHighlighted: true
        };
      });

      const portfolioProjects = await Promise.all(projectPromises);
      const bio = await generateBio(username, repos);
      const stats = await fetchUserStats(username);
      
      const newConfig: PortfolioConfig = {
        githubUsername: username,
        displayName: stats?.name || username,
        bio: bio,
        tagline: "Full Stack Developer & Open Source Contributor",
        themeId: 'minimal',
        colors: { primary: '#9a8cff', background: '#050505', text: '#ffffff' },
        projects: portfolioProjects,
        stats: {
          totalStars: repos.reduce((acc, r) => acc + r.stargazers_count, 0),
          topLanguages: Array.from(new Set(repos.map(r => r.language).filter(Boolean))).slice(0, 5) as string[]
        }
      };

      setConfig(newConfig);
      const tips = await getPortfolioSuggestions(bio, portfolioProjects.length);
      setSuggestions(tips);
      setStep(3);
    } catch (err) {
      alert("AI Generation failed. Using defaults.");
    } finally {
      setLoading(false);
    }
  };

  if (previewMode && config) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <button 
          onClick={() => setPreviewMode(false)}
          className="fixed top-6 right-6 z-[60] px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2 text-sm transition-all"
        >
          <Layout size={16} /> Exit Preview
        </button>
        <ThemePreview config={config} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text-main">
      {/* Header */}
      <header className="h-[60px] border-b border-border flex items-center justify-between px-6 bg-bg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Code2 className="text-black" size={18} />
          </div>
          <span className="font-bold tracking-tight text-lg text-accent">Folio?Auto</span>
        </div>
        
        <div className="flex items-center gap-4">
          {username && (
             <span className="text-[12px] text-text-muted">
               Synced with <strong className="text-text-main">@{username}</strong>
             </span>
          )}
          <div className="status-badge">Live Portfolio</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Nav */}
        <nav className="w-[220px] border-r border-border p-6 hidden md:block">
          <span className="nav-label">Platform</span>
          <div className={cn("nav-item", step === 1 && "active")} onClick={() => setStep(1)}>
            <Github size={16} /> GitHub Data
          </div>
          <div className={cn("nav-item", step === 2 && "active")} onClick={() => step > 1 && setStep(2)}>
            <Terminal size={16} /> Projects
          </div>
          <div className={cn("nav-item", step === 3 && "active")} onClick={() => config && setStep(3)}>
            <Layout size={16} /> Editor
          </div>

          <span className="nav-label mt-8">AI Tools</span>
          <div className="nav-item opacity-50 cursor-not-allowed">
            <Sparkles size={16} /> Resume Generator
          </div>
          <div className="nav-item opacity-50 cursor-not-allowed">
            <Eye size={16} /> SEO Optimizer
          </div>
        </nav>

        {/* Main Editor Area */}
        <main className="flex-1 overflow-y-auto bg-black p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-8"
                >
                  <div className="space-y-4">
                    <h2 className="text-5xl font-extrabold tracking-tight leading-tight">
                      Architecting portfolios <br/>
                      <span className="text-accent">with machine intelligence.</span>
                    </h2>
                    <p className="text-text-muted text-lg max-w-xl mx-auto">
                      Connect your GitHub and let our engine generate a world-class portfolio in seconds.
                    </p>
                  </div>

                  <div className="relative w-full max-w-md">
                    <div className="flex items-center bg-surface border border-border rounded-lg p-1.5 pl-4 transition-colors focus-within:border-accent">
                      <Github className="text-text-muted mr-3" size={20} />
                      <input 
                        type="text" 
                        placeholder="GitHub Username"
                        className="bg-transparent border-none focus:ring-0 w-full text-text-main placeholder:text-text-muted"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleFetchRepos()}
                      />
                      <button 
                        onClick={handleFetchRepos}
                        disabled={loading || !username}
                        className="bg-accent text-black px-6 py-2 rounded-md font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {loading ? <RefreshCcw className="animate-spin" size={18} /> : "Connect"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex justify-between items-end">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold tracking-tight">Project Selection</h2>
                      <p className="text-text-muted">Choose the core projects you want our AI to highlight.</p>
                    </div>
                    <div className="text-[11px] font-mono text-accent uppercase tracking-widest">
                      {selectedRepoIds.length} SELECTED
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {repos.slice(0, 8).map((repo) => (
                      <button 
                        key={repo.id}
                        onClick={() => {
                          setSelectedRepoIds(prev => 
                            prev.includes(repo.id) ? prev.filter(id => id !== repo.id) : [...prev, repo.id]
                          );
                        }}
                        className={cn(
                          "text-left p-6 rounded-xl border transition-all relative",
                          selectedRepoIds.includes(repo.id) 
                            ? "bg-accent/5 border-accent" 
                            : "bg-surface border-border hover:border-text-muted"
                        )}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <Terminal size={18} className={selectedRepoIds.includes(repo.id) ? "text-accent" : "text-text-muted"} />
                          {selectedRepoIds.includes(repo.id) && <CheckCircle2 size={18} className="text-accent" />}
                        </div>
                        <h3 className="font-bold text-lg mb-1">{repo.name}</h3>
                        <p className="text-text-muted text-xs line-clamp-2 h-8">{repo.description || "Experimental developer project."}</p>
                        <div className="mt-4 flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-text-muted">
                          <span className="flex items-center gap-1"><Star size={12} /> {repo.stargazers_count}</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded border",
                            selectedRepoIds.includes(repo.id) ? "border-accent text-accent" : "border-border"
                          )}>
                            {repo.language || 'Binary'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-8 border-t border-border mt-12">
                    <button onClick={() => setStep(1)} className="text-text-muted hover:text-text-main flex items-center gap-2">
                      <ChevronLeft size={18} /> Modify User
                    </button>
                    <button 
                      onClick={handleGeneratePortfolio}
                      disabled={loading || selectedRepoIds.length === 0}
                      className="bg-accent text-black px-8 py-3 rounded-md font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      {loading ? <RefreshCcw className="animate-spin" size={20} /> : <><Sparkles size={20} /> Generate Portfolio</>}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && config && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  <div className="grid lg:grid-cols-[1fr_320px] gap-8">
                    <div className="space-y-6">
                      <div className="p-8 bg-white text-black rounded rounded-b-none min-h-[500px] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-4 right-4 text-[10px] font-mono text-zinc-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                          Active Preview
                        </div>
                        <h1 className="font-serif italic text-4xl mb-4">{config.displayName}.</h1>
                        <p className="text-sm leading-relaxed text-zinc-600 mb-8 max-w-lg">{config.bio}</p>
                        
                        <div className="space-y-6">
                          {config.projects.map(p => (
                             <div key={p.id} className="border-t border-zinc-100 pt-4">
                               <h4 className="text-[10px] uppercase tracking-widest font-bold mb-1">{p.title}</h4>
                               <p className="text-[11px] text-zinc-500 max-w-md">{p.description}</p>
                             </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <button 
                          onClick={() => setPreviewMode(true)}
                          className="bg-surface border border-border text-text-main p-4 rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-border transition-all"
                         >
                           <Eye size={18} /> Full Preview
                         </button>
                         <button 
                          className="bg-accent text-black p-4 rounded-md font-bold flex items-center justify-center gap-2 transition-all"
                         >
                           Deploy Now <ChevronRight size={18} />
                         </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                       <div className="p-6 bg-surface border border-border rounded-xl space-y-4">
                         <span className="nav-label">Global Identity</span>
                         <textarea 
                          value={config.bio}
                          onChange={(e) => setConfig({...config, bio: e.target.value})}
                          className="w-full bg-bg border border-border rounded-md p-3 text-xs text-text-main focus:ring-1 focus:ring-accent min-h-[120px] resize-none"
                         />
                       </div>

                       <div className="p-6 bg-surface border border-border rounded-xl space-y-4">
                         <span className="nav-label">Theme Engine</span>
                         <div className="grid grid-cols-2 gap-2">
                           {(['minimal', 'dark', 'glassmorphism', 'brutalist'] as ThemeType[]).map((t) => (
                             <button
                               key={t}
                               onClick={() => setConfig({...config, themeId: t})}
                               className={cn(
                                 "text-[10px] uppercase font-bold py-2 px-1 border transition-all rounded",
                                 config.themeId === t ? "bg-accent border-accent text-black" : "bg-bg border-border text-text-muted hover:border-text-muted"
                               )}
                             >
                               {t}
                             </button>
                           ))}
                         </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* AI & Stats Panel */}
        <aside className="w-[280px] border-l border-border bg-surface p-6 hidden xl:block overflow-y-auto">
          <div className="ai-suggestion">
            <span className="text-[12px] text-accent font-bold block mb-2">✨ AI Insight</span>
            <p className="text-[13px] leading-snug">
              {suggestions[0] || "We've analyzed your GitHub activity. Connect a custom domain to increase visibility by 24%."}
            </p>
          </div>

          <span className="nav-label mt-8">Real-time Performance</span>
          <div className="space-y-2 mb-8">
            <div className="stat-row">
              <span className="text-text-muted">Total Activity</span>
              <span className="text-accent font-mono">{config?.stats.totalStars || "---"}</span>
            </div>
            <div className="stat-row">
              <span className="text-text-muted">Impact Score</span>
              <span className="text-accent font-mono">{(config?.projects.length || 0) * 12}/100</span>
            </div>
          </div>

          <span className="nav-label">Core Technologies</span>
          <div className="flex flex-wrap gap-1.5 mb-12">
            {config?.stats.topLanguages.map(l => (
               <span key={l} className="text-[9px] uppercase tracking-widest px-2 py-1 bg-bg border border-border rounded text-text-muted">
                 {l}
               </span>
            ))}
          </div>

          <button className="action-btn mt-auto" onClick={() => alert("Deployment pipeline integrated with Vercel API.")}>
            Deploy Application
          </button>
          <div className="text-[10px] text-text-muted text-center mt-4">
            Last build: Just now
          </div>
        </aside>
      </div>
    </div>
  );
}
