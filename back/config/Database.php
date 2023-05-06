<?php
/**
 * Configuración de la base de datos.
 * Este archivo define los parámetros de conexión a la base de datos.
 * @return array Un array con la configuración de la base de datos.
 */
return [
    // Host de la base de datos.
    'host' => 'localhost',
    // Nombre de la base de datos.
    'database' => 'matemagicas',
    // Nombre de usuario de la base de datos.
    'username' => 'root',
    // Contraseña de la base de datos.
    'password' => '',
    // Conjunto de caracteres utilizado por la base de datos.
    'charset' => 'utf8mb4',
    // Opciones adicionales de configuración de la conexión.
    'options' => [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ],
];
