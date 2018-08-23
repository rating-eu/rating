package eu.hermeneut.service.impl;

import eu.hermeneut.service.MitigationService;
import eu.hermeneut.domain.Mitigation;
import eu.hermeneut.repository.MitigationRepository;
import eu.hermeneut.repository.search.MitigationSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Mitigation.
 */
@Service
@Transactional
public class MitigationServiceImpl implements MitigationService {

    private final Logger log = LoggerFactory.getLogger(MitigationServiceImpl.class);

    private final MitigationRepository mitigationRepository;

    private final MitigationSearchRepository mitigationSearchRepository;

    public MitigationServiceImpl(MitigationRepository mitigationRepository, MitigationSearchRepository mitigationSearchRepository) {
        this.mitigationRepository = mitigationRepository;
        this.mitigationSearchRepository = mitigationSearchRepository;
    }

    /**
     * Save a mitigation.
     *
     * @param mitigation the entity to save
     * @return the persisted entity
     */
    @Override
    public Mitigation save(Mitigation mitigation) {
        log.debug("Request to save Mitigation : {}", mitigation);
        Mitigation result = mitigationRepository.save(mitigation);
        mitigationSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the mitigations.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Mitigation> findAll() {
        log.debug("Request to get all Mitigations");
        return mitigationRepository.findAll();
    }

    /**
     * Get one mitigation by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Mitigation findOne(Long id) {
        log.debug("Request to get Mitigation : {}", id);
        return mitigationRepository.findOne(id);
    }

    /**
     * Delete the mitigation by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Mitigation : {}", id);
        mitigationRepository.delete(id);
        mitigationSearchRepository.delete(id);
    }

    /**
     * Search for the mitigation corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Mitigation> search(String query) {
        log.debug("Request to search Mitigations for query {}", query);
        return StreamSupport
            .stream(mitigationSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
