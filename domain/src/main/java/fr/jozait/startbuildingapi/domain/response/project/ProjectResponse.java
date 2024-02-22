package fr.jozait.startbuildingapi.domain.response.project;

import fr.jozait.startbuildingapi.domain.model.project.Project;
import fr.jozait.startbuildingapi.domain.model.project.ProjectKnowledgeBase;

public class ProjectResponse {
    private Project project;
    private ProjectKnowledgeBase knowledgeBase;

    public ProjectResponse() {
    }

    public ProjectResponse(Project project, ProjectKnowledgeBase knowledgeBase) {
        this.project = project;
        this.knowledgeBase = knowledgeBase;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public ProjectKnowledgeBase getKnowledgeBase() {
        return knowledgeBase;
    }

    public void setKnowledgeBase(ProjectKnowledgeBase knowledgeBase) {
        this.knowledgeBase = knowledgeBase;
    }
}
