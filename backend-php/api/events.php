<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'config/database.php';
include_once 'objects/event.php';

$database = new Database();
$db = $database->getConnection();

$event = new Event($db);

$method = $_SERVER['REQUEST_METHOD'];

// Récupérer l'ID de l'URL si présent
$request_uri = $_SERVER['REQUEST_URI'];
$base_path = '/api/events';
$id = null;

if (strpos($request_uri, $base_path) === 0) {
    $path = substr($request_uri, strlen($base_path));
    if ($path !== '' && $path !== '/') {
        $id = trim($path, '/');
    }
}

switch($method) {
    case 'GET':
        if($id) {
            $event->id = $id;
            $event->readOne();
        } else {
            $stmt = $event->read();
            $num = $stmt->rowCount();
            
            if($num > 0) {
                $events_arr = array();
                
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $event_item = array(
                        "id" => $row['id'],
                        "name" => $row['name'],
                        "description" => $row['description'],
                        "type" => $row['type'],
                        "date" => $row['date'],
                        "time" => $row['time'],
                        "address" => $row['address'],
                        "image" => $row['image']
                    );
                    array_push($events_arr, $event_item);
                }
                echo json_encode($events_arr);
            } else {
                echo json_encode(array());
            }
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        $event->name = $data->name;
        $event->description = $data->description;
        $event->type = $data->type;
        $event->date = $data->date;
        $event->time = $data->time;
        $event->address = $data->address;
        $event->image = $data->image;
        
        if($event->create()) {
            echo json_encode(array("message" => "Événement créé."));
        } else {
            echo json_encode(array("message" => "Impossible de créer l'événement."));
        }
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        $event->id = $data->id;
        $event->name = $data->name;
        $event->description = $data->description;
        $event->type = $data->type;
        $event->date = $data->date;
        $event->time = $data->time;
        $event->address = $data->address;
        $event->image = $data->image;
        
        if($event->update()) {
            echo json_encode(array("message" => "Événement mis à jour."));
        } else {
            echo json_encode(array("message" => "Impossible de mettre à jour l'événement."));
        }
        break;
        
    case 'DELETE':
        if($id) {
            $event->id = $id;
            
            if($event->delete()) {
                echo json_encode(array("message" => "Événement supprimé."));
            } else {
                echo json_encode(array("message" => "Impossible de supprimer l'événement."));
            }
        } else {
            echo json_encode(array("message" => "ID manquant."));
        }
        break;
}
?> 