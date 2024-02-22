package fr.jozait.startbuildingapi.service.forge;

import fr.jozait.startbuildingapi.domain.model.BaseEntity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class NodeData extends BaseEntity {
    private String nodeId;
    private String data;

    public NodeData(String nodeId, String data) {
        this.nodeId = nodeId;
        this.data = data;
    }

    public NodeData() {

    }

    public String getNodeId() {
        return nodeId;
    }

    public void setNodeId(String nodeId) {
        this.nodeId = nodeId;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}
