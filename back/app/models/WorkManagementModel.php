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
    public static function getVariable($userId, $workId)
    {
        $conn = connect();

        // Consulta SQL para comprobar si el usuario es un administrador
        $query = "SELECT COUNT(*) FROM Administrador WHERE IdPersona = :userId";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        $isAdmin = $stmt->fetchColumn();

        if (!$isAdmin) {
            return ['error' => 'El usuario no tiene permiso para realizar esta acción'];
        }

        // Consulta SQL para obtener el id del ejercicio
        $query = "SELECT idEjercicio FROM Ejercicio WHERE idEjercicio = :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id', $workId);
        $stmt->execute();
        $work = $stmt->fetch(PDO::FETCH_COLUMN);

        if (!$work) {
            return ['error' => 'No existe el ejercicio'];
        }


        $query = "SELECT COUNT(*) FROM ejercicioVariable WHERE idEjercicio = :id AND valor REGEXP '^[0-9]+$'";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id', $workId);
        $stmt->execute();
        $count = $stmt->fetch(PDO::FETCH_COLUMN);

        if ($count == 0) {
            return ['error' => 'Este ejercicio no permite cambiar sus variables'];
        }

        return $count;
    }

    public static function getWorkById($workId)
    {
        $conn = connect();
        $query = "SELECT IdVariable, Valor FROM EjercicioVariable WHERE idEjercicio = :workId";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':workId', $workId);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

        if (empty($results)) {
            return ['error' => 'No se encontraron valores para el ejercicio.'];
        }

        $filtered_results = array_filter($results, function ($value) {
            return is_numeric($value);
        });

        if (empty($filtered_results)) {
            return ['error' => 'No se encontraron valores numéricos para el ejercicio.'];
        }

        return $filtered_results;
    }

    public function getWorksBySubject($stage, $subject)
    {
        if (empty($stage)) {
            return ['error' => 'La etapa es obligatoria'];
        }
        if (empty($subject)) {
            return ['error' => 'La asignatura es obligatoria'];
        }
    
        $conn = connect();
    
        // Preparar la consulta SQL para obtener los ejercicios que coincidan con el nombre, etapa y asignatura dadas
        $stmt = $conn->prepare("SELECT idEjercicio, nombre, nivel FROM ejercicio WHERE etapa = :stage AND asignatura = :subject");
    
        // Asignar valores a los parámetros de la consulta
        $stmt->bindParam(':stage', $stage);
        $stmt->bindParam(':subject', $subject);
        $stmt->execute();
    
        // Obtener los resultados de la consulta en forma de array asociativo
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        // Devolver los resultados como un array
        return $result;
    }




    public function editVariable($variable, $workId)
    {
        if (empty($workId)) {
            return ['error' => 'El Id es obligatorio'];
        }

        $conn = connect();

        // Verificar si el ejercicio existe
        $stmt = $conn->prepare("SELECT * FROM Ejercicio WHERE idEjercicio = ?");
        $stmt->bindParam(1, $workId);
        $stmt->execute();

        if ($stmt->rowCount() == 0) {
            // El trabajo no existe
            return ['error' => 'El ejercicio no existe'];
        }

        $rowCount = 0; // Variable para llevar la cuenta de filas actualizadas

        foreach ($variable as $variableId => $variableValue) {
            // Comprobar si la variable ya existe
            $stmt1 = $conn->prepare("SELECT * FROM EjercicioVariable WHERE idEjercicio = :workId AND idVariable = :variableId");
            $stmt1->bindParam(':workId', $workId);
            $stmt1->bindParam(':variableId', $variableId);
            $stmt1->execute();

            // La variable ya existe, se actualiza su valor
            $stmt2 = $conn->prepare("UPDATE EjercicioVariable SET Valor = :variableValue WHERE idEjercicio = :workId AND idVariable = :variableId");
            $stmt2->bindParam(':variableValue', $variableValue);
            $stmt2->bindParam(':workId', $workId);
            $stmt2->bindParam(':variableId', $variableId);
            $stmt2->execute();

            $rowCount += $stmt2->rowCount(); // Sumar al contador el número de filas actualizadas en cada consulta
        }

        if ($rowCount > 0) {
            // Los datos se han actualizado correctamente
            return ['success' => true];
        } else {
            // No se ha actualizado ningún registro
            return ['error' => 'No se ha modificado ningún valor'];
        }
    }

    public function deleteWork($idUser, $workId)
    {
        // Validar que el campo de idPersona no esté vacío
        if (empty($idUser)) {
            return ['error' => 'El id es obligatorio'];
        }
        if (empty($workId)) {
            return ['error' => 'El id del ejercicio es obligatorio'];
        }
        // Conectar a la base de datos
        $conn = connect();

        // Verificar que el correo electrónico es correcto
        $stmt = $conn->prepare("SELECT idPersona FROM Administrador WHERE idPersona = :idUser");
        $stmt->bindParam(':idUser', $idUser);
        $stmt->execute();
        $row = $stmt->fetch();
        if ($row === null) {
            return ['error' => 'El usuario no es un administrador y no tiene permiso para eliminar el ejercicio'];
        }

 // Verificar si el ejercicio existe
 $stmt = $conn->prepare("SELECT * FROM Ejercicio WHERE idEjercicio = :workId");
 $stmt->bindParam(':workId', $workId);
 $stmt->execute();
 $row = $stmt->fetch();
 if (!$row) {
     return ['error' => 'El ejercicio no existe'];
 }

 // Borrar el ejercicio
 $stmt = $conn->prepare("DELETE FROM Ejercicio WHERE idEjercicio = :workId");
 $stmt->bindParam(':workId', $workId);
 $stmt->execute();

 if ($stmt->rowCount() > 0) {
     // Los datos se han borrado correctamente
     return ['success' => true];
 } else {
     // No se ha borrado ningún registro
     return ['error' => 'No se ha podido borrar el ejercicio'];
 }
}
    }
