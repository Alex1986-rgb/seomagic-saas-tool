
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProject } from '@/hooks/useProject';
import CreateProjectButton from './CreateProjectButton';

const ProjectSelector = () => {
  const { projects, project, selectProject, fetchProjects } = useProject();

  const handleProjectChange = (projectId: string) => {
    selectProject(projectId);
  };

  return (
    <div className="flex items-center gap-2">
      <Select 
        value={project?.id || ''} 
        onValueChange={handleProjectChange}
        disabled={projects.length === 0}
      >
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Выберите проект" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {projects.map((proj) => (
              <SelectItem key={proj.id} value={proj.id}>
                {proj.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <CreateProjectButton onProjectCreated={fetchProjects} />
    </div>
  );
};

export default ProjectSelector;
