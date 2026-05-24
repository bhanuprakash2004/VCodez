<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli(
    "localhost",
    "root",
    "",
    "water_quality_db"
);

$data = json_decode(file_get_contents("php://input"));

$oldUsername = $data->oldUsername;
$username = $data->username;
$phone = $data->phone;

/* CHECK USERNAME ALREADY EXISTS */

$check = "SELECT * FROM users
          WHERE username='$username'
          AND username!='$oldUsername'
          AND role='user'";

$result = $conn->query($check);

if($result->num_rows > 0){

    echo json_encode([
        "status" => "error",
        "message" => "Username already used by another user"
    ]);

    exit();
}

/* UPDATE PROFILE */

$sql = "UPDATE users
        SET username='$username',
            phone='$phone'
        WHERE username='$oldUsername'
        AND role='user'";

if($conn->query($sql) === TRUE){

    echo json_encode([
        "status" => "success",
        "message" => "Profile Updated"
    ]);

}
else{

    echo json_encode([
        "status" => "error",
        "message" => "Update Failed"
    ]);

}

?>