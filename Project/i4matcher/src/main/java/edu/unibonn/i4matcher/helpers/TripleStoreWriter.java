package edu.unibonn.i4matcher.helpers;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.ResourceFactory;
import org.apache.jena.rdf.model.Statement;
import virtuoso.jena.driver.VirtGraph;
//import com.hp.hpl.jena.sparql.engine.main.QueryEngineMain;
import java.util.*;
import java.sql.SQLException;
import java.sql.DriverManager;
import java.sql.Connection;

/**
 * Created by phil on 21.09.16.
 */
public class TripleStoreWriter {

    public String write(Model m) {
        Locale locale = Locale.ENGLISH;
        ResourceBundle dbconn = ResourceBundle.getBundle("dbconn",
                locale);
        String localServer = dbconn.getString("srv");
        String user = dbconn.getString("user");
        String password = dbconn.getString("password");

        // connect to Virtuoso instance
        String graph = "new";
        VirtGraph vg = new VirtGraph( graph, localServer, user, password);
        System.out.println("HI");
        // convert triples
        Iterator<Statement> it = m.listStatements();
        while(it.hasNext()) {
            Statement s = it.next();
            vg.add(s.asTriple());
        }

        // close connection
        vg.close();
        System.out.println("Finished loading grapgh");
        return graph;

    }

    /**
     * Test with some dummy data.
     * @param args
     */
/*
    public static void main(String[] args) {
        Model m = ModelFactory.createDefaultModel();
        m.add(ResourceFactory.createResource("http://localhost"),
                ResourceFactory.createProperty("http://xmlns.com/foaf/0.1/name"),
                "localhost");

        TripleStoreWriter tsw = new TripleStoreWriter();
        tsw.write( m);


    }
*/
}