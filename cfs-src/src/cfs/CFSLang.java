package cfs;
import javax.swing.*;          //This is the final package name.

import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;

/*
 * Entry point into to the application.
 * Small applet viewport with language selection buttons.
 */
public class CFSLang extends JApplet implements ActionListener, WindowListener {
	private static final long serialVersionUID = 1L;
	
	JButton pl, en;
	// This is a hack to avoid an ugly error message. i dare you to remove it.
    public CFSLang() {
        getRootPane().putClientProperty("defeatSystemEventQueueCheck", Boolean.TRUE);
    }

    public static void main(String[] a) {
    	
    }
    
    public void init() {
        Container cp = getContentPane();
        JPanel main = new JPanel(new GridLayout(2,1));
        pl = new JButton(new String("Interfejs Polski"));
        en = new JButton(new String("English Interface"));
        
        pl.addActionListener(this); pl.setActionCommand("pl");
        en.addActionListener(this); en.setActionCommand("en");
        main.add(pl);
        main.add(en);

        this.setPreferredSize(new Dimension(160,60));
        cp.add(main);
    }

	@Override
	public void actionPerformed(ActionEvent arg0) {
		pl.setEnabled(false);
		en.setEnabled(false);
		
		if(arg0.getActionCommand().equals("pl")) {
			Messages.setBundleName("messages_pl_ogonki");
		} else
		if(arg0.getActionCommand().equals("en")) {
			Messages.setBundleName("messages_en");
		}
		JFrame frame = new CFSdemo();
		
		frame.addWindowListener(this);
		
		frame.pack();
		frame.setResizable(false);
		frame.setLocationRelativeTo(null);
		frame.setVisible(true);
	}

	@Override
	public void windowActivated(WindowEvent arg0) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void windowClosed(WindowEvent e) {
		pl.setEnabled(true);
		en.setEnabled(true);
	}

	@Override
	public void windowClosing(WindowEvent e) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void windowDeactivated(WindowEvent e) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void windowDeiconified(WindowEvent e) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void windowIconified(WindowEvent e) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void windowOpened(WindowEvent e) {
		// TODO Auto-generated method stub
		
	}
}
