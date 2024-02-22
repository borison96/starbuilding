package fr.jozait.startbuildingapi.util;

import fr.jozait.startbuildingapi.domain.model.project.ProjectKnowledgeBase;
import fr.jozait.startbuildingapi.domain.model.project.ProjectKnowledgeBaseHelper;
import fr.jozait.startbuildingapi.domain.model.project.node.ProjectKnowledgeNode;
import fr.jozait.startbuildingapi.domain.model.project.node.ProjectKnowledgeNodeAttributes;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class AppUtilsTest {

    @Test
    void queryStringFromMapShouldReturnCorrectly() {
        Map<String, String> params = new HashMap<>();
        params.put("hello", "there");
        params.put("name", "nouks");
        params.put("number", "3");
        String queryString = AppUtils.QueryString.fromMap(params);
        assertEquals(queryString, "?number=3&name=nouks&hello=there");
    }
    @Test
    void queryStringFromMapShouldReturnCorrectlyIfNull() {
        Map<String, String> params = new HashMap<>();
        String queryString = AppUtils.QueryString.fromMap(params);
        assertEquals(queryString, "");
    }
    @Test
    void givenKnowledgeHelper_whenOfKnowledgeBase_thenReturnKnowledgeBase() {
        ProjectKnowledgeBase base = new ProjectKnowledgeBase();
        ProjectKnowledgeBaseHelper helper = ProjectKnowledgeBaseHelper.of(base);
        assertEquals(base, helper.getKnowledgeBase());
    }
    @Test
    void givenKnowledgeHelper_whenReadTree_thenReturnTreeNode() {
        ProjectKnowledgeBase base = new ProjectKnowledgeBase();
        ProjectKnowledgeNode tree = new ProjectKnowledgeNode();
        tree.setName("Big name");
        ProjectKnowledgeNodeAttributes attributes = new ProjectKnowledgeNodeAttributes();
        attributes.setId("unique-id");
        tree.setAttributes(attributes);
        base.setTree(tree);
        ProjectKnowledgeBaseHelper helper = ProjectKnowledgeBaseHelper.of(base);
        assertEquals(tree, helper.read(attributes.getId()));
    }
    @Test
    void givenKnowledgeHelper_whenReadNode_thenReturnNode() {
        ProjectKnowledgeBase base = new ProjectKnowledgeBase();
        ProjectKnowledgeNode tree = new ProjectKnowledgeNode();
        tree.setName("Big name");
        ProjectKnowledgeNodeAttributes attributes = new ProjectKnowledgeNodeAttributes();
        attributes.setId("unique-id");
        tree.setAttributes(attributes);
        base.setTree(tree);

        // child
        ProjectKnowledgeNode child = new ProjectKnowledgeNode();
        child.setName("child");
        ProjectKnowledgeNodeAttributes childAttr = new ProjectKnowledgeNodeAttributes();
        childAttr.setId("child-id");
        child.setAttributes(childAttr);
        tree.appendChild(child);

        ProjectKnowledgeBaseHelper helper = ProjectKnowledgeBaseHelper.of(base);
        assertNotEquals(tree, helper.read(childAttr.getId()));
        assertEquals(child, helper.read(childAttr.getId()));
    }
    @Test
    void givenKnowledgeHelper_whenUpdateNode_thenReturnUpdatedNode() {
        ProjectKnowledgeBase base = new ProjectKnowledgeBase();
        ProjectKnowledgeNode tree = new ProjectKnowledgeNode();
        tree.setName("Big name");
        ProjectKnowledgeNodeAttributes attributes = new ProjectKnowledgeNodeAttributes();
        attributes.setId("unique-id");
        tree.setAttributes(attributes);
        base.setTree(tree);

        // child
        ProjectKnowledgeNode child = new ProjectKnowledgeNode();
        child.setName("child");
        ProjectKnowledgeNodeAttributes childAttr = new ProjectKnowledgeNodeAttributes();
        childAttr.setId("child-id");
        child.setAttributes(childAttr);
        tree.appendChild(child);

        // child1
        ProjectKnowledgeNode child1 = new ProjectKnowledgeNode();
        child1.setName("child1");
        ProjectKnowledgeNodeAttributes childAttr1 = new ProjectKnowledgeNodeAttributes();
        childAttr1.setId("child1-id");
        child1.setAttributes(childAttr1);
        child.appendChild(child1);

        // update
        ProjectKnowledgeNode upd = new ProjectKnowledgeNode();
        upd.setName("update");
        ProjectKnowledgeNodeAttributes updAttr = new ProjectKnowledgeNodeAttributes();
        updAttr.setId("child1-id");
        updAttr.setDescription("Beta");
        upd.setAttributes(updAttr);

        ProjectKnowledgeBaseHelper helper = ProjectKnowledgeBaseHelper.of(base);

        ProjectKnowledgeNode updNode = helper.update(upd);
        assertEquals(upd.getName(), updNode.getName());
        assertEquals(child1.getAttributes().getId(), updNode.getAttributes().getId());
        assertEquals(upd.getAttributes().getDescription(), updNode.getAttributes().getDescription());

    }

    @Test
    void givenKnowledgeHelper_whenDeleteNode_thenRemoveNode() {
        ProjectKnowledgeBase base = new ProjectKnowledgeBase();
        ProjectKnowledgeNode tree = new ProjectKnowledgeNode();
        tree.setName("Big name");
        ProjectKnowledgeNodeAttributes attributes = new ProjectKnowledgeNodeAttributes();
        attributes.setId("unique-id");
        tree.setAttributes(attributes);
        base.setTree(tree);

        // child
        ProjectKnowledgeNode child = new ProjectKnowledgeNode();
        child.setName("child");
        ProjectKnowledgeNodeAttributes childAttr = new ProjectKnowledgeNodeAttributes();
        childAttr.setId("child-id");
        child.setAttributes(childAttr);
        tree.appendChild(child);

        // child1
        ProjectKnowledgeNode child1 = new ProjectKnowledgeNode();
        child1.setName("child1");
        ProjectKnowledgeNodeAttributes childAttr1 = new ProjectKnowledgeNodeAttributes();
        childAttr1.setId("child1-id");
        child1.setAttributes(childAttr1);
        child.appendChild(child1);

        ProjectKnowledgeBaseHelper helper = ProjectKnowledgeBaseHelper.of(base);

        helper.delete(child1.getAttributes().getId());
        assertEquals(child.getChildren().size(), 0);
        assertEquals(tree.getChildren().size(), 1);

    }


}