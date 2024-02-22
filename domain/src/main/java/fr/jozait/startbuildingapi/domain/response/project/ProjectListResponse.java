package fr.jozait.startbuildingapi.domain.response.project;

import fr.jozait.startbuildingapi.domain.model.project.Project;
import fr.jozait.startbuildingapi.domain.model.project.ProjectKnowledgeBase;
import fr.jozait.startbuildingapi.domain.model.user.User;

import java.util.List;
import java.util.Map;

public class ProjectListResponse {
    private List<Project> projects;
    private Map<Long, ProjectKnowledgeBase> knowledgeBaseMap;
    private Map<Long, User> creatorMap;

    public ProjectListResponse() {
    }

    public ProjectListResponse(List<Project> projects, Map<Long, ProjectKnowledgeBase> knowledgeBaseMap) {
        this.projects = projects;
        this.knowledgeBaseMap = knowledgeBaseMap;
    }

    public ProjectListResponse(List<Project> projects, Map<Long, ProjectKnowledgeBase> knowledgeBaseMap, Map<Long, User> creatorMap) {
        this.projects = projects;
        this.knowledgeBaseMap = knowledgeBaseMap;
        this.creatorMap = creatorMap;
    }

    public List<Project> getProjects() {
        return projects;
    }

    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }

    public Map<Long, ProjectKnowledgeBase> getKnowledgeBaseMap() {
        return knowledgeBaseMap;
    }

    public void setKnowledgeBaseMap(Map<Long, ProjectKnowledgeBase> knowledgeBaseMap) {
        this.knowledgeBaseMap = knowledgeBaseMap;
    }

    public Map<Long, User> getCreatorMap() {
        return creatorMap;
    }

    public void setCreatorMap(Map<Long, User> creatorMap) {
        this.creatorMap = creatorMap;
    }
}
