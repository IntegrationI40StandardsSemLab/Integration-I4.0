<?php
$targetDir = "files/";
$fileName = "integrated.aml";
$targetFile = $targetDir.$fileName;
if (file_exists($targetFile)) {
    print(json_encode(1));
}
else
{
    print(json_encode(0));
}
?>