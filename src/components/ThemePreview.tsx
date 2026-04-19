import React from 'react';
import { PortfolioConfig } from '../types';
import { motion } from 'motion/react';
import { Github, ExternalLink, Star } from 'lucide-react';

interface Props {
  config: PortfolioConfig;
}

export const ThemePreview: React.FC<Props> = ({ config }) => {
  const renderTheme = () => {
    switch (config.themeId) {
      case 'dark':
        return <DarkTheme config={config} />;
      case 'glassmorphism':
        return <GlassTheme config={config} />;
      case 'brutalist':
        return <BrutalistTheme config={config} />;
      default:
        return <MinimalTheme config={config} />;
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      {renderTheme()}
    </div>
  );
};

const MinimalTheme: React.FC<Props> = ({ config }) => (
  <div className="max-w-4xl mx-auto py-20 px-6 font-sans">
    <header className="mb-16">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-4"
      >
        {config.displayName}
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl text-zinc-400 max-w-2xl"
      >
        {config.bio}
      </motion.p>
    </header>

    <section>
      <h2 className="text-sm font-mono uppercase tracking-widest text-zinc-500 mb-8">Selected Projects</h2>
      <div className="grid gap-12">
        {config.projects.map((project, idx) => (
          <motion.div 
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="group"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-2xl font-semibold group-hover:text-zinc-300 transition-colors">{project.title}</h3>
              <div className="flex gap-4">
                <a href={project.repoUrl} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white"><Github size={20} /></a>
                {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white"><ExternalLink size={20} /></a>}
              </div>
            </div>
            <p className="text-zinc-400 mb-4">{project.description}</p>
            <div className="flex gap-2 flex-wrap">
              {project.techStack.map(tech => (
                <span key={tech} className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 rounded">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  </div>
);

const DarkTheme: React.FC<Props> = ({ config }) => (
  <div className="min-h-full bg-zinc-950 text-white p-8 md:p-16">
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="md:w-1/3 sticky top-16">
          <h1 className="text-5xl font-black tracking-tighter mb-4">{config.displayName}</h1>
          <p className="text-zinc-500 font-mono text-sm mb-6 uppercase tracking-widest leading-relaxed">
            {config.tagline}
          </p>
          <div className="h-1 w-20 bg-blue-600 mb-8" />
          <p className="text-zinc-400 leading-relaxed mb-8">
            {config.bio}
          </p>
          <div className="flex gap-4">
            <a href={`https://github.com/${config.githubUsername}`} className="p-3 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
              <Github size={20} />
            </a>
          </div>
        </div>
        <div className="md:w-2/3 grid gap-6">
          {config.projects.map((project) => (
            <div key={project.id} className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <div className="flex gap-3">
                   <a href={project.repoUrl}><Github size={18} /></a>
                   {project.demoUrl && <a href={project.demoUrl}><ExternalLink size={18} /></a>}
                </div>
              </div>
              <p className="text-zinc-400 text-sm mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map(t => <span key={t} className="text-[10px] bg-zinc-800 px-2 py-1 rounded-md text-zinc-300 uppercase tracking-wider">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const GlassTheme: React.FC<Props> = ({ config }) => (
  <div className="min-h-full bg-gradient-to-br from-indigo-900 via-zinc-900 to-black p-6 md:p-20 relative overflow-hidden">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
    
    <div className="max-w-4xl mx-auto relative z-10">
      <header className="glass p-10 rounded-3xl mb-10">
        <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500 tracking-tight">
          {config.displayName}
        </h1>
        <p className="text-2xl text-zinc-300 font-light">{config.tagline}</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {config.projects.map(project => (
          <div key={project.id} className="glass p-6 rounded-2xl group hover:bg-white/10 transition-all">
             <div className="flex justify-between items-start mb-4">
               <h3 className="text-lg font-semibold">{project.title}</h3>
               <ArrowRightUp className="text-zinc-500 group-hover:text-white transition-colors" size={20} />
             </div>
             <p className="text-zinc-400 text-sm mb-6 line-clamp-3">{project.description}</p>
             <div className="flex gap-2 flex-wrap">
               {project.techStack.map(t => <span key={t} className="text-[10px] py-1 px-2 border border-white/10 rounded-full bg-white/5">{t}</span>)}
             </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const BrutalistTheme: React.FC<Props> = ({ config }) => (
  <div className="min-h-full bg-yellow-400 text-black p-8 font-mono">
    <header className="border-4 border-black p-8 mb-12 bg-white neo-brutal">
      <h1 className="text-7xl font-black uppercase mb-4 leading-[0.8]">{config.displayName}</h1>
      <p className="text-2xl font-bold border-t-4 border-black pt-4 uppercase">{config.tagline}</p>
    </header>

    <div className="grid md:grid-cols-3 gap-8">
      {config.projects.map(project => (
        <div key={project.id} className="border-4 border-black bg-white p-6 neo-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
          <h3 className="text-2xl font-black uppercase mb-4">{project.title}</h3>
          <p className="mb-6 font-bold text-sm leading-snug">{project.description}</p>
          <div className="flex gap-4">
             <Github size={24} />
             <ExternalLink size={24} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ArrowRightUp = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
);
