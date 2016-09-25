package edu.unibonn.i4matcher.controllers;

import java.io.ByteArrayInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedList;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.hp.hpl.jena.rdf.model.Model;

import edu.unibonn.i4matcher.model.FileMeta;
import edu.unibonn.i4matcher.helpers.*;
import edu.unibonn.i4matcher.Matcher;
@Controller
@RequestMapping("/controller")
public class FileController {
	LinkedList<FileMeta> files = new LinkedList<FileMeta>();
	FileMeta fileMeta = null;
	/***************************************************
	 * URL: /rest/controller/upload  
	 * upload(): receives files
	 * @param request : MultipartHttpServletRequest auto passed
	 * @param response : HttpServletResponse auto passed
	 * @return LinkedList<FileMeta> as json format
	 ****************************************************/
	@RequestMapping(value="/upload", method = RequestMethod.POST)
	public @ResponseBody String upload(MultipartHttpServletRequest request, HttpServletResponse response) {
 		System.out.println(request.getRequestHeaders().toString());
		//1. build an iterator
		 Iterator<String> itr =  request.getFileNames();
		 MultipartFile mpf;

		 while(itr.hasNext()){

			 mpf = request.getFile(itr.next()); 
			 System.out.println(mpf.getOriginalFilename() +" uploaded! "+files.size());

			 if(files.size() >= 10)
				 files.pop();
			 
			 fileMeta = new FileMeta();
			 fileMeta.setFileName(mpf.getOriginalFilename());
			 fileMeta.setFileSize(mpf.getSize()/1024+" Kb");
             try {
                 fileMeta.setBytes(mpf.getBytes());
             } catch (IOException e) {
                 // TODO Auto-generated catch block
                 e.printStackTrace();
             }

			 try {
				 String schema = DocumentIdentifier.getFileType(mpf.getOriginalFilename());
				 XSDValidator validator = new XSDValidator(schema+".xsd");
                 fileMeta.setFileType(schema);
				 //InputStream is = new ByteArrayInputStream(mpf.getBytes());
                 System.out.println(fileMeta.getBytes().length);
				 validator.validateAgainstXSD(new ByteArrayInputStream(fileMeta.getBytes()));
				 Kreker pecker = new Kreker();
				 byte[] ttl = pecker.krekerize(new ByteArrayInputStream(fileMeta.getBytes()), schema);
                 fileMeta.setTtl(ttl);
				 //is.close();
			 } catch (Exception ex){
				 ex.printStackTrace();
			 }

			 files.add(fileMeta);
			 
		 }
        Matcher matcher = new Matcher();
        try {
            Model model = matcher.match2Files(files);
            return model.toString();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "500";
 
	}
	/***************************************************
	 * URL: /rest/controller/get/{value}
	 * get(): get file as an attachment
	 * @param response : passed by the server
	 * @param value : value from the URL
	 * @return void
	 ****************************************************/
	@RequestMapping(value = "/get/{value}", method = RequestMethod.GET)
	 public void get(HttpServletResponse response,@PathVariable String value){
		 FileMeta getFile = files.get(Integer.parseInt(value));
		 try {		
			 	response.setContentType(getFile.getFileType());
			 	response.setHeader("Content-disposition", "attachment; filename=\""+getFile.getFileName()+"\"");
		        FileCopyUtils.copy(getFile.getBytes(), response.getOutputStream());
		 }catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
		 }
	 }
 
}