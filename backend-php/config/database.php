<?php
class Database {
    // Utilisez les informations de votre base de données Hostinger
    private $host = "localhost"; // ou l'hôte fourni par Hostinger
    private $db_name = "u777610168_events_db"; // le nom de votre base de données Hostinger
    private $username = "u777610168_events"; // votre nom d'utilisateur Hostinger
    private $password = "ilhBGQ4ZbPpGFL"; // votre mot de passe Hostinger
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            echo "Erreur de connexion: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?> 