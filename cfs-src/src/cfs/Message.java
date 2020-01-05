package cfs;
import java.util.Arrays;

/**
 * Input messages:
 * 	10 ??? ???
 * 	[2-4] - x-coords
 *  [5-7] - y-coords
 *  
 * @author qba
 *
 */


public class Message {
	static String code_input  = "10";
	static String code_output = "00";
	
	char[] msg;
	int length;
	
	Classifier byClassifier;
	
	boolean used = false;
	
	int age = 0;
	
	static int coord_len = 3;

	public static String leftPad(String s, int width) {
        return String.format("%" + width + "s", s).replace(' ', '0');
    }

	public Message(char[] msg) {
		this.msg = msg;
		this.length = msg.length;
	}
	
	public Message(int x, int y) {
		String tmp = Message.code_input + Message.leftPad(Integer.toBinaryString(x), Message.coord_len) + 
			Message.leftPad(Integer.toBinaryString(y), Message.coord_len);
		this.byClassifier = null;
		this.msg = tmp.toCharArray();
	}
	
	public void print() {
		System.out.print(this.msg);
	}
	
	public boolean isOutput() {
		return (new String(this.msg)).startsWith(code_output);
	}
	
	public String toString() {
		return new String(this.msg);// + "[ u: " + this.used + "]");
	}
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + Arrays.hashCode(msg);
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
		Message other = (Message) obj;
		return Arrays.equals(msg, other.msg);
	}
}
