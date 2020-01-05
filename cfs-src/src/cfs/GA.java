package cfs;

import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;
import java.util.Random;


public class GA {
    int old_age = 1; //each classifier gets a chance to build up strength for 10 iterations. then it's considered old, and can die.
    double mutation = 0.15; //mutation ratio
    double strengthThr = 0.3; //classifiers with strength beneath this threshold will be removed.

    double elitarism = 0.3; //percent of the classifiers that should be copied into the next population without modifications.
    double outPer = 0.5; //at least this much output classifiers

    int maxClassifiers = 100;

    public void execute(List<Classifier> classifierList) {
        int outNo = 0;
        Random rand = new Random();
        classifierList.sort(new ClassifierComparator());

        int kb = 0; //killed or bred specimen
        int toBKilled = 1;
        ListIterator<Classifier> it = classifierList.listIterator(classifierList.size());
        while (it.hasPrevious() && classifierList.size() > 2) {
            Classifier curClassifier = it.previous();
            curClassifier.lived++;
            if (curClassifier.strength < strengthThr) {
                it.remove();
                kb++;
                continue;
            }
            if (new String(curClassifier.action).startsWith(Message.code_output)) {
                outNo++;
            }
        }

        List<Classifier> bred = new ArrayList<>();
        kb = 0;
        it = classifierList.listIterator();
        Classifier aClassifier = null;
        if (it.hasNext()) aClassifier = it.next();
        Classifier bClassifier;
        while (it.hasNext() && kb < toBKilled && classifierList.size() < maxClassifiers) {
            bClassifier = it.next();
            int i = 0;
            Classifier candidate;
            do {
                candidate = aClassifier.breed(bClassifier);
                if (++i > 100) {
                    if (!it.hasNext()) {
                        candidate = new Classifier(8, 8);
                        continue;
                    }
                    aClassifier = bClassifier;
                    bClassifier = it.next();
                }
            } while (classifierList.contains(candidate) || bred.contains(candidate));

            bred.add(candidate);
            Classifier.index_max++;
            aClassifier = bClassifier;
            kb++;
        }

        classifierList.addAll(bred);

        it = classifierList.listIterator((int) (classifierList.size() * elitarism));
        while (it.hasNext()) {
            Classifier curClassifier = it.next();
            if (rand.nextDouble() < mutation) {
                curClassifier.mutate();
            }
        }

        it = classifierList.listIterator(classifierList.size());
        while (it.hasPrevious() && outNo < (int) (classifierList.size() * outPer)) {
            Classifier curClassifier = it.previous();
            if (new String(curClassifier.action).startsWith(Message.code_output)) {
                continue;
            }

            curClassifier.action[0] = '0';
            curClassifier.action[1] = '0';
            outNo++;
        }

    }

}
