/**
 * Created by phil on 04.09.16.
 */
package edu.unibonn.i4matcher.helpers;

import net.sf.saxon.CollectionURIResolver;
import net.sf.saxon.Configuration;
import net.sf.saxon.FeatureKeys;
import net.sf.saxon.om.SequenceIterator;

import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import javax.xml.xpath.XPathConstants;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;

public class Kreker {
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
    public static void krekerize(InputStream aml) {
        try {
            //Document doc = k.generateStylesheet("aml", "java");
            //Builder builder = new Builder();
            //DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            //DocumentBuilder builder;
            //builder = dbf.newDocumentBuilder();
            //Document ss = builder.parse(new File("/home/phil/Documents/phil/workspace/krekerTest/src/xslt/transform-aml..turtle.xsl"));
            //System.out.println("preved");
            //System.out.println(doc.toXML());
            TransformerFactory tf = TransformerFactory.newInstance();

            //TODO:change hardcoded schema
            Transformer transformer = tf.newTransformer(new StreamSource("/home/phil/Documents/phil/workspace/krekerTest/src/xslt/transform-aml..turtle.xsl"));
            //String aml = "/home/phil/krextor/krextor/test/unit/extract/aml/ExampleTopology.aml";
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            StreamSource xmlSource = new StreamSource(aml);

            transformer.transform( xmlSource, new StreamResult( baos ) );
            String formattedOutput = baos.toString();
            //Nodes nodes = transform.transform(builder.build(aml));

            System.out.println(formattedOutput);
//            Document out = XSLTransform.toDocument(nodes);
//            System.out.println(out.toXML());

        } catch (TransformerConfigurationException e) {
            e.printStackTrace();
        } catch (TransformerException e) {
            e.printStackTrace();
        }

    }

}
