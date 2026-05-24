<?php
include 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'];
$password = $data['password'];

$sql = "SELECT * FROM users
WHERE username='$username'
AND password='$password'";

$result = $conn->query($sql);

if($result->num_rows > 0){

    $row = $result->fetch_assoc();

    echo json_encode([
        "status"=>"success",
        "role"=>$row['role'],
        "username"=>$row['username']
    ]);

}
else{
    echo json_encode([
        "status"=>"fail"
    ]);
}
?>