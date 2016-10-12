var numberOfFiles = 0;
var dataType;

function submitFormFunc() {
    var form = document.forms.submitForm;
    var formData = new FormData(form);
	var selection = $("#matchingChoice option:selected").val();
    $("#submitButton").html('<img src="img/upload.gif" class="uploadGif"/>');
    var xhr = new XMLHttpRequest();
	var postURL = '';
	switch(selection) {
		case 'str': 
			postURL = "rest/controller/upload"; //\/matching/strict
			break;
		case 'sft':
			postURL = "rest/controller/upload/matching/soft";
			break;
		case 'non':
			postURL = "rest/controller/upload/matching/nonstrict";
			break;
		default:
			console.log("unknown matching choice");
			break;
	}
    xhr.open("POST", postURL);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 3) {
            if(xhr.status == 200) {
                data = xhr.responseText;
				responseData = JSON.parse(data);
                if (responseData.response) {
                    console.log('successful submit');
					var dataInt = responseData.response;
					$.get('http://localhost:8890/sparql?default-graph-uri=&query=select+*+from+%3Cjdbc%3Avirtuoso%3A%2F%2Flocalhost%3A1111%2F'+dataInt+'%3E+where+%7B+%3Fs+%3Fp+%3Fo+%7D&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on', function (dataGet){
						var key = Date.now();
						localStorage[key] = "data:;base64,77u/"+btoa(JSON.stringify(dataGet));
						console.log('successful request for integrated file');
						$("#downloadArea").append('Integrated file has been created. <p>Choose the file format for downloading: <select name="type" id="choice"><option selected value="json">JSON</option><option value="ttl">Turtle</option><option value="xml">XML</option><option value="html">HTML</option></select> <input type="button" onclick="downloadInt('+dataInt+')" value="Download"/>');
						//$("#downloadArea").append('');
                        $("#submitButton").html('');
                        $("#submitButton").append('<div class="queryTrialZone"><label>You can see the visualization of the integrated file <a href="tree.html?type=json&key='+key+'" target="_blank" >here.</a> <p>In order to retrieve any specific information, input your SPARQL query below:</label><br /><textarea class="queryField" placeholder=\'select * from $table$ where { ?s ?p ?o }\'></textarea><br><input type="button" onclick="getQuery('+dataInt+')" value="Run Query"/><span class="comment">*use $table$ as a table name</span></div><div class="moreInfo"></div>');
						$("#submitButton").append('');
					});
                } else {
                    $("#submitButton").html('Something went wrong! Try to reload the page!');
                }
            }
        } else if (xhr.readyState == 4) {
            if(xhr.status == 0) {
                $("#submitButton").html("Sorry, server doesn't respond!");
            }
        }
    }
    xhr.send(formData);
}
function downloadInt(dataInt) {
    var selection = $("#choice option:selected").val();
    var query = encodeURI('select * from <jdbc:virtuoso://localhost:1111/'+dataInt+'> where { ?s ?p ?o} ');
	var format = '';
	var dataType = '';
	switch(selection) {
		case 'json': 
			format = 'application/sparql-results%2Bjson';
			dataType = 'json';
			break;
		case 'ttl': 
			format = encodeURI('text/turtle');
			dataType = 'ttl';
			break;
		case 'xml': 
			format = 'application/sparql-results%2Bxml';
			dataType = 'xml';
			break;
		case 'html': 
			format = encodeURI('text/html');
			dataType = 'html';
			break;
		default:
			console.log("unknown format");
			break;
	}
    var timeout = encodeURI('0');
    var debug = encodeURI('on');
	var tmpURL = 'http://localhost:8890/sparql?default-graph-uri=&query='+query+'&format='+format+'&timeout='+timeout+'&debug='+debug;
    $.get('http://localhost:8890/sparql?default-graph-uri=&query='+query+'&format='+format+'&timeout='+timeout+'&debug='+debug, function (data){
        console.log(data);
        $("#downloadArea").html=('');
        $("#downloadArea").append('<a href="data:;base64,77u/'+btoa(data)+'" download="integrated_file.'+dataType+'" id="downloadInt'+dataType+'" class="hiddenLink"></a>');
        document.getElementById("downloadInt"+dataType).click();
    }, "text");
}
function getQuery(dataInt) {
    var query = encodeURI($(".queryField").val()).replace('$table$','<jdbc:virtuoso://localhost:1111/'+dataInt+'>');
    console.log(query);
    $.get('http://localhost:8890/sparql?default-graph-uri=&query='+query+'&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on', function (data){
        console.log('successful request for query');
        var key = Date.now();
        localStorage[key] = "data:;base64,77u/"+btoa(data.replace('\n',''));
        $('.moreInfo').html('');
        setTimeout(function(){$('.moreInfo').html('<a href="tree.html?type=json&key='+key+'" target="_blank" >Visualization</a></br><a href="data:;base64,77u/'+btoa(data)+'" target="_blank" download="query_result.json">Download the result in JSON</a>');}, 500);
    }, "text");
}

function handleFileSelect(evt) {
    var file = evt.target.files; // FileList object
    var f = file[0];
    var name = evt.target.name;
// Only process aml and opcua files.
    var dotInd = f.name.lastIndexOf('.');
    var type = f.name.substring(dotInd+1, f.name.length+1);
    var reader = new FileReader();
    if (type == 'aml') {
// Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
      // Add links to the file and its visualization.
                if (name == "file1") {
                    var key = Date.now();
                    localStorage[key] = e.target.result;
                    var fileInput = document.getElementById('file1'),
                    p1 = document.createElement('P1');
                    p1.innerHTML = ['<a href="tree.html?type=aml&key='+key+'" target="_blank" title="Visualization of '+escape(theFile.name)+ 
                    '">Visualization</a><br><a href="'+e.target.result+'" download="'+escape(theFile.name)+'" title="'+escape(theFile.name)+'">Download the file</a>'];
                    fileInput.parentNode.insertBefore(p1, fileInput.nextSibling);
                    $("#file1").css("display","none");
                    $("#descr1").css("display","none");
                } else if (name == "file2") {
                    var key = Date.now();
                    localStorage[key] = e.target.result;
                    var fileInput = document.getElementById('file2'),
                    p2 = document.createElement('P2');
                    p2.innerHTML = ['<a href="tree.html?type=aml&key='+key+'" target="_blank" title="Visualization of '+ escape(theFile.name)+ 
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
        numberOfFiles += 1;
        console.log(numberOfFiles + " file uploaded");
    } else if (type == 'opcua') {
// Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                if (name == "file1") {
                    var key = Date.now();
                    localStorage[key] = e.target.result;
                    var fileInput = document.getElementById('file1'),
                    p1 = document.createElement('P1');
                    p1.innerHTML = ['<a href="tree.html?type=opcua&key='+key+'" target="_blank" title="Visualization of '+ escape(theFile.name)+ 
                    '">Visualization</a><br><a href="'+ e.target.result+'" download="'+ escape(theFile.name)+'" title="'+ escape(theFile.name)+'">Download the file</a>'];
                    fileInput.parentNode.insertBefore(p1, fileInput.nextSibling);
                    $("#file1").css("display","none");
                    $("#descr1").css("display","none");
                } else if (name == "file2") {
                    var key = Date.now();
                    localStorage[key] = e.target.result;
                    var fileInput = document.getElementById('file2'),
                    p2 = document.createElement('P2');
                    p2.innerHTML = ['<a href="tree.html?type=opcua&key='+key+'" target="_blank" title="Visualization of '+ escape(theFile.name)+ 
                    '">Visualization</a><br><a href="'+ e.target.result+'" download="'+ escape(theFile.name)+'" title="'+ escape(theFile.name)+'">Download the file</a>'];
                    fileInput.parentNode.insertBefore(p2, fileInput.nextSibling);
                    $("#file2").css("display","none");
                    $("#descr2").css("display","none");
                } else {
                    console.log("Unknown element id");
                }
            };
        })(f);

// Read in the file as a data URL.
        reader.readAsDataURL(f);
        console.log('Success OPCUA');
        numberOfFiles += 1;
        console.log(numberOfFiles + " file uploaded");
    } else {
        alert ('Error: you should upload either AML or OPCUA file.')
    }

    if (numberOfFiles == 2) {
        $("#submitButton").append('<button id="submit" type="submit">Submit files to the server</button> with <select name="matchingSelect" id="matchingChoice"><option selected value="str">Strict</option><option value="sft">Soft</option><option value="non">Non-strict</option></select> matching.');
    }
}
document.getElementById('file1').addEventListener('change', handleFileSelect, false);
document.getElementById('file2').addEventListener('change', handleFileSelect, false);
//localStorage.clear();