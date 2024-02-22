package fr.jozait.startbuildingapi.domain.model.project;

import fr.jozait.startbuildingapi.domain.model.project.node.ProjectKnowledgeNode;

import java.util.List;

public class ProjectKnowledgeBaseHelper {
    public enum ActionType {
        INSERT,
        UPDATE,
        DELETE,
        READ,
    }
    private final ProjectKnowledgeBase knowledgeBase;
    private ProjectKnowledgeBaseHelper(ProjectKnowledgeBase knowledgeBase){
        this.knowledgeBase = knowledgeBase;
    }
    public static ProjectKnowledgeBaseHelper of(ProjectKnowledgeBase knowledgeBase) {
           return new ProjectKnowledgeBaseHelper(knowledgeBase);
    }
    public ProjectKnowledgeNode insert(ProjectKnowledgeNode payload, String at) {
        if (this.knowledgeBase.getTree() == null) {
            this.knowledgeBase.setTree(payload);
            return this.knowledgeBase.getTree();
        } else if (this.knowledgeBase.getTree().getAttributes().getId().equals(at)) {
            return this.knowledgeBase.getTree().appendChild(payload);
        }
        return findWithAction(ActionType.INSERT, this.knowledgeBase.getTree(), payload, at);
    }
    public ProjectKnowledgeNode update(ProjectKnowledgeNode payload) {
        if (this.knowledgeBase.getTree() == null) {
            return null;
        } else if (this.knowledgeBase.getTree().getAttributes().getId().equals(payload.getAttributes().getId())) {
            return this.knowledgeBase.getTree().update(payload);
        }
        return findWithAction(ActionType.UPDATE, this.knowledgeBase.getTree(), payload, payload.getAttributes().getId());
    }
    public ProjectKnowledgeNode delete(String nodeId) {
        if (this.knowledgeBase.getTree() == null) {
            return null;
        } else if (this.knowledgeBase.getTree().getAttributes().getId().equals(nodeId)) {
            return null;
        }
        return findWithAction(ActionType.DELETE, this.knowledgeBase.getTree(), null, nodeId);
    }
    public ProjectKnowledgeNode read(String nodeId) {
        if (this.knowledgeBase.getTree() == null) {
            return null;
        } else if (this.knowledgeBase.getTree().getAttributes().getId().equals(nodeId)) {
            return this.knowledgeBase.getTree();
        }
        return findWithAction(ActionType.READ, this.knowledgeBase.getTree(), null, nodeId);
    }
    private ProjectKnowledgeNode findWithAction(ActionType type, ProjectKnowledgeNode parent, ProjectKnowledgeNode payload, String at) {
        ProjectKnowledgeNode found = null;
        if (at == null || at.isEmpty()) {
            switch (type) {
                case INSERT:
                    this.knowledgeBase.getTree().appendChild(payload);
                    found = this.knowledgeBase.getTree();
                    break;
                case READ:
                case UPDATE:
                case DELETE:
                default:
                    found = this.knowledgeBase.getTree();
                    break;
            }
        } else {
            List<ProjectKnowledgeNode> nodes = parent.getChildren();
            for (int i = 0; i < nodes.size(); i++) {
                if (found != null) { break; } // this is key to the success of this algorithm
                ProjectKnowledgeNode node = nodes.get(i);
                if (node.getAttributes().getId().equals(at)) {
                    switch (type) {
                        case INSERT:
                            node.appendChild(payload);
                            found = node;
                            break;
                        case DELETE:
                            if (node.getChildren().size() > 0) {
                                // copy children over
                                parent.getChildren().addAll(node.getChildren());
                            }
                            found = parent.removeChild(node);
                            break;
                        case UPDATE:
                            found = node.update(payload);
                            break;
                        default:
                            found = node;
                            break;
                    }
                } else {
                    found = findWithAction(type, node, payload, at);
                }
            }
        }
        return found;
    }
    public ProjectKnowledgeBase getKnowledgeBase() {
        return knowledgeBase;
    }
}
