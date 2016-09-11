package edu.unibonn.i4matcher.controllers;

import java.io.ByteArrayInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
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

import edu.unibonn.i4matcher.model.FileMeta;
import edu.unibonn.i4matcher.helpers.*;

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
	public @ResponseBody LinkedList<FileMeta> upload(MultipartHttpServletRequest request, HttpServletResponse response) {
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
			 fileMeta.setFileType(mpf.getContentType());

			 try {
				 String schema = DocumentIdentifier.getFileType(mpf.getOriginalFilename());
				 XSDValidator validator = new XSDValidator(schema);
				 //
				 InputStream is = new ByteArrayInputStream(mpf.getBytes());
				 validator.validateAgainstXSD(is);
				 Kreker pecker = new Kreker();
				 pecker.krekerize(is);
				 is.close();
			 } catch (Exception ex){
				 ex.printStackTrace();
			 }

			 try {
				fileMeta.setBytes(mpf.getBytes());
//
			} catch (IOException e) {
//				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			 files.add(fileMeta);
			 
		 }
		return files;
 
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
