package edu.unibonn.i4matcher;

import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.ModelFactory;
import com.hp.hpl.jena.rdf.model.Statement;
import com.hp.hpl.jena.rdf.model.StmtIterator;

import java.io.*;
import java.net.URL;
import java.util.ArrayList;

/**
 * Created by Alina on 9/7/2016.
 */
public class Matcher {

    public Model match2Files (String filePath1, String filePath2) throws IOException {
        ArrayList<Statement> fileMap1 = getStatements(filePath1);
        ArrayList<Statement> fileMap2 = getStatements(filePath2);

        Model model = null;
        model = ModelFactory.createDefaultModel();



        String matchFileName = "match.ttl";
        FileWriter matchFile = new FileWriter(matchFileName);

        for(Statement statement1 : fileMap1){
            for(Statement statement2: fileMap2){
                if(statement1.getSubject().equals(statement2.getSubject())){
                    model.add(statement1.getSubject(), statement1.getPredicate(), statement1.getObject());
                    model.add(statement1.getSubject(), statement2.getPredicate(), statement2.getObject());
                }
            }
        }
        model.write(matchFile, "TTL") ;
        return model;
    }

    public ArrayList<Statement> getStatements (String rdfFile) throws IOException {

        URL ttlFile = ClassLoader.getSystemResource(rdfFile);
        InputStream inputStream = ttlFile.openStream();
        Model model = null;
        model = ModelFactory.createDefaultModel();
        // parses in turtle format
        model.read(new InputStreamReader(inputStream), null, "TURTLE");
        StmtIterator iterator = model.listStatements();
        ArrayList<Statement> listStatement = new ArrayList<Statement>();

        while (iterator.hasNext()) {
            Statement stmt = iterator.nextStatement();
            listStatement.add(stmt);
        }
        return listStatement;
    }

}
