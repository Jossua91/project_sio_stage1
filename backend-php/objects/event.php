<?php
class Event {
    private $conn;
    private $table_name = "events";

    public $id;
    public $name;
    public $description;
    public $type;
    public $date;
    public $time;
    public $address;
    public $image;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $this->name = $row['name'];
        $this->description = $row['description'];
        $this->type = $row['type'];
        $this->date = $row['date'];
        $this->time = $row['time'];
        $this->address = $row['address'];
        $this->image = $row['image'];
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    name = :name,
                    description = :description,
                    type = :type,
                    date = :date,
                    time = :time,
                    address = :address,
                    image = :image";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->type = htmlspecialchars(strip_tags($this->type));
        $this->date = htmlspecialchars(strip_tags($this->date));
        $this->time = htmlspecialchars(strip_tags($this->time));
        $this->address = htmlspecialchars(strip_tags($this->address));
        $this->image = htmlspecialchars(strip_tags($this->image));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":type", $this->type);
        $stmt->bindParam(":date", $this->date);
        $stmt->bindParam(":time", $this->time);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":image", $this->image);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . "
                SET
                    name = :name,
                    description = :description,
                    type = :type,
                    date = :date,
                    time = :time,
                    address = :address,
                    image = :image
                WHERE
                    id = :id";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->type = htmlspecialchars(strip_tags($this->type));
        $this->date = htmlspecialchars(strip_tags($this->date));
        $this->time = htmlspecialchars(strip_tags($this->time));
        $this->address = htmlspecialchars(strip_tags($this->address));
        $this->image = htmlspecialchars(strip_tags($this->image));
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":type", $this->type);
        $stmt->bindParam(":date", $this->date);
        $stmt->bindParam(":time", $this->time);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":image", $this->image);
        $stmt->bindParam(":id", $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?> 