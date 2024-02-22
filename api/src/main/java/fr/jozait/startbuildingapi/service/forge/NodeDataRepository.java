package fr.jozait.startbuildingapi.service.forge;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NodeDataRepository extends JpaRepository<NodeData, String> {
    Optional<NodeData> findByNodeId(String nodeId);
}
