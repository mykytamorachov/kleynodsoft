<?php
//  << - stoned animations online mailform.php - >>
// <<< - Stoned Animations online © 2000 - 2001 - >>>


// All you need to change is the e-mail addy:
$email = $_POST['email'];
$subject = 'price list from KlaynodSoft';
$content = 'Download Price List: https://s3-eu-west-1.amazonaws.com/klenodsoft/prais.pdf';
$content = iconv('UTF-8', 'windows-1251', $content);

mail($email,$subject,$content);

?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Sent!</title>
</head>

<body bgcolor="#ffffff" text="#000000">

<p align="center"><font size="2" face="Arial"><b>The Price has been sent. Thank you.</b></font>

</body>

</html>