package fr.jozait.startbuildingapi.domain.model.section;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public class SectionKey implements Serializable {
    private Long targetId;
    private String type;
}
