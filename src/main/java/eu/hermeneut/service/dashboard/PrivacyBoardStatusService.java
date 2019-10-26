/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package eu.hermeneut.service.dashboard;

import eu.hermeneut.domain.dashboard.PrivacyBoardStatus;
import eu.hermeneut.domain.enumeration.Status;
import eu.hermeneut.exceptions.NotFoundException;

public interface PrivacyBoardStatusService {
    Status getOperationDefinitionStatus(Long companyProfileID, Long operationID) throws NotFoundException;

    Status getImpactEvaluationStatus(Long companyProfileID, Long operationID) throws NotFoundException;

    Status getThreatIdentificationStatus(Long companyProfileID, Long operationID) throws NotFoundException;

    Status getRiskEvaluationStatus(Long companyProfileID, Long operationID) throws NotFoundException;

    PrivacyBoardStatus getPrivacyBoardStatus(Long companyProfileID, Long operationID) throws NotFoundException;
}