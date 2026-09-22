'use client';

import { useState, useEffect } from 'react';
import { Github } from 'lucide-react';

export function GitHubButton() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStars() {
      try {
        const res = await fetch(
          'https://api.github.com/repos/optionxi/optionxi-webapp-community'
        );
        if (!res.ok) throw new Error('Failed to fetch GitHub stars');
        const data = await res.json();
        setStars(data.stargazers_count);
      } catch (err) {
        console.error(err);
      }
    }
    fetchStars();
  }, []);

  const formatStars = (count: number) => {
    if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
    return count.toString();
  };

  return (
    <a
      href="https://github.com/optionxi/optionxi-webapp-community"
      target="_blank"
      rel="noopener noreferrer"
      className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border border-border/30 bg-background/50 hover:bg-accent hover:text-white transition-colors duration-200 text-sm font-medium"
    >
      <Github className="w-4 h-4" />
      <span>
        {stars !== null ? `${formatStars(stars)}` : '...'}
      </span>
    </a>
  );
}
