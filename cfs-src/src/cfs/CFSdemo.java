package cfs;

import javax.swing.*;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;
import javax.swing.table.DefaultTableModel;
import javax.swing.text.MaskFormatter;
import java.awt.*;
import java.awt.event.*;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@SuppressWarnings("serial")
public class CFSdemo extends JFrame implements MouseListener, MouseMotionListener, ActionListener, ChangeListener, WindowListener {
    JLayeredPane layeredPane;
    JPanel board;

    JList UImessageList;
    JTable UIclassifierList;

    JTextField TAaction, TAcondition;
    JLabel classifierListLabel;
    JLabel answer, laccuracy;

    int init_population = 20; //initial population size; default value

    Color curTile; //current examined tile on the board (selected either by user clicking on it or by the loop that checks all the tiles)
    int curTileIndex = 0; //index of the tile that we are asking for; see above

    List<Message> msgList = new ArrayList<Message>();
    List<Classifier> classifierList = new ArrayList<Classifier>();
    List<Classifier> prevAClassifiers = new ArrayList<Classifier>();

    BB bb = new BB(); //BucketBrigade instance
    GA ga = new GA(); //GeneticAlgorithm instance

    double accuracy = 0; //current accuracy of the classifier
    double accuracy_cumulated = 0; //current accuracy aggregated over whole board
    int accuracy_data_points = 0;

    Timer sweeping_timer = new Timer(5, this);
    int panel_sleep = 70; //how much app sleeps in the startCycle(); currently unused
    boolean mouse_over_board = false;

    DecimalFormat twoPlaces = new DecimalFormat("0.00"); //shortcut for displaying values all-around; Change the format for differenc accuracy

    private void initBoard() {
        for (int i = 0; i < 64; i++) {
            JPanel square = new JPanel(new BorderLayout()) {

                @Override
                public void paint(Graphics g) {
                    super.paint(g);
                    int box = 10;
                    g.fillRect(((this.getWidth() - box) / 2), (this.getHeight() - box) / 2, box, box);
                }
            };
            board.add(square);
            square.setBorder(BorderFactory.createMatteBorder(1, 1, 0, 0, Color.gray));
        }
    }

    private void patternChess() {
        for (int i = 0; i < 64; i++) {
            JPanel square = (JPanel) board.getComponent(i);

            int row = (i / 8) % 2;
            if (row == 0)
                square.setBackground(i % 2 == 0 ? Color.black : Color.white);
            else
                square.setBackground(i % 2 == 0 ? Color.white : Color.black);
        }
    }

    private void patternVertical() {
        for (int i = 0; i < 64; i++) {
            JPanel square = (JPanel) board.getComponent(i);

            int row = (i / 8) % 2;
            if (row == 0) {
                square.setBackground(Color.white);
            } else {
                square.setBackground(Color.black);
            }
        }
    }

    private void patternHorizontal() {
        for (int i = 0; i < 64; i++) {
            JPanel square = (JPanel) board.getComponent(i);

            int column = i % 2;
            if (column == 0) {
                square.setBackground(Color.white);
            } else {
                square.setBackground(Color.black);
            }
        }
    }

    private void patternHaH() {
        for (int i = 0; i < 32; i++) {
            JPanel square = (JPanel) board.getComponent(i);
            square.setBackground(Color.white);
        }
        for (int i = 32; i < 64; i++) {
            JPanel square = (JPanel) board.getComponent(i);
            square.setBackground(Color.black);
        }
    }

    private void patternWhite() {
        for (int i = 0; i < 64; i++) {
            JPanel square = (JPanel) board.getComponent(i);
            square.setBackground(Color.white);
        }
    }


    private void buildGUI() {
        this.setTitle(Messages.getString("CFSdemo.0"));
        Dimension boardSize = new Dimension(500, 500);

        Container content = getContentPane();
        content.setBackground(Color.lightGray);
        content.setPreferredSize(new Dimension(835, 505));
        this.setResizable(false);
        this.setSize(new Dimension(813, 500));
        JPanel controlArea = new JPanel(new GridLayout(3, 1));
        controlArea.setMaximumSize(new Dimension(813, 500));

        JPanel UImessageListPanel = new JPanel(new BorderLayout(2, 2));
        UImessageListPanel.add(new JLabel(Messages.getString("CFSdemo.1")), BorderLayout.PAGE_START);
        UImessageList = new JList(new DefaultListModel());
        JScrollPane scrollPane1 = new JScrollPane(UImessageList);
        UImessageListPanel.add(scrollPane1, BorderLayout.CENTER);
        controlArea.add(UImessageListPanel);


        JPanel UIClassifierListPanel = new JPanel(new BorderLayout(2, 2));
        classifierListLabel = new JLabel(Messages.getString("CFSdemo.2"));
        UIClassifierListPanel.add(classifierListLabel, BorderLayout.PAGE_START);
        UIClassifierListPanel.setPreferredSize(new Dimension(330, 200));

        String[] columnNames = {
                Messages.getString("CFSdemo.3"),
                Messages.getString("CFSdemo.4"),
                Messages.getString("CFSdemo.5"),
                Messages.getString("CFSdemo.6"),
                Messages.getString("CFSdemo.7")
        };
        Object[][] data = {{}};

        DefaultTableModel tableModel = new DefaultTableModel(data, columnNames) {
            @Override
            public boolean isCellEditable(int row, int column) {
                //all cells false
                return false;
            }
        };
        UIclassifierList = new JTable(tableModel);
        UIclassifierList.setCellSelectionEnabled(false);

        UIclassifierList.getColumnModel().getColumn(0).setPreferredWidth(30); //index
        UIclassifierList.getColumnModel().getColumn(1).setPreferredWidth(50); //condition
        UIclassifierList.getColumnModel().getColumn(2).setPreferredWidth(50); //action
        UIclassifierList.getColumnModel().getColumn(3).setPreferredWidth(70); //strength
        UIclassifierList.getColumnModel().getColumn(4).setPreferredWidth(20); //specifity

        JScrollPane scrollPane2 = new JScrollPane(UIclassifierList);
        UIClassifierListPanel.add(scrollPane2);

        JPanel button_panel = new JPanel(new FlowLayout());

        try {
            this.TAcondition = new JFormattedTextField(new MaskFormatter("########"));
            this.TAaction = new JFormattedTextField(new MaskFormatter("########"));
        } catch (ParseException e) {
            System.out.println("Contact the developer.");
        }
        TAcondition.setColumns(10);
        TAaction.setColumns(10);
        button_panel.add(TAcondition);
        button_panel.add(new JLabel(Messages.getString("CFSdemo.9")));

        button_panel.add(TAaction);
        JButton new_classifier = new JButton(Messages.getString("CFSdemo.11"));
        new_classifier.setActionCommand(Messages.getString("CFSdemo.12"));
        new_classifier.addActionListener(this);
        new_classifier.setToolTipText(Messages.getString("CFSdemo.91"));
        button_panel.add(new_classifier);

        UIClassifierListPanel.add(button_panel, BorderLayout.PAGE_END);

        controlArea.add(UIClassifierListPanel);

        JLabel l;
        //controlTabs.addTab(title, component);
        JTabbedPane controlTabs = new JTabbedPane();

        JPanel controlsPanel = new JPanel(new SpringLayout());
        controlTabs.addTab(Messages.getString("CFSdemo.13"), null, controlsPanel, Messages.getString("CFSdemo.14"));   //$NON-NLS-2$

        JPanel panel = new JPanel(new FlowLayout());

        JButton start = new JButton(Messages.getString("CFSdemo.15"));
        start.setActionCommand(Messages.getString("CFSdemo.16"));
        start.addActionListener(this);
        panel.add(start);

        JButton reset = new JButton(Messages.getString("CFSdemo.17"));
        reset.setActionCommand(Messages.getString("CFSdemo.18"));
        reset.addActionListener(this);
        panel.add(reset);

        controlsPanel.add(panel);

        panel = new JPanel(new FlowLayout());
        l = new JLabel(Messages.getString("CFSdemo.21"));
        panel.add(l);
        laccuracy = new JLabel(Messages.getString("CFSdemo.22"));
        panel.add(laccuracy);
        controlsPanel.add(panel);

        String[] patterns = {Messages.getString("CFSdemo.23"), Messages.getString("CFSdemo.24"), Messages.getString("CFSdemo.25"), Messages.getString("CFSdemo.26"), Messages.getString("CFSdemo.90")};
        JComboBox cb_pattern = new JComboBox(patterns);
        cb_pattern.setSelectedIndex(3);

        panel = new JPanel(new FlowLayout());
        l = new JLabel(Messages.getString("CFSdemo.27"));
        l.setLabelFor(cb_pattern);
//
        panel.add(l);
        panel.add(cb_pattern);
        cb_pattern.addActionListener(this);
        cb_pattern.setActionCommand(Messages.getString("CFSdemo.28"));
        controlsPanel.add(panel);

        SpringUtilities.makeCompactGrid(controlsPanel,
                3, 1, //rows, cols
                6, 6,        //initX, initY
                6, 6);       //xPad, yPad


        JPanel gaPanel = new JPanel(new SpringLayout());
        controlTabs.addTab(Messages.getString("CFSdemo.29"), null, gaPanel, Messages.getString("CFSdemo.30"));   //$NON-NLS-2$

        l = new JLabel(Messages.getString("CFSdemo.31"), JLabel.TRAILING);
        gaPanel.add(l);
        JSpinner s_population = new JSpinner(new SpinnerNumberModel(this.init_population, 1, 100, 1));
        s_population.setName("s_population");
        s_population.addChangeListener(this);

        s_population.setToolTipText(Messages.getString("CFSdemo.33"));

        l.setLabelFor(s_population);
        gaPanel.add(s_population);

        l = new JLabel(Messages.getString("CFSdemo.34"), JLabel.TRAILING);
        gaPanel.add(l);
        JSpinner s_turnover = new JSpinner(new SpinnerNumberModel(this.ga.strengthThr, 0, 1, 0.01));
        s_turnover.setName("kill_threshold");
        s_turnover.addChangeListener(this);
        l.setLabelFor(s_turnover);
        gaPanel.add(s_turnover);
        s_turnover.setToolTipText(Messages.getString("CFSdemo.36"));


        l = new JLabel(Messages.getString("CFSdemo.37"), JLabel.TRAILING);
        gaPanel.add(l);
        JSpinner s_mutations = new JSpinner(new SpinnerNumberModel(this.ga.mutation, 0, 1, 0.01));
        s_mutations.setName("s_mutations");
        s_mutations.addChangeListener(this);
        l.setLabelFor(s_mutations);
        gaPanel.add(s_mutations);
        s_mutations.setToolTipText(Messages.getString("CFSdemo.39"));

        l = new JLabel(Messages.getString("CFSdemo.40"), JLabel.TRAILING);
        gaPanel.add(l);
        JSpinner s_elitarism = new JSpinner(new SpinnerNumberModel(this.ga.elitarism, 0, 1, 0.01));
        s_elitarism.setName("s_elitarism");
        s_elitarism.addChangeListener(this);
        l.setLabelFor(s_elitarism);
        gaPanel.add(s_elitarism);
        s_elitarism.setToolTipText(Messages.getString("CFSdemo.42"));

        l = new JLabel();
        gaPanel.add(l);

        SpringUtilities.makeCompactGrid(gaPanel,
                4, 2, //rows, cols
                6, 6,        //initX, initY
                6, 6);       //xPad, yPad


        JPanel bbPanel = new JPanel(new SpringLayout());
        controlTabs.addTab(Messages.getString("CFSdemo.43"), null, bbPanel, Messages.getString("CFSdemo.44"));   //$NON-NLS-2$

        l = new JLabel(Messages.getString("CFSdemo.45"), JLabel.TRAILING);
        bbPanel.add(l);
        JSpinner s_life_tax = new JSpinner(new SpinnerNumberModel(this.bb.life_tax, 0, 1.0, 0.01));
        s_life_tax.setName("s_life_tax");
        s_life_tax.addChangeListener(this);
        l.setLabelFor(s_life_tax);
        bbPanel.add(s_life_tax);
        s_life_tax.setToolTipText(Messages.getString("CFSdemo.47"));


        l = new JLabel(Messages.getString("CFSdemo.48"), JLabel.TRAILING);
        bbPanel.add(l);
        JSpinner s_bid_tax = new JSpinner(new SpinnerNumberModel(this.bb.bid_tax, 0, 1.0, 0.01));
        s_bid_tax.setName("s_bid_tax");
        s_bid_tax.addChangeListener(this);
        l.setLabelFor(s_bid_tax);
        bbPanel.add(s_bid_tax);
        s_bid_tax.setToolTipText(Messages.getString("CFSdemo.50"));

        l = new JLabel(Messages.getString("CFSdemo.51"), JLabel.TRAILING);
        bbPanel.add(l);
        JSpinner s_k = new JSpinner(new SpinnerNumberModel(this.bb.k, 0, 1.0, 0.05));
        s_k.setName("s_k");
        s_k.addChangeListener(this);
        l.setLabelFor(s_k);
        bbPanel.add(s_k);
        s_k.setToolTipText(Messages.getString("CFSdemo.53"));

        l = new JLabel(Messages.getString("CFSdemo.54"), JLabel.TRAILING);
        bbPanel.add(l);
        JSpinner s_winners = new JSpinner(new SpinnerNumberModel(this.bb.winners, 1, 20, 1));
        s_winners.setName("s_winners");
        s_winners.addChangeListener(this);
        l.setLabelFor(s_winners);
        bbPanel.add(s_winners);
        s_winners.setToolTipText(Messages.getString("CFSdemo.56"));

        SpringUtilities.makeCompactGrid(bbPanel,
                4, 2, //rows, cols
                6, 6,        //initX, initY
                6, 6);       //xPad, yPad


        controlArea.add(controlTabs);
        content.add(controlArea, BorderLayout.EAST);

        // Use a Layered Pane for this this application
        layeredPane = new JLayeredPane();
        content.add(layeredPane, BorderLayout.WEST);
        layeredPane.setPreferredSize(boardSize);
        layeredPane.addMouseListener(this);
        layeredPane.addMouseMotionListener(this);

        board = new JPanel();
        layeredPane.add(board, JLayeredPane.DEFAULT_LAYER);

        board.setBorder(BorderFactory.createLineBorder(Color.black, 2));
        board.setLayout(new GridLayout(8, 8));
        board.setPreferredSize(boardSize);
        board.setBounds(0, 0, boardSize.width, boardSize.height);
        board.addMouseListener(this);

        initBoard();
        patternHaH();

        addWindowListener(this);

    }

    public CFSdemo() {
        this.buildGUI();
        this.init();
        this.updateClassifierList();
        this.updateMessagesList();
    }

    public void updateClassifierList() {
        DefaultTableModel tableModel = (DefaultTableModel) UIclassifierList.getModel();

        tableModel.setRowCount(0); //clears the table

        classifierList.sort(new ClassifierComparator());
        for (Classifier cc : classifierList) {
            Object[] data = {cc.index, new String(cc.condition), new String(cc.action), cc.strength, cc.specifity};
            tableModel.addRow(data);
        }
        classifierListLabel.setText(Messages.getString("CFSdemo.57") + classifierList.size() + Messages.getString("CFSdemo.58"));   //$NON-NLS-2$
        UIclassifierList.doLayout();
    }

    public void updateMessagesList() {
        DefaultListModel<String> listModel = (DefaultListModel<String>) UImessageList.getModel();
        listModel.clear();

        for (Message curMessage : msgList) {
            if (curMessage.byClassifier != null)
                listModel.addElement(curMessage.toString() + Messages.getString("CFSdemo.59") + curMessage.byClassifier.index + Messages.getString("CFSdemo.60"));   //$NON-NLS-2$
            else
                listModel.addElement(curMessage.toString());
        }
    }


    public void updateGlobalAccuracy(double q) {
        if (accuracy_data_points == 64) {
            accuracy_data_points = 0;
            accuracy = 0;
            accuracy_cumulated = 0;
//			laccuracy.setText("0.0");
        }

        if (q < 0)
            q = 0;
        accuracy_cumulated += q;
        accuracy = accuracy_cumulated / ++accuracy_data_points;
    }

    public double getEffect() {
        int ret = 0;
        int i = 0;
        for (Message curMsg : msgList) {
            if (new String(curMsg.msg).startsWith(Message.code_output)) {
                ret += Character.getNumericValue(curMsg.msg[7]);
                i++;
            }
        }

        double a = (double) ret / (double) i;
        if (a >= 0)
            return a;
        return -1;
    }

    public void startCycle(Component c, boolean mouse) {
        if (mouse_over_board) {
            board.getComponent(curTileIndex).setForeground(Color.RED);
        }
        board.getComponent(curTileIndex).paint(board.getComponent(curTileIndex).getGraphics());

        this.bb.match_compete(classifierList, msgList);
      double effect = this.getEffect();
//      System.out.println("efekt " + effect);
      this.evaluateEffect(effect, c, mouse);

        this.ga.execute(classifierList);

        this.updateClassifierList();
        this.updateMessagesList();

        msgList.clear();

        Iterator<Classifier> it = classifierList.iterator();
        while (it.hasNext()) {
            Classifier cc = (Classifier) it.next();
        }
    }

    public void evaluateEffect(double ans, Component c, boolean mouse) {
//		System.out.println("Effect( BLACK [0 ; 1] WHITE ): " + ans);
        double quality = 0;
        if (ans > -1) {
            if (curTile == Color.black) { //0 = black
                quality = 1.0 - ans;
            } else //1 = white
                quality = ans;
        }

        if (ans == -1) {
            if (mouse) {
                JOptionPane.showMessageDialog(this, Messages.getString("CFSdemo.63"));
            }
            c.setForeground(Color.gray);
        } else if (ans > 0.5) {
            if (mouse) {
                System.out.println("mysza");
                JOptionPane.showMessageDialog(this, Messages.getString("CFSdemo.64") + twoPlaces.format(quality) + Messages.getString("CFSdemo.65"));
            }
            c.setForeground(Color.white);
        } else {
            if (mouse) {
                JOptionPane.showMessageDialog(this, Messages.getString("CFSdemo.66") + twoPlaces.format(quality) + Messages.getString("CFSdemo.67"));
            }
            c.setForeground(Color.black);
        }

        if (quality == 0 && ans != -1) {
            this.bb.invertedCopy(classifierList);
        }

        this.bb.payCurrClassifiers(quality);
        updateGlobalAccuracy(quality);
    }

    public void init() {
        classifierList.clear();
        msgList.clear();

        Classifier.index_max = 0;

        for (int i = 0; i < init_population; i++) {
            classifierList.add(new Classifier(8, 8));
        }
        sweeping_timer.setActionCommand("ga_timer");
    }

    public void sweeping_timer_action() {
        if (curTileIndex >= 63) {
            laccuracy.setText(twoPlaces.format(accuracy));
            curTileIndex = -1;
        }
//		System.out.println("Examining tile: " + curTileIndex);

        Component c = board.getComponent(++curTileIndex);
        curTile = c.getBackground();

        int x = (c.getX() - 2) / c.getWidth();
        int y = (c.getY() - 2) / c.getHeight();

        Message msg = new Message(x, y);
        msgList.add(msg);

        startCycle(c, false);
    }


    public static void main(String[] args) {
        Messages.setBundleName("messages_pl_ogonki");
        JFrame frame = new CFSdemo();
//		frame.setDefaultCloseOperation(EXIT_ON_CLOSE);
        frame.pack();
        frame.setResizable(true);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (Messages.getString("CFSdemo.69").equals(e.getActionCommand())) {

            Pattern p = Pattern.compile("^[01#]{8}$");
            Matcher m = p.matcher(this.TAcondition.getText());
            boolean result = m.find();

            if (result) {
                if (p.matcher(this.TAaction.getText()).find()) {
                    this.classifierList.add(new Classifier(this.TAcondition.getText(), this.TAaction.getText()));
                    this.updateClassifierList();
                    return;
                }
            }

            System.out.println("Something's wrong with the provided classifier. Try again!");

        } else if (e.getActionCommand().equals("start")) {
            if (sweeping_timer.isRunning()) {
                sweeping_timer.stop();
                ((JButton) e.getSource()).setText(Messages.getString("CFSdemo.71"));
            } else {
                sweeping_timer.start();
                ((JButton) e.getSource()).setText(Messages.getString("CFSdemo.72"));
            }

        } else if (e.getActionCommand().equals("reset")) {
            init();
            updateClassifierList();
            updateMessagesList();

        } else if (e.getActionCommand().equals("ga_timer")) {
            sweeping_timer_action();

        } else if (e.getActionCommand().equals("cb_pattern")) {
            //System.out.println( ((JComboBox)e.getSource()).getSelectedIndex() );
            switch (((JComboBox) e.getSource()).getSelectedIndex()) {
                case 0:
                    patternChess();
                    break;
                case 1:
                    patternVertical();
                    break;
                case 2:
                    patternHorizontal();
                    break;
                case 3:
                    patternHaH();
                    break;
                case 4:
                    patternWhite();
                    break;
                default:
            }
        }

    }

    @Override
    public void stateChanged(ChangeEvent e) {
        JSpinner cur = (JSpinner) e.getSource();
        if (cur.getName().equals("kill_threshold")) {
            this.ga.strengthThr = ((SpinnerNumberModel) cur.getModel()).getNumber().doubleValue();
        } else if (cur.getName().equals("s_mutations")) {
            this.ga.mutation = ((SpinnerNumberModel) cur.getModel()).getNumber().doubleValue();
        } else if (cur.getName().equals("s_life_tax")) {
            this.bb.life_tax = ((SpinnerNumberModel) cur.getModel()).getNumber().doubleValue();
        } else if (cur.getName().equals("s_bid_tax")) {
            this.bb.bid_tax = ((SpinnerNumberModel) cur.getModel()).getNumber().doubleValue();
        } else if (cur.getName().equals("s_winners")) {
            this.bb.winners = ((SpinnerNumberModel) cur.getModel()).getNumber().intValue();
        } else if (cur.getName().equals("s_k")) {
            this.bb.k = ((SpinnerNumberModel) cur.getModel()).getNumber().doubleValue();
        } else if (cur.getName().equals("s_population")) {
            this.init_population = ((SpinnerNumberModel) cur.getModel()).getNumber().intValue();
        } else if (cur.getName().equals("s_elitarism")) {
            this.ga.elitarism = ((SpinnerNumberModel) cur.getModel()).getNumber().intValue();
        }

    }

    public void mousePressed(MouseEvent e) {

        Component c = board.findComponentAt(e.getX(), e.getY());

        if (e.getButton() == MouseEvent.BUTTON1) {
            if (c.getBackground().equals(Color.black))
                c.setBackground(Color.white);
            else
                c.setBackground(Color.black);
        } else if (e.getButton() == MouseEvent.BUTTON3) {
            int x = (c.getX() - 2) / c.getWidth();
            int y = (c.getY() - 2) / c.getHeight();

//			System.out.println("x: " + c.getX() + "[" + x + "]" + " y: " + "[" + y + "]" + c.getY());

            //msgList.clear();
            Message msg = new Message(x, y);
            msgList.add(msg);

            curTile = c.getBackground();

            this.startCycle(c, true);

        }
    }

    public void mouseReleased(MouseEvent e) {
    }

    public void mouseClicked(MouseEvent e) {
    }

    public void mouseMoved(MouseEvent e) {
    }

    public void mouseEntered(MouseEvent e) {
        if (e.getComponent().equals(board)) {
            mouse_over_board = true;
        }
    }

    public void mouseExited(MouseEvent e) {
        if (e.getComponent().equals(board)) {
            mouse_over_board = false;
        }
    }

    public void mouseDragged(MouseEvent e) {
    }

    @Override
    public void windowActivated(WindowEvent e) {
    }

    @Override
    public void windowClosed(WindowEvent e) {
    }

    @Override
    public void windowClosing(WindowEvent e) {
        // TODO Auto-generated method stub
        sweeping_timer.stop();
        this.dispose();
    }

    @Override
    public void windowDeactivated(WindowEvent e) {
    }

    @Override
    public void windowDeiconified(WindowEvent e) {
    }

    @Override
    public void windowIconified(WindowEvent e) {
    }

    @Override
    public void windowOpened(WindowEvent e) {
    }

}
