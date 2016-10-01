$(function () {
	console.log("hello1");
    $('#fileupload').fileupload({
        //dataType: 'json',
		autoUpload: true,
		add: function(e, data) {
			alert(data.type);
		},
        done: function (e, data) {
			console.log(data);
			console.log("hello");
			alert("Success");
        },

        progressall: function (e, data) {
	        var progress = parseInt(data.loaded / data.total * 100, 10);
	        $('#progress.bar').css(
	            'width',
	            progress + '%'
	        );
   		},
   		
		dropZone: $('#dropzone')
    });
});