// 🎯 Featured Projects Component for About Page

import React, { useState, useEffect } from 'react';

const FeaturedProjectsSection = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        // Use the Next.js proxy instead of calling the backend directly
        const response = await fetch('/api/proxy/content/projects');
        const data = await response.json();
        
        if (data.success) {
          // Filter only featured projects (field name is `featured`, not `isFeatured`)
          const featured = data.data.filter(project => project.featured);
          setFeaturedProjects(featured.slice(0, 3)); // Show top 3
        }
      } catch (error) {
        console.error('Error fetching featured projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  if (loading) return <div>Loading featured projects...</div>;

  return (
    <section className="featured-projects">
      <h3>Featured Projects</h3>
      <div className="featured-grid">
        {featuredProjects.map(project => (
          <div key={project._id} className="featured-card">
            <div className="project-badge">⭐ Featured</div>
            <h4>{project.title}</h4>
            <p>{project.description}</p>
            <div className="project-tech">
              {Array.isArray(project.technologies)
                ? project.technologies.map(tech => (
                    <span key={tech} className="tech-pill">{tech}</span>
                  ))
                : <span className="tech-pill">{project.technologies}</span>
              }
            </div>
            <div className="project-links">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  Live Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProjectsSection;