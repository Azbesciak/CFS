package cfs;
import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.FileInputStream;
import java.util.MissingResourceException;
import java.util.PropertyResourceBundle;
import java.util.ResourceBundle;

public class Messages {
	private static String BUNDLE_NAME = "messages_en"; //$NON-NLS-1$
//
//	private static final ResourceBundle RESOURCE_BUNDLE = ResourceBundle.getBundle(BUNDLE_NAME);
	static ResourceBundle RESOURCE_BUNDLE = null;

	private Messages() {
	}

	public static void setBundleName(String bundle) {
//		try {
//
//			Reader reader = new BufferedReader(new InputStreamReader(new FileInputStream(bundle + ".properties")));
//			RESOURCE_BUNDLE = new PropertyResourceBundle(reader);
//		} catch (FileNotFoundException e) {
//			System.out.println("There is no such language pack.");
//		} catch (IOException e) {
//			System.out.println("Contact the developer.");
//		}
		RESOURCE_BUNDLE = PropertyResourceBundle.getBundle("cfs." + bundle);
	}

	public static String getString(String key) {
		try {
			return RESOURCE_BUNDLE.getString(key);
		} catch (MissingResourceException e) {
			return BUNDLE_NAME + '!' + key + '!';
		}
	}
}
