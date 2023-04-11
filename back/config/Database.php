<?php
/**
 * Archivo de configuración de la base de datos.
 * Este archivo se encarga de la configuración de la conexión a la base de datos.
 * @return array Un array con la configuración de la base de datos.
 */
return [
    'host' => 'localhost', // La dirección de la base de datos.
    'database' => 'matemagicas', // El nombre de la base de datos.
    'username' => 'root', // El nombre de usuario de la base de datos.
    'password' => '', // La contraseña del usuario de la base de datos.
    'charset' => 'utf8mb4', // El juego de caracteres a utilizar para la conexión.
    'options' => [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Configura el modo de error para lanzar excepciones.
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Configura el modo de búsqueda por defecto para devolver un array asociativo.
        PDO::ATTR_EMULATE_PREPARES => false, // Desactiva la emulación de consultas preparadas.
    ],
];
?>
