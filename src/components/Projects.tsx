import SectionHeader from './SectionHeader';
import ProjectCard from './ProjectCard';
import { projects } from '../data/projects';

export default function Projects() {
  return (
    <section id="projects" className="py-32 px-6 max-w-5xl mx-auto">
      <div className="mb-16">
        <SectionHeader
          label="Projetos"
          title="Infraestrutura em prática"
          subtitle="Cada projeto é uma peça de engenharia documentada — com arquitetura, stack e status visíveis."
        />
      </div>

      <div className="space-y-4">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
