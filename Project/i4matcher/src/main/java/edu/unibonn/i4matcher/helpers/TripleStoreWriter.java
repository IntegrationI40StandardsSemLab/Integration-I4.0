package edu.unibonn.i4matcher.helpers;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.ModelFactory;
import com.hp.hpl.jena.rdf.model.ResourceFactory;
//import virtuoso.jena.driver.VirtGraph;
import java.util.*;
/**
 * Created by phil on 21.09.16.
 */
public class TripleStoreWriter {

    public void write(String graph, Model m) {
        Locale locale = Locale.ENGLISH;
        ResourceBundle dbconn = ResourceBundle.getBundle("dbconn",
                locale);
        String localServer = dbconn.getString("login");
        System.out.print(localServer);
        //String user = dbconn.getString("TripleStore.user");
        //String password = dbconn.getString("password");

        // connect to Virtuoso instance
        /*
        VirtGraph vg = new VirtGraph(graph, localServer, user, password);

        // convert triples
        Iterator<Statement> it = m.listStatements();
        while(it.hasNext()) {
            Statement s = it.next();
            vg.add(s.asTriple());
        }

        // close connection
        vg.close();
*/
    }

    /**
     * Test with some dummy data.
     * @param args
     */
    public static void main(String[] args) {
        Model m = ModelFactory.createDefaultModel();
        m.add(ResourceFactory.createResource("http://localhost"),
                ResourceFactory.createProperty("http://xmlns.com/foaf/0.1/name"),
                "localhost");
        TripleStoreWriter tsw = new TripleStoreWriter();
        tsw.write("new", m);
    }

}