package fr.jozait.startbuildingapi.bootstrap.rome;

import fr.jozait.startbuildingapi.domain.model.seed.Seeder;
import fr.jozait.startbuildingapi.domain.model.rome.Competence;
import fr.jozait.startbuildingapi.domain.model.rome.Domaine;
import fr.jozait.startbuildingapi.domain.model.rome.Profession;
import fr.jozait.startbuildingapi.domain.repository.SeederRepository;
import fr.jozait.startbuildingapi.domain.repository.rome.CompetenceRepository;
import fr.jozait.startbuildingapi.domain.repository.rome.DomainRepository;
import fr.jozait.startbuildingapi.domain.repository.rome.ProfessionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class ROMELoaderServie implements CommandLineRunner {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final SeederRepository seederRepository;
    private final DomainRepository domainRepository;
    private final CompetenceRepository competenceRepository;
    private final ProfessionRepository professionRepository;

    private final ROMEProps romeProps;
    private static final String tableName = "codes_rome";

    @Autowired
    public ROMELoaderServie(
            SeederRepository seederRepository,
            DomainRepository domainRepository,
            CompetenceRepository competenceRepository,
            ProfessionRepository professionRepository,
            ROMEProps romeProps) {
        this.seederRepository = seederRepository;
        this.domainRepository = domainRepository;
        this.competenceRepository = competenceRepository;
        this.professionRepository = professionRepository;
        this.romeProps = romeProps;
    }

    @Override
    public void run(String... args) throws Exception {
        logger.info("Bootstrapping rome data");
        try {
            // check if seeded
            Optional<Seeder> seederOptional = seederRepository
                    .findFirstByTableNameAndStatus(tableName, true);
            if (!seederOptional.isPresent()) {
                String filePath = romeProps.getBootstrapCsv();
                List<String> filterDomains = romeProps.getBootstrapDomains() == null
                        ? Collections.emptyList()
                        : Arrays.stream(romeProps.getBootstrapDomains().split(","))
                        .map(d -> d.trim().toLowerCase()).collect(Collectors.toList());
                logger.info(filePath);
                BufferedReader bufferReader;
                if (filePath.startsWith("classpath:")){
                    InputStream inputStream = new ClassPathResource(filePath.substring(filePath.indexOf(":") + 1)).getInputStream();
                    bufferReader = new BufferedReader(new InputStreamReader(inputStream));
                } else {
                    bufferReader = new BufferedReader(new FileReader(filePath));
                }
                String line = bufferReader.readLine();
                Domaine domain = null;
                Competence competence = null;
                List<Profession> professions = new ArrayList<>();
                int rows = 0;
                while (line != null) {
                    List<String> records = parseLine(line);
                    /*
                     * dictionary
                     * 0 r1
                     * 1 r2
                     * 2 r3
                     * 3 appellation
                     * 4 code ogr
                     * */
                    if (filterDomains.isEmpty() || filterDomains.contains(records.get(0).toLowerCase())) {
                        if (records.get(1).isEmpty()) {
                            logger.info("Domain, {}", records.get(3));
                            domain = new Domaine();
                            domain.setCodeRome(records.get(0).toUpperCase());
                            domain.setAppellation(records.get(3));
                            domain = domainRepository.save(domain);
                        } else if (records.get(2).isEmpty()) {
                            logger.info("Competence, {}", records.get(3));
                            if (competence != null && professions.size() > 0) {
                                // save professions
                                professionRepository.saveAll(professions);
                                rows += professions.size();
                                // refresh profession list
                                professions = new ArrayList<>();
                            }
                            competence = new Competence();
                            competence.setCodeRome((records.get(0) + records.get(1)).toUpperCase());
                            competence.setAppellation(records.get(3));
                            competence.setDomaine(domain);
                            competence = competenceRepository.save(competence);
                        } else {
                            Profession profession = new Profession();
                            profession.setCodeRome((records.get(0) + records.get(1) + records.get(2)).toUpperCase());
                            profession.setAppellation(records.get(3));
                            profession.setCodeOgr(records.get(4));
                            profession.setCompetence(competence);
                            professions.add(profession);
                        }
                    }
                    line = bufferReader.readLine();
                }
                Seeder seeder = new Seeder();
                seeder.setTableName(tableName);
                seeder.setStatus(true);
                seederRepository.save(seeder);
                logger.info("ROME data seeded, {} rows added", rows);
            } else {
                logger.info("ROME data seeded, no row added");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    private List<String> parseLine(String line) {
        if (line == null || line.isEmpty()) {
            return Collections.emptyList();
        }
        return Arrays.stream(line.split(",")).map(l -> {
            if (l.contains("\"")) {
               l = l.replaceAll("\"", "");
            }
            return  l.trim();
        }).collect(Collectors.toList());
    }
}
