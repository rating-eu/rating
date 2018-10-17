package eu.hermeneut.domain.overview;

import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;

public class AugmentedMyAsset extends MyAsset {
    public AugmentedMyAsset(MyAsset myAsset) {
        super();
        this.setId(myAsset.getId());
        this.setAsset(myAsset.getAsset());
        this.setRanking(myAsset.getRanking());
        this.setEconomicValue(myAsset.getEconomicValue());
        this.setEstimated(myAsset.isEstimated());
        this.setMagnitude(myAsset.getMagnitude());
        this.setSelfAssessment(myAsset.getSelfAssessment());
        this.setQuestionnaire(myAsset.getQuestionnaire());
    }

    private AugmentedAttackStrategy augmentedAttackStrategy;

    public AugmentedAttackStrategy getAugmentedAttackStrategy() {
        return augmentedAttackStrategy;
    }

    public void setAugmentedAttackStrategy(AugmentedAttackStrategy augmentedAttackStrategy) {
        this.augmentedAttackStrategy = augmentedAttackStrategy;
    }
}