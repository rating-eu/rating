package eu.hermeneut.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

import eu.hermeneut.domain.enumeration.CostType;

/**
 * A AttackCost.
 */
@Entity
@Table(name = "attack_cost")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "attackcost")
public class AttackCost implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "jhi_type", nullable = false)
    private CostType type;

    @Size(max = 2000)
    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "costs")
    private Integer costs;

    @ManyToOne
    private DirectAsset directAsset;

    @ManyToOne
    private IndirectAsset indirectAsset;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CostType getType() {
        return type;
    }

    public AttackCost type(CostType type) {
        this.type = type;
        return this;
    }

    public void setType(CostType type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public AttackCost description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getCosts() {
        return costs;
    }

    public AttackCost costs(Integer costs) {
        this.costs = costs;
        return this;
    }

    public void setCosts(Integer costs) {
        this.costs = costs;
    }

    public DirectAsset getDirectAsset() {
        return directAsset;
    }

    public AttackCost directAsset(DirectAsset directAsset) {
        this.directAsset = directAsset;
        return this;
    }

    public void setDirectAsset(DirectAsset directAsset) {
        this.directAsset = directAsset;
    }

    public IndirectAsset getIndirectAsset() {
        return indirectAsset;
    }

    public AttackCost indirectAsset(IndirectAsset indirectAsset) {
        this.indirectAsset = indirectAsset;
        return this;
    }

    public void setIndirectAsset(IndirectAsset indirectAsset) {
        this.indirectAsset = indirectAsset;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        AttackCost attackCost = (AttackCost) o;
        if (attackCost.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), attackCost.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "AttackCost{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", description='" + getDescription() + "'" +
            ", costs=" + getCosts() +
            "}";
    }
}