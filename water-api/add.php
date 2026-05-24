<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if(!$data){

    echo json_encode([
        "status"=>"error",
        "msg"=>"No data received"
    ]);

    exit;
}

/* GET VALUES */

$ph = $data['ph'] ?? '';
$turbidity = $data['turbidity'] ?? '';
$temp = $data['temperature'] ?? '';
$user = $data['user'] ?? '';
$area = $data['area'] ?? '';

/* VALIDATION */

if(
    $ph === '' ||
    $turbidity === '' ||
    $temp === '' ||
    $user === '' ||
    $area === ''
){

    echo json_encode([
        "status"=>"error",
        "msg"=>"Missing fields"
    ]);

    exit;
}

/* CONVERT TO NUMBER */

$ph = floatval($ph);
$turbidity = floatval($turbidity);
$temp = floatval($temp);

/* WATER QUALITY LOGIC */

if(
    $ph >= 6.5 &&
    $ph <= 8.5 &&
    $turbidity <= 5
){

    $quality = "Good";

    $usage = "Suitable for drinking, cooking, and domestic use";

}
elseif(
    $ph >= 6.0 &&
    $ph <= 9.0 &&
    $turbidity <= 10
){

    $quality = "Moderate";

    $usage = "Suitable for agriculture, gardening, and cleaning";

}
elseif(
    $turbidity <= 20
){

    $quality = "Poor";

    $usage = "Can be used for industrial purposes after treatment";

}
else{

    $quality = "Poor";

    $usage = "Unsafe water. Treatment required before use";

}

/* INSERT DATA */

$sql = "INSERT INTO water_data
(area, ph, turbidity, temperature, quality, `usage`, user)

VALUES

('$area','$ph','$turbidity','$temp','$quality','$usage','$user')";

/* EXECUTE */

if($conn->query($sql)){

    echo json_encode([

        "status"=>"success",

        "quality"=>$quality,

        "usage"=>$usage,

        "ph"=>$ph,

        "turbidity"=>$turbidity,

        "temperature"=>$temp,

        "area"=>$area

    ]);

}
else{

    echo json_encode([

        "status"=>"error",

        "msg"=>$conn->error

    ]);
}

?>