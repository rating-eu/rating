package eu.hermeneut.service.impl;

import eu.hermeneut.service.CompanyProfileService;
import eu.hermeneut.domain.CompanyProfile;
import eu.hermeneut.domain.CompanySector;
import eu.hermeneut.repository.CompanyProfileRepository;
import eu.hermeneut.repository.search.CompanyProfileSearchRepository;
import eu.hermeneut.security.AuthoritiesConstants;
import eu.hermeneut.security.SecurityUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing CompanyProfile.
 */
@Service
@Transactional
public class CompanyProfileServiceImpl implements CompanyProfileService {

	private final Logger log = LoggerFactory.getLogger(CompanyProfileServiceImpl.class);

	private final CompanyProfileRepository companyProfileRepository;

	private final CompanyProfileSearchRepository companyProfileSearchRepository;

	public CompanyProfileServiceImpl(CompanyProfileRepository companyProfileRepository, CompanyProfileSearchRepository companyProfileSearchRepository) {
		this.companyProfileRepository = companyProfileRepository;
		this.companyProfileSearchRepository = companyProfileSearchRepository;
	}

	/**
	 * Save a companyProfile.
	 *
	 * @param companyProfile the entity to save
	 * @return the persisted entity
	 */
	@Override
	public CompanyProfile save(CompanyProfile companyProfile) {
		log.debug("Request to save CompanyProfile : {}", companyProfile);
		CompanyProfile result = companyProfileRepository.save(companyProfile);
		companyProfileSearchRepository.save(result);
		return result;
	}

	/**
	 * Get all the companyProfiles.
	 *
	 * @return the list of entities
	 */
	@Override
	@Transactional(readOnly = true)
	public List<CompanyProfile> findAll() {
		log.debug("Request to get all CompanyProfiles");
		String logged_user = SecurityUtils.getCurrentUserLogin().get();

		System.out.println("CURRENT " + logged_user);
		List<CompanyProfile> rr=companyProfileRepository.findAll();
		List<CompanyProfile> toReturn= new ArrayList<CompanyProfile>();

		if(SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
			return companyProfileRepository.findAllWithEagerRelationships();
		}else {

			for (CompanyProfile companyProfile : rr) {
				String owner=companyProfile.getUser().getLogin();
				System.out.println("owner "+ owner);
				if(owner.equalsIgnoreCase(logged_user)){
					toReturn.add(companyProfile);
				}else {
					/*se logged user appartiene alla company*/
					Iterator<CompanySector> gg = companyProfile.getDepartments().iterator();
					while(gg.hasNext()) {
						CompanySector hh=gg.next();
						System.out.println("owner department "+ hh.getUser().getLogin() );
						if(logged_user.equalsIgnoreCase(hh.getUser().getLogin())){
							if(!toReturn.contains(companyProfile)) {
								toReturn.add(companyProfile);
							}
						}
					}

				}
			}

			return toReturn;
		}

		//return companyProfileRepository.findAllWithEagerRelationships();
	}

	/**
	 * Get one companyProfile by id.
	 *
	 * @param id the id of the entity
	 * @return the entity
	 */
	@Override
	@Transactional(readOnly = true)
	public CompanyProfile findOne(Long id) {
		log.debug("Request to get CompanyProfile : {}", id);
		return companyProfileRepository.findOneWithEagerRelationships(id);
	}

	/**
	 * Delete the companyProfile by id.
	 *
	 * @param id the id of the entity
	 */
	@Override
	public void delete(Long id) {
		log.debug("Request to delete CompanyProfile : {}", id);
		companyProfileRepository.delete(id);
		companyProfileSearchRepository.delete(id);
	}

	/**
	 * Search for the companyProfile corresponding to the query.
	 *
	 * @param query the query of the search
	 * @return the list of entities
	 */
	@Override
	@Transactional(readOnly = true)
	public List<CompanyProfile> search(String query) {
		log.debug("Request to search CompanyProfiles for query {}", query);
		return StreamSupport
				.stream(companyProfileSearchRepository.search(queryStringQuery(query)).spliterator(), false)
				.collect(Collectors.toList());
	}
}
