package edu.unibonn.i4matcher;

import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.ModelFactory;
import com.hp.hpl.jena.rdf.model.Statement;
import com.hp.hpl.jena.rdf.model.StmtIterator;
import edu.unibonn.i4matcher.model.FileMeta;

import java.io.*;
import java.net.URL;
import java.util.ArrayList;
import java.util.LinkedList;

/**
 * Created by Alina on 9/7/2016.
 */
public class Matcher {

    public Model match2Files (LinkedList<FileMeta> files) throws IOException {
        ArrayList<Statement> fileMap1 = getStatements(files.get(0).getTtl());
        ArrayList<Statement> fileMap2 = getStatements(files.get(1).getTtl());

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

    private ArrayList<Statement> getStatements (byte[] rdfFile){

//        URL ttlFile = ClassLoader.getSystemResource(rdfFile);

        try(InputStream inputStream = new ByteArrayInputStream(rdfFile)){
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
        catch (IOException e){
            e.printStackTrace();
        }
        return new ArrayList<>();
    }
    //

}
