package fr.jozait.startbuildingapi.service.rome;

import fr.jozait.startbuildingapi.domain.repository.rome.CompetenceRepository;
import fr.jozait.startbuildingapi.domain.repository.rome.DomainRepository;
import fr.jozait.startbuildingapi.domain.repository.rome.ProfessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ROMEService {
    private DomainRepository domainRepository;
    private CompetenceRepository competenceRepository;
    private ProfessionRepository professionRepository;

    @Autowired
    public ROMEService(
            DomainRepository domainRepository,
            CompetenceRepository competenceRepository,
            ProfessionRepository professionRepository) {
        this.domainRepository = domainRepository;
        this.competenceRepository = competenceRepository;
        this.professionRepository = professionRepository;
    }

}
