var numberOfFiles = 0;
var dataType;

function submitFormFunc() {
    var form = document.forms.submitForm;
    var formData = new FormData(form);  
    $("#submitButton").html('<img src="img/upload.gif" class="uploadGif"/>');
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "rest/controller/upload");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 3) {
            if(xhr.status == 200) {
                data = xhr.responseText;
                if(data == '{"response":"new"}') {
                    console.log('successful submit')
                    var query = encodeURI("SELECT * WHERE { GRAPH ?graph { ?s ?p ?o } } limit 100");
                    $.get("rest/controller/get?query="+query, function(dataGet){
                        console.log('successful request for integrated file');
                        $("#submitButton").html('');
                        $("#submitButton").append('<div class="queryTrialZone"><label>Integrated file has been created. <p>You can download it <a href="data:;base64,77u/'+btoa(JSON.stringify(dataGet))+'" download="integrated.json">here</a> and see its visualization <a href="">here.</a> <p>In order to retrieve any specific information, input your SPARQL query below:</label><br /><textarea class="queryField" placeholder=\'SELECT ?v WHERE { ?v ?p "cat" }\'></textarea><br /><input type="button" onclick="getQuery()" value="Run Query"/></div><div class="moreInfo"></div>');
                    });
                } else {
                    console.log(data);
                    dataType = data;
                    $("#downloadArea").append('<select name="type" id="choice"><option selected value="html">HTML</option><option  value="JSON">JSON</option><option value="Turtle">Turtle</option><option value="XML">XML</option></select>');
                    $("#downloadArea").append('<br/><br/><input type="button" onclick="downloadInt()" value="Download"/>');
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
function downloadInt() {
    dataType = dataType.replace(/\D/g, '');
    var selection = $("#choice option:selected").val();
    var query = encodeURI('select * \n from <jdbc:virtuoso://localhost:1111/'+dataType+'>\nwhere { ?s ?p ?o} ');
    var format = encodeURI('text/'+selection);
    var timeout=encodeURI('0');
    var debug = encodeURI('on');
    $.get('http://localhost:8890/sparql?default-graph-uri=&query='+query+'&format='+format+'&timeout='+timeout+'&debug=on', function (data){
        alert(data);
        console.log(data);
        $("#downloadArea").html=('');
        $("#downloadArea").append('<br/><br/><a href="data:;base64,77u/'+btoa(JSON.stringify(data))+'" download="integrated_file.'+selection+'" id="downloadInt"></a>');
        document.getElementById("downloadInt").click();
        
    }, "text");
}
function getQuery() {
    var query = encodeURI($(".queryField").val());
    console.log(query);
    
    $.get("rest/controller/get?query="+query, function(data){
        console.log('successful request for query');
        var key = Date.now();
        localStorage[key] = "data:;base64,77u/"+btoa(JSON.stringify(data));
        $('.moreInfo').html('');
        setTimeout(function(){$('.moreInfo').html('<a href="tree.html?type=json&key='+key+'" target="_blank" >Visualization</a></br><a href="data:;base64,77u/'+btoa(JSON.stringify(data))+'" target="_blank" download="query_result.json">Download the file</a>');}, 500);
    });
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
        document.getElementById("submitButton").innerHTML = ['<button id="submit" type="submit">Submit files to the server</button>'];
    }
}
document.getElementById('file1').addEventListener('change', handleFileSelect, false);
document.getElementById('file2').addEventListener('change', handleFileSelect, false);
//localStorage.clear();