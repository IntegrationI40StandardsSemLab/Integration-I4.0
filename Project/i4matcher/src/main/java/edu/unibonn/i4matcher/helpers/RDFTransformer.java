/**
 * Created by phil on 04.09.16.
 */
package edu.unibonn.i4matcher.helpers;

import net.sf.saxon.CollectionURIResolver;
import net.sf.saxon.Configuration;
import net.sf.saxon.FeatureKeys;
import net.sf.saxon.om.SequenceIterator;
import net.sf.saxon.trace.XSLTTraceListener;
import org.w3c.dom.Document;

import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import javax.xml.xpath.XPathConstants;
import java.io.*;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;

public class RDFTransformer {
    private String path;
    static {
        // use Saxon as XSLT transformer
        System.setProperty("java.xml.transform.TransformerFactory",
                "net.sf.saxon.TransformerFactoryImpl");
       System.setProperty("javax.xml.transform.TransformerFactory",
                "net.sf.saxon.TransformerFactoryImpl");
        // and as XPath processor
        System.setProperty("javax.xml.xpath.XPathFactory",
                "net.sf.saxon.xpath.XPathFactoryImpl");
        System.setProperty("javax.xml.xpath.XPathFactory:"
                        + XPathConstants.DOM_OBJECT_MODEL,
                "net.sf.saxon.xpath.XPathFactoryImpl");

        TransformerFactory factory = TransformerFactory.newInstance();
        Configuration saxonConfiguration = new Configuration();
        saxonConfiguration
                .setCollectionURIResolver(new CollectionURIResolver() {
                    @Override
                    public SequenceIterator resolve(String href, String base,
                                                    net.sf.saxon.expr.XPathContext context)
                            throws net.sf.saxon.trans.XPathException {
                        return null;
                    }

                });
        factory.setAttribute(FeatureKeys.CONFIGURATION, saxonConfiguration);
    }
    public RDFTransformer(String path){this.path = path;}

    private static boolean isEqual(InputStream i1, InputStream i2)
            throws IOException {

        ReadableByteChannel ch1 = Channels.newChannel(i1);
        ReadableByteChannel ch2 = Channels.newChannel(i2);

        ByteBuffer buf1 = ByteBuffer.allocateDirect(1024);
        ByteBuffer buf2 = ByteBuffer.allocateDirect(1024);

        try {
            while (true) {

                int n1 = ch1.read(buf1);
                int n2 = ch2.read(buf2);

                if (n1 == -1 || n2 == -1) return n1 == n2;

                buf1.flip();
                buf2.flip();

                for (int i = 0; i < Math.min(n1, n2); i++)
                    if (buf1.get() != buf2.get())
                        return false;

                buf1.compact();
                buf2.compact();
            }

        } finally {
            if (i1 != null) i1.close();
            if (i2 != null) i2.close();
        }
    }
    public byte[] transform(InputStream aml, String schema) {
        //TODO: rework to try-with-resources
        try {

            TransformerFactory tf = TransformerFactory.newInstance();
            XSLTTraceListener traceListener = new XSLTTraceListener();
            traceListener.setOutputDestination(new PrintStream("/dev/null"));
            tf.setAttribute(FeatureKeys.TRACE_LISTENER, traceListener);

            ClassLoader classLoader = getClass().getClassLoader();
            InputStream xsl = classLoader.getResource(schema + "..turtle.xsl").openStream();
//            System.out.println(classLoader.getResource(schema + "..turtle.xsl"));
            SchemaProvider schemaProvider = new SchemaProvider( schema, path);
            //Document xsl = schemaProvider.getDoc();
            Transformer transformer = tf.newTransformer(new StreamSource(xsl));
            System.out.print("I am healthy");


            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            StreamSource xmlSource = new StreamSource(aml);
            transformer.transform(xmlSource, new StreamResult(baos));
            byte[] formattedOutput = baos.toByteArray();
            baos.close();
            if (aml != null) {
                aml.close();
            }
            return formattedOutput;

        } catch (FileNotFoundException | TransformerException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new byte[0];
    }
/*
    public static void main(String[] args) throws IOException {
        InputStream aml1 = new FileInputStream("C:/Users/alink_000/Desktop/Uni Bonn/Lab semantic/gold standard/2.aml");
        //URL res = ClassLoader.getSystemResource("automationML" + "..turtle.xsl");
        //System.out.println(aml1.read());
        RDFTransformer RDFTransformer = new RDFTransformer();
        byte[] out = RDFTransformer.transform(aml1, "automationML");
        FileOutputStream fos = new FileOutputStream("out.ttl");
        fos.write(out);

        System.out.print("oke");
        //ClassLoader classLoader = getClass().getClassLoader();

    }
*/

}