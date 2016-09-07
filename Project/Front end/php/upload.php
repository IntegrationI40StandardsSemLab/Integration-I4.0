<form enctype="multipart/form-data" action="fileUpload" method="POST">
    <!-- Поле MAX_FILE_SIZE должно быть указано до поля загрузки файла -->
    <input type="hidden" name="MAX_FILE_SIZE" value="30000" />
    <!-- Название элемента input определяет имя в массиве $_FILES -->
    Send the file: <input name="userfile" type="file" />
    <input type="submit" value="Send File" />
</form>