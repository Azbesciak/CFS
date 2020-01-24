package cfs;

import java.util.*;


public class BB {
    double k = 0.1;
    double life_tax = 0.06;
    double bid_tax = 0.05;
    int winners = 1;

    int msgAgeThr = 3;

    private ArrayList<Double> values = new ArrayList<>();
    List<Classifier> active = new ArrayList<>();
    List<Classifier> activated = new ArrayList<Classifier>();
    List<Classifier> prevActivated = new ArrayList<Classifier>();

    public BB() {
    }

    public void match_compete(List<Classifier> classifierList, List<Message> msgList) {
        Random rand = new Random();
        List<Message> newMsgs = new ArrayList<>();
        if (values.size() == 64*10) {
          double sum = 0;
          for (double v : values) {
            sum += v;
          }
          System.out.println("average " + sum/values.size());
          values.clear();
        }
        newMsgs.clear();

        active.clear();
        prevActivated.clear();
        prevActivated.addAll(activated);
        activated.clear();

        //scanning all messages and discovering active classifiers
        Iterator<Classifier> it = classifierList.iterator();
        int i = 0;
        double max_strength = 0;
        int matched = 0;
        double total = 0;
        while (it.hasNext()) {
            Classifier curClassifier = it.next();
            curClassifier.generatedMsgs.clear();

            //System.out.print("Classifier [" + i + "] :"); curClassifier.print();

            curClassifier.payTax(life_tax);

            for (Message curMsg : msgList) {
                //System.out.print("\t"); curMsg.print(); System.out.print(" -> ");
                Message tmp = curClassifier.match(curMsg);
                total++;
                if (tmp != null) {
                  matched++;
                    tmp.byClassifier = curClassifier;
                    curClassifier.generatedMsgs.add(tmp);
                    //newMsgs.add(tmp);
                    active.add(curClassifier);
                    double a = (rand.nextDouble() / 5);
                    curClassifier.cur_strength = curClassifier.strength * (1 + a - 0.1);
                    //System.out.println(curClassifier.toString() + " curs: " + curClassifier.cur_strength);

                    if (curClassifier.cur_strength > max_strength)
                        max_strength = curClassifier.cur_strength;
                }
            }
            i++;
        }
        values.add(matched/ total);
//        System.out.println("max strength: " + max_strength);
        it = active.iterator();
        while (it.hasNext()) {
            Classifier curClassifier = it.next();
            curClassifier.cur_strength /= max_strength;
        }

        active.sort(new ClassifierComparatorRnd());

        i = 0;
        it = active.iterator();
        while (it.hasNext() && i < this.winners) {
            Classifier curClassifier = it.next();

//          System.out.println("winner: " + curClassifier.toString());

            activated.add(curClassifier);

            curClassifier.payBid(k, bid_tax);
            newMsgs.addAll(curClassifier.dumpMessagesAndPay());

            i++;
        }
        msgList.addAll(newMsgs);
    }

    public List<Message> purgeMessages(List<Message> msgList) {
        List<Message> newMsgList = new ArrayList<>();

        for (Message curMsg : msgList) {
            curMsg.age++;
            if (!curMsg.used && curMsg.byClassifier != null && curMsg.age < msgAgeThr) //not used and not input message
                if (!newMsgList.contains(curMsg)) {
                    newMsgList.add(curMsg);
                }
        }

        return newMsgList;
    }


    public void payCurrClassifiers(double amount) {
        //System.out.println("paying: ");
        for (Classifier curClassifier : activated) {
            curClassifier.strength += amount;
            //System.out.println(curClassifier.toString() + " : " + amount);
        }
        //System.out.println("payed");
    }

    public void payPreviousClassifiers(double amount) {
        if (prevActivated.size() <= 0)
            return;
        double perAmount = amount / ((double) prevActivated.size());
        //		System.out.println("perAmount: " + perAmount);
        for (Classifier curClassifier : active) {
            curClassifier.strength += perAmount;
        }
    }

    public void classifierMatching(List<Classifier> classifierList, List<Message> msgList) {
        List<Message> newMsgs = new ArrayList<>();
        newMsgs.clear();

        Iterator<Classifier> it = classifierList.iterator();
        int i = 0;
        while (it.hasNext()) {
            Classifier curClassifier = it.next();
//          System.out.print("Classifier [" + i + "] :"); curClassifier.print();

            for (Message curMsg : msgList) {
                //        	  System.out.print("\t"); curMsg.print(); System.out.print(" -> ");
                Message tmp = curClassifier.match(curMsg);
                if (tmp != null) {
                    tmp.byClassifier = curClassifier;
                    newMsgs.add(tmp);
                    tmp.print();
                    System.out.println();

                }  //        		  System.out.print("DNM\n");

            }

            i++;
        }
        msgList.addAll(newMsgs);
    }

    public void invertedCopy(List<Classifier> classifierList) {
        List<Classifier> ret = new ArrayList<>();

        for (Classifier cc : activated) {
            Classifier candidate = cc.inverseCopy();
            int already = classifierList.indexOf(candidate);
            if (already == -1) {
                already = ret.indexOf(candidate);
                if (already == -1) {
                    ret.add(candidate);
                    continue;
                }
                ret.get(already).strength = cc.strength * 1.01;
            } else
                classifierList.get(already).strength = cc.strength * 1.01;
        }
        classifierList.addAll(ret);
    }
}

class ClassifierComparatorRnd implements Comparator<Classifier> {
    public int compare(Classifier o1, Classifier o2) {
        double o1v = o1.getBid();
        double o2v = o2.getBid();

        return Double.compare(o2v, o1v);
    }
}


class ClassifierComparator implements Comparator<Classifier> {

    @Override
    public int compare(Classifier o1, Classifier o2) {
        return Double.compare(o2.strength, o1.strength);
    }
}
