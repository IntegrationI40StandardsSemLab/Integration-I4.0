package edu.unibonn.i4matcher;

//import com.hp.hpl.jena.query.*;
import org.apache.jena.query.Query;
import org.apache.jena.query.QueryFactory;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.rdf.model.RDFNode;

import org.apache.jena.query.*;
import org.apache.jena.query.ResultSet;
import virtuoso.jena.driver.*;

import java.io.ByteArrayOutputStream;

/**
 * Created by Alina on 10/3/2016.
 */
public class SparqlQuery {

    /**
     * Executes a SPARQL query against a virtuoso url and prints results.
     */
    public static void main(String[] args) {

        String url;
        url = "jdbc:virtuoso://192.168.0.105:1111";

/*			STEP 1			*/
        VirtGraph set = new VirtGraph (url, "dba", "dba");

/*			STEP 2			*/


/*			STEP 3			*/
/*		Select all data in virtuoso	*/
        Query sparql = QueryFactory.create("SELECT * WHERE { GRAPH ?graph { ?s ?p ?o } } limit 100");

/*			STEP 4			*/
        VirtuosoQueryExecution vqe = VirtuosoQueryExecutionFactory.create (String.valueOf(sparql), set);

        ResultSet results = vqe.execSelect();
        while (results.hasNext()) {
            QuerySolution result = results.nextSolution();
            RDFNode graph = result.get("new");
            RDFNode s = result.get("s");
            RDFNode p = result.get("p");
            RDFNode o = result.get("o");
            //System.out.println(graph + " { " + s + " " + p + " " + o + " . }");

            // write to a ByteArrayOutputStream
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            ResultSetFormatter.outputAsJSON(outputStream, results);

// and turn that into a String
            String json = new String(outputStream.toByteArray());

            System.out.println(json);
        }
    }
}
