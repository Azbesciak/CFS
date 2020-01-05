package cfs;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Random;

public class Classifier {
	static char[] alphabet = { '0', '1', '#' };
	
	char[] condition;
	char[] action;
	
	double strength;
	double specifity;
	
	double cur_strength; //strength used in deciding which classifier emits msg (strength multiplied by random number)
	double bid;
	
	static int index_max = 0;
	int index;
	
	static double mutation_thr = 0.6; //on average this percent of the genotype is going to change.
	
	int condLength;
	int actionLength;
	
	boolean active; //classifier matched in this round;
	
	int lived = 0; //how many iterations the classifier has been in the system
	
	List <Message> generatedMsgs;
	
	private void calculateSpecifity() {
		int h = 0;
		for (char c : condition) {
			if (c == '#')
				h++;
		}
		this.specifity = (double)(condition.length - h) / (double)condition.length;
	}
		
	public Classifier(int condLength, int actionLength) {
	    this.condLength = condLength;
	    this.actionLength = actionLength;
	    
	    this.condition = new char[this.condLength];
	    this.action = new char[this.actionLength];
	    
	    this.generateRandom();
	    this.active = false;
	    
	    this.strength = 1.0;
	    calculateSpecifity();
	    
	    this.index = index_max++;
	    
	    generatedMsgs = new ArrayList<>();
	}
	
	public Classifier(String condition, String action) {
		this.condLength = condition.length();
	    this.actionLength = action.length();
	    
	    this.condition = condition.toCharArray();
	    this.action = action.toCharArray();
	    this.active = false;
	    
	    this.strength = 1.0;
	    
	    calculateSpecifity();
	    this.index = index_max++;
	    
	    generatedMsgs = new ArrayList<>();
	}
	
	public void generateRandom() {
		Random rand  = new Random();
		
		int i;
		for(i = 0; i < this.condLength ; i++) {
			condition[i] = Classifier.alphabet[rand.nextInt(3)]; 
		}
		
		for(i = 0; i < this.actionLength ; i++) {
			action[i] = Classifier.alphabet[rand.nextInt(3)]; 
		}
		
		action[0] = '0';
		action[1] = '0';
	}
	
	public void print() {
		int i;
		for(i = 0; i < this.condLength ; i++) {
			System.out.print(condition[i]); 
		}
		
		System.out.print(" / ");
		for(i = 0; i < this.actionLength ; i++) {
			System.out.print(action[i]); 
		}
		System.out.println();
	}
	
	public String toString() {
		DecimalFormat twoPlaces = new DecimalFormat("0.00");

		String ret = "[" + this.index + "] " + 
		(new String(condition)) + " / " + (new String(action)) + 
		" [st: " + twoPlaces.format(strength) + 
		" sp: " + twoPlaces.format(specifity) +
		//" a: " + Integer.toString(lived) +  
		"]";
		if(this.active) 
			ret += " (*)";
		
		return ret; 
	}

	public double getBid() {
		return this.strength * this.specifity;
	}
	
	
	public double payBid(double k, double tax) {
		bid = getBid() * k;
		//this.strength -= bid;
		//this.strength -= this.strength * tax;
		
		return bid;
	}
	
	public double getBidAmount() {
		return bid;
	}
	
	public void payTax(double life) {
		this.strength -= this.strength * life;
	}
	
	public double getCurrStrength () {
		return this.cur_strength * this.specifity;
	}
	
	
	public Message activate(Message msg) {
		char[] out = new char[this.actionLength];
		for(int i = 0; i <  this.actionLength; i++) {
			if(this.action[i] == '#')
				out[i] = msg.msg[i];
			else
				out[i] = this.action[i];
		}
		
		Message outMsg = new Message(out);
		outMsg.byClassifier = this;
		return outMsg;
	}
	
	public Message match(Message msg) {
		if(msg.msg.length != this.condLength)
			return null;
		for(int i = 0; i < this.condLength; i++) {
			if(this.condition[i] == '#')
				continue;
			if(this.condition[i] != msg.msg[i]) {
				this.active = false;
				return null;
			}
		}
		
		msg.used = true;
		this.active = true;
		return activate(msg);
	}
	
	public List<Message> matchAll(List <Message> msgList) {
	     List<Message> newMsgs = new ArrayList<Message>();

		for (Message curMsg : msgList) {
			//System.out.print("\t"); curMsg.print(); System.out.print(" -> ");
			Message tmp = this.match(curMsg);
			if (tmp != null) {
				newMsgs.add(tmp);
				if (curMsg.byClassifier != null) {
					//      			  this.getBidAmount() /
				}
			}
		}
      return newMsgs;
    }
	
	public List<Message> dumpMessagesAndPay() {
		for (Message curMsg : this.generatedMsgs) {
			if (curMsg.byClassifier != null) {
				curMsg.byClassifier.strength += this.getBidAmount() / this.generatedMsgs.size();
			}
		}
        return this.generatedMsgs;
	}
	
	public void mutate() {
		Random rand  = new Random();

		int i;
		for(i = 0; i < condition.length; i++) {
			if( rand.nextDouble() > mutation_thr) {
				condition[i] = Classifier.alphabet[rand.nextInt(3)];
			}
		}
		
		for(i = 0; i < action.length; i++) {
			if( rand.nextDouble() > mutation_thr) {
				action[i] = Classifier.alphabet[rand.nextInt(3)];
			}
		}
	}
	
//	
//	public Classifier copyMutate()  {
//		Classifier ret = new Classifier(this.condition.toString(), this.action.toString());
//		ret.mutate();
//		return  ret;
//	}
	
	public void crossover(Classifier c, int xpoints) {
		Random rand  = new Random();
		
		int i, a, b, j;
		for(i = 0; i < xpoints; i++) {
			a = rand.nextInt(condition.length);
			b = rand.nextInt( condition.length - a);
			
			char cur;
			for(j = a; j < b; j++) {
				cur = this.condition[j];
				this.condition[j] = c.condition[j];
				c.condition[j] = cur;
			}
		}
		
		for(i = 0; i < xpoints; i++) {
			a = rand.nextInt(action.length);
			b = rand.nextInt(action.length - a);
			
			char cur;
			for(j = a; j < b; j++) {
				cur = this.action[j];
				this.action[j] = c.action[j];
				c.action[j] = cur;
			}
		}
		
		
	}
	
	public Classifier breed(Classifier c) {
		Random rand  = new Random();
		char[] cond = new char[condition.length];
		char[] act = new char[action.length];
		for(int i = 0; i < condition.length; i++) {
			cond[i] = ( rand.nextInt(2) == 0? this.condition[i]: c.condition[i] );
		}

		for(int i = 0; i < action.length; i++) {
			act[i] = ( rand.nextInt(2) == 0? this.action[i]: c.action[i] );
		}

		Classifier.index_max --;
		return new Classifier(new String(cond), new String(act));
	}
	
	public Classifier inverseCopy() {
		Classifier inv = new Classifier(new String(this.condition), new String(this.action)); 
		
		inv.action[this.actionLength-1] = ((inv.action[this.actionLength-1] == '1') ? '0' : '1');
		inv.strength = this.strength + 0.1;
		return inv;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + Arrays.hashCode(action);
		result = prime * result + Arrays.hashCode(condition);
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Classifier other = (Classifier) obj;
		if (!Arrays.equals(action, other.action))
			return false;
		if (!Arrays.equals(condition, other.condition))
			return false;
		return true;
	}

	public static void main(String[] args) {
		List<Double> integers = Arrays.asList(1., 2., 3., 4., 5.);
		integers.sort((a,b)-> Double.compare(b,a));
		System.out.println(integers);
	}
	
}
