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

package eu.hermeneut.domain.enumeration;

/**
 * The CompType enumeration.
 */
public enum CompType {
    OTHER(0),
    FINANCE_AND_INSURANCE(1),
    HEALTH_CARE_AND_SOCIAL_ASSISTANCE(2),
    INFORMATION(3),
    PROFESSIONAL_SCIENTIFIC_AND_TECHNICAL_SERVICE(4);

    private final int value;

    CompType(int value) {
        this.value = value;
    }

    public int getValue() {
        return this.value;
    }
}
