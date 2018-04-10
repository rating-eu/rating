package eu.hermeneut.service;

import eu.hermeneut.domain.ExternalAudit;
import java.util.List;

/**
 * Service Interface for managing ExternalAudit.
 */
public interface ExternalAuditService {

    /**
     * Save a externalAudit.
     *
     * @param externalAudit the entity to save
     * @return the persisted entity
     */
    ExternalAudit save(ExternalAudit externalAudit);

    /**
     * Get all the externalAudits.
     *
     * @return the list of entities
     */
    List<ExternalAudit> findAll();

    /**
     * Get the "id" externalAudit.
     *
     * @param id the id of the entity
     * @return the entity
     */
    ExternalAudit findOne(Long id);

    /**
     * Delete the "id" externalAudit.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the externalAudit corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<ExternalAudit> search(String query);
}
