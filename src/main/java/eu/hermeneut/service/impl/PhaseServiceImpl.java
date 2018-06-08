package eu.hermeneut.service.impl;

import eu.hermeneut.service.PhaseService;
import eu.hermeneut.domain.Phase;
import eu.hermeneut.repository.PhaseRepository;
import eu.hermeneut.repository.search.PhaseSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Phase.
 */
@Service
@Transactional
public class PhaseServiceImpl implements PhaseService {

    private final Logger log = LoggerFactory.getLogger(PhaseServiceImpl.class);

    private final PhaseRepository phaseRepository;

    private final PhaseSearchRepository phaseSearchRepository;

    public PhaseServiceImpl(PhaseRepository phaseRepository, PhaseSearchRepository phaseSearchRepository) {
        this.phaseRepository = phaseRepository;
        this.phaseSearchRepository = phaseSearchRepository;
    }

    /**
     * Save a phase.
     *
     * @param phase the entity to save
     * @return the persisted entity
     */
    @Override
    public Phase save(Phase phase) {
        log.debug("Request to save Phase : {}", phase);
        Phase result = phaseRepository.save(phase);
        phaseSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the phases.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Phase> findAll() {
        log.debug("Request to get all Phases");
        return phaseRepository.findAll();
    }

    /**
     * Get one phase by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Phase findOne(Long id) {
        log.debug("Request to get Phase : {}", id);
        return phaseRepository.findOne(id);
    }

    /**
     * Delete the phase by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Phase : {}", id);
        phaseRepository.delete(id);
        phaseSearchRepository.delete(id);
    }

    /**
     * Search for the phase corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Phase> search(String query) {
        log.debug("Request to search Phases for query {}", query);
        return StreamSupport
            .stream(phaseSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}