<?php
// Importa el archivo de conexión a la base de datos
require_once __DIR__ . '/../../tools/Connection.php';

/**
 * Clase que maneja las operaciones de inicio y cierre de sesión de usuarios en el sistema.
 */
class WorkManagementModel
{

    public function createWork($id, $idEjercicio, $stage, $subject, $name, $level)
    {

        if (empty($id)) {
            return ['error' => 'El id de usuario es obligatorio'];
        }

        if (empty($idEjercicio)) {
            return ['error' => 'El id de usuario es obligatorio'];
        }

        if (empty($stage)) {
            return ['error' => 'El campo de etapa es obligatorio'];
        }

        if (empty($subject)) {
            return ['error' => 'El campo de asignatura es obligatorio'];
        }

        if (empty($name)) {
            return ['error' => 'El campo de nombre es obligatorio'];
        }

        if (empty($level) || !is_numeric($level)) {
            return ['error' => 'El campo de nivel es obligatorio y debe ser un número'];
        }

        // Conéctate a la base de datos utilizando la función definida en el archivo de conexión
        $conn = connect();

            // Comprueba si el idEjercicio ya existe en la tabla Ejercicio
    $stmt = $conn->prepare("SELECT * FROM Ejercicio WHERE idEjercicio = ?");
    $stmt->bindParam(1, $idEjercicio);
    $stmt->execute();
    if ($stmt->rowCount() > 0) {
        // El idEjercicio ya está en uso
        return ['error' => 'El id de ejercicio ya está en uso'];
    }

        $stmt = $conn->prepare("SELECT * FROM Administrador WHERE IdPersona = ?");
        $stmt->bindParam(1, $id);
        $stmt->execute();
        if ($stmt->rowCount() == 0) {
            // El usuario no es un administrador
            return ['error' => 'El usuario no es un administrador'];
        }

        // Insertar el nuevo usuario en la tabla Persona
        $stmt = $conn->prepare("INSERT INTO Ejercicio(IdEjercicio, Etapa, Asignatura, Nombre, Nivel) VALUES (?, ?, ?, ?, ?)");
        $stmt->bindParam(1, $idEjercicio);
        $stmt->bindParam(2, $stage);
        $stmt->bindParam(3, $subject);
        $stmt->bindParam(4, $name);
        $stmt->bindParam(5, $level);
        $stmt->execute();
        // Devolver el resultado de la operación
        $result =  $stmt->rowCount() > 0 ? true : false;
        return ['success' => $result];
    }
}