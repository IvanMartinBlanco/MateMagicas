<?php
/**
 * Conexión a la base de datos.
 * @return PDO La instancia de la conexión.
 * @throws PDOException Si ocurre un error al intentar conectarse.
 */
function connect() {
    $config = require_once(realpath(dirname(__FILE__) .'/../config/Database.php'));
    $dsn = "mysql:host={$config['host']};dbname={$config['database']};charset={$config['charset']}";
    try {
        $pdo = new PDO($dsn, $config['username'], $config['password'], $config['options']);
        return $pdo;
    } catch (PDOException $e) {
        $errorMsg = "Error al conectar a la base de datos: " . $e->getMessage();
        error_log($errorMsg, 3, "../logs/error.log");
        throw new PDOException($errorMsg);
    }
}
?>