package fr.jozait.startbuildingapi.domain.model.org;

import fr.jozait.startbuildingapi.domain.repository.org.OrganisationRepository;

public class OrganisationContext {
    private static final ThreadLocal<Long> id = new ThreadLocal<>();
    private OrganisationContext() {
    }

    public static Long getId() {
        return id.get();
    }

    public static void setId(Long id) {
        OrganisationContext.id.set(id);
    }
    public static void clearId() {
        OrganisationContext.id.remove();
    }
}
