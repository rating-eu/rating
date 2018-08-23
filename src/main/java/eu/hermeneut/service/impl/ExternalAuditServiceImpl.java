package eu.hermeneut.service.impl;

import eu.hermeneut.service.ExternalAuditService;
import eu.hermeneut.domain.ExternalAudit;
import eu.hermeneut.repository.ExternalAuditRepository;
import eu.hermeneut.repository.search.ExternalAuditSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing ExternalAudit.
 */
@Service
@Transactional
public class ExternalAuditServiceImpl implements ExternalAuditService {

    private final Logger log = LoggerFactory.getLogger(ExternalAuditServiceImpl.class);

    private final ExternalAuditRepository externalAuditRepository;

    private final ExternalAuditSearchRepository externalAuditSearchRepository;

    public ExternalAuditServiceImpl(ExternalAuditRepository externalAuditRepository, ExternalAuditSearchRepository externalAuditSearchRepository) {
        this.externalAuditRepository = externalAuditRepository;
        this.externalAuditSearchRepository = externalAuditSearchRepository;
    }

    /**
     * Save a externalAudit.
     *
     * @param externalAudit the entity to save
     * @return the persisted entity
     */
    @Override
    public ExternalAudit save(ExternalAudit externalAudit) {
        log.debug("Request to save ExternalAudit : {}", externalAudit);
        ExternalAudit result = externalAuditRepository.save(externalAudit);
        externalAuditSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the externalAudits.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<ExternalAudit> findAll() {
        log.debug("Request to get all ExternalAudits");
        return externalAuditRepository.findAll();
    }

    /**
     * Get one externalAudit by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public ExternalAudit findOne(Long id) {
        log.debug("Request to get ExternalAudit : {}", id);
        return externalAuditRepository.findOne(id);
    }

    /**
     * Delete the externalAudit by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete ExternalAudit : {}", id);
        externalAuditRepository.delete(id);
        externalAuditSearchRepository.delete(id);
    }

    /**
     * Search for the externalAudit corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<ExternalAudit> search(String query) {
        log.debug("Request to search ExternalAudits for query {}", query);
        return StreamSupport
            .stream(externalAuditSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
