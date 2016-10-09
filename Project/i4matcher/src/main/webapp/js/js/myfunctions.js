var numberofFiles = 0;

$(function(){
    $('#responseFrame').on('load', function(){
        var iframe = document.getElementById('responseFrame');
        if (iframe.contentDocument && iframe.contentWindow.document) {
          var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
          var iframeContent = iframeDocument.all[3].childNodes["0"].data;
          if (iframeContent == '{"response":"new"}') {
            console.log('successful submit')
            $("#submitButton").append('<form class="query"><label>Integrated file has been created. <p>You can download it <a href="">here</a> and see its visualization <a href="">here.</a> <p>In order to retrieve any specific information, input your SPARQL query below:</label><br /><form class="queryField" placeholder=\'SELECT ?v WHERE { ?v ?p "cat" }\'></textarea><br /><input  type="submit" value="Run query"/></form>');
            $("#submit").hide();
          } else {
            console.log('server is alive but respons wrongly');
            alert('error while uploading');
          }
        } else {
          console.log('server is not alive');
          alert('error while uploading');
        }
    });
});

function handleFileSelect(evt) {
    var file = evt.target.files; // FileList object
    var f = file[0];
    var name = evt.target.name;
// Only process aml and opcua files.
    var dotInd = f.name.lastIndexOf('.');
    var type = f.name.substring(dotInd+1, f.name.length+1);
    var reader = new FileReader();
    if (type == 'aml')
    {
// Closure to capture the file information.
        reader.onload = (function(theFile)
        {
            return function(e)
            {
      // Add links to the file and its visualization.
                if (name == "file1") 
                {
                    var fileInput = document.getElementById('file1'),
                    p1 = document.createElement('P1');
                    p1.innerHTML = ['<br><br><a href="tree.html?type=aml&url='+e.target.result+'" target="_blank" title="Visualization of '+escape(theFile.name)+ 
                    '">Visualization</a><br><a href="'+e.target.result+'" download="'+escape(theFile.name)+'" title="'+escape(theFile.name)+'">Download the file</a>'];
                    fileInput.parentNode.insertBefore(p1, fileInput.nextSibling);
                    $("#file1").css("display","none");
                    $("#descr1").css("display","none");
                } 
                else if (name == "file2") 
                {
                    var fileInput = document.getElementById('file2'),
                    p2 = document.createElement('P2');
                    p2.innerHTML = ['<br><br><a href="tree.html?type=aml&url='+ e.target.result+'" target="_blank" title="Visualization of '+ escape(theFile.name)+ 
                    '">Visualization</a><br><a href="'+ e.target.result+'" download="'+ escape(theFile.name)+'" title="'+ escape(theFile.name)+'">Download the file</a>'];
                    fileInput.parentNode.insertBefore(p2, fileInput.nextSibling);
                    $("#file2").css("display","none");
                    $("#descr2").css("display","none");
                }
                else 
                {
                    console.log("Unknown element id");
                }
            };
        })(f);

// Read in the file as a data URL.
        reader.readAsDataURL(f);
        console.log('Success AML');
        document.getElementById("submitButton").innerHTML += [' '];
        numberofFiles = numberofFiles + 1;
        console.log(numberofFiles);

    } 
        else if (type == 'opcua') 
    {
// Closure to capture the file information.
        reader.onload = (function(theFile) 
        {
            return function(e) 
            {
                if (name == "file1")
                {
                    var fileInput = document.getElementById('file1'),
                    p1 = document.createElement('P1');
                    p1.innerHTML = ['<br><br><a href="tree.html?type=opcua&url='+ e.target.result+'" target="_blank" title="Visualization of '+ escape(theFile.name)+ 
                    '">Visualization</a><br><a href="'+ e.target.result+'" download="'+ escape(theFile.name)+'" title="'+ escape(theFile.name)+'">Download the file</a>'];
                    fileInput.parentNode.insertBefore(p1, fileInput.nextSibling);
                    $("#file1").css("display","none");
                    $("#descr1").css("display","none");
                } 
                else if (name == "file2") 
                {
                    var fileInput = document.getElementById('file2'),
                    p2 = document.createElement('P2');
                    p2.innerHTML = ['<br><br><a href="tree.html?type=opcua&url='+ e.target.result+'" target="_blank" title="Visualization of '+ escape(theFile.name)+ 
                    '">Visualization</a><br><a href="'+ e.target.result+'" download="'+ escape(theFile.name)+'" title="'+ escape(theFile.name)+'">Download the file</a>'];
                    fileInput.parentNode.insertBefore(p2, fileInput.nextSibling);
                    $("#file2").css("display","none");
                    $("#descr2").css("display","none");
                }
                else 
                {
                    console.log("Unknown element id");
                }
            };
        })(f);

// Read in the file as a data URL.
        reader.readAsDataURL(f);
        console.log('Success OPCUA');
        document.getElementById("submitButton").innerHTML += [' '];
        numberofFiles = numberofFiles + 1;
        console.log(numberofFiles);
    } 
    else 
    {
        alert ('Error: you should upload either AML or OPCUA file.')
    }
    var doc1 = document.getElementById("submitButton").innerHTML;
/*
    if (document.getElementById("submitButton").innerHTML =='  ') 
    {
        console.log("2 files uploaded");
        document.getElementById("submitButton").innerHTML = ['<button id="submit" type="submit">Submit files to the server</button>'];
    } 
    else if (document.getElementById("submitButton").innerHTML ==' ') {
        console.log("1 file uploaded");
    } 
    else 
    {
        console.log("unknown number of files uploaded");
    }
*/
    if (numberofFiles == 2) 
    {
        console.log("2 files uploaded");
        document.getElementById("submitButton").innerHTML = ['<button id="submit" type="submit">Submit files to the server</button>'];
    } 
    else if (numberofFiles==1) {
        console.log("1 file uploaded");
    } 
    else 
    {
        console.log("unknown number of files uploaded");
    }
}
    document.getElementById('file1').addEventListener('change', handleFileSelect, false);
    document.getElementById('file2').addEventListener('change', handleFileSelect, false);
function getQuery()
{

	var query23=encodeURI($(".queryZone").val());
	//var query23=btoa($(".queryZone").val());
	//console.log( btoa(query23));
	//var tr = document.createElement('try');
	//$('.queryTrialZone').append('</br><a href="http://localhost:8080/i4Matcher/rest/controller/get?query='+ query23+'" target="_blank" >Shot</a>');
	//tr.innerHTML = ['<a href="tree.html?type=opcua&url='+ query23+'" target="_blank" >Shot</a>'];
	console.log(query23);
	
	 $.get("http://localhost:8080/i4Matcher/rest/controller/get?query="+query23, function(data){
        alert("done");
		console.log(JSON.stringify(data));
		$('.queryTrialZone').append('</br><a href="tree.html?type=json&url=data:;base64,77u/'+  btoa(JSON.stringify(data))+'" target="_blank" >Shot</a>');
		$('.queryTrialZone').append('</br><a href="http://localhost:8080/i4Matcher/rest/controller/get?query='+  query23+'" target="_blank" download>Download</a>');
    });

}