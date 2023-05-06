<?php
require_once __DIR__ . '/../../tools/Connection.php';
/**
 * Esta clase maneja las operaciones sobre los ejercicios del sistema.
 */
class WorkManagementModel
{
    /**
     * Crea un nuevo ejercicio con la información dada.
     * @param int $id El id del usuario.
     * @param int $idEjercicio El id del ejercicio.
     * @param string $stage La etapa del ejercicio.
     * @param string $subject La asignatura del ejercicio.
     * @param string $name El nombre del ejercicio.
     * @param int $level El nivel del ejercicio.
     * @return array Retorna un array asociativo con la clave 'success' y valor 'true' si se ha creado correctamente el ejercicio, o con la clave 'error' y un mensaje de error si ha ocurrido algún problema.
     */
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
        $conn = connect();
        $stmt = $conn->prepare("SELECT * FROM Ejercicio WHERE idEjercicio = ?");
        $stmt->bindParam(1, $idEjercicio);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            return ['error' => 'El id de ejercicio ya está en uso'];
        }
        $stmt = $conn->prepare("SELECT * FROM Administrador WHERE IdPersona = ?");
        $stmt->bindParam(1, $id);
        $stmt->execute();
        if ($stmt->rowCount() == 0) {
            return ['error' => 'El usuario no es un administrador'];
        }
        $stmt = $conn->prepare("INSERT INTO Ejercicio(IdEjercicio, Etapa, Asignatura, Nombre, Nivel) VALUES (?, ?, ?, ?, ?)");
        $stmt->bindParam(1, $idEjercicio);
        $stmt->bindParam(2, $stage);
        $stmt->bindParam(3, $subject);
        $stmt->bindParam(4, $name);
        $stmt->bindParam(5, $level);
        $stmt->execute();
        $result = $stmt->rowCount() > 0 ? true : false;
        return ['success' => $result];
    }

    /**
     * Obtiene el número de variables del ejercicio.
     * @param int $userId El ID del usuario que realiza la acción.
     * @param int $workId El ID del ejercicio.
     * @return int|array Retorna el número de variables del ejercicio, o con la clave 'error' y un mensaje de error si ha ocurrido algún problema.
     */
    public static function getNumberVariable($userId, $workId)
    {
        $conn = connect();
        $query = "SELECT COUNT(*) FROM Administrador WHERE IdPersona = :userId";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        $isAdmin = $stmt->fetchColumn();
        if (!$isAdmin) {
            return ['error' => 'El usuario no tiene permiso para realizar esta acción'];
        }
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

    /**
     * Retorna un array con los Ids y valores de las variables numéricas de un ejercicio dado.
     * @param int $workId Id del ejercicio.
     * @return array Array asociativo con los Ids y valores de las variables numéricas del ejercicio, o con la clave 'error' y un mensaje de error si ha ocurrido algún problema.
     */
    public static function getVariableValueById($workId)
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

    /**
     * Obtiene los ejercicios de una asignatura y etapa determinadas.
     * @param string $stage Etapa del ejercicio (por ejemplo, "Primaria").
     * @param string $subject Nombre de la asignatura del ejercicio (por ejemplo, "Números").
     * @return array|mixed Array asociativo que contiene los ejercicios que coinciden con la etapa y asignatura dadas, o un array que contiene un mensaje de error si alguno de los parámetros es vacío.
     * @throws PDOException Si ocurre un error al acceder a la base de datos.
     */
    public function getWorksBySubject($stage, $subject)
    {
        if (empty($stage)) {
            return ['error' => 'La etapa es obligatoria'];
        }
        if (empty($subject)) {
            return ['error' => 'La asignatura es obligatoria'];
        }
        $conn = connect();
        $stmt = $conn->prepare("SELECT idEjercicio, nombre, nivel FROM ejercicio WHERE etapa = :stage AND asignatura = :subject");
        $stmt->bindParam(':stage', $stage);
        $stmt->bindParam(':subject', $subject);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * Modifica los valores de las variables de un ejercicio.
     * @param array $variable Array asociativo con los valores de las variables a modificar. La clave es el id de la variable y el valor es el nuevo valor.
     * @param int $workId Id del ejercicio al que se le van a modificar los valores de las variables.
     * @return array Retorna un array asociativo con la clave 'success' y valor 'true' si se han modificado correctamente los valores, o con la clave 'error' y un mensaje de error si ha ocurrido algún problema.
     */
    public function editVariable($variable, $workId)
    {
        if (empty($workId)) {
            return ['error' => 'El Id es obligatorio'];
        }
        $conn = connect();
        $stmt = $conn->prepare("SELECT * FROM Ejercicio WHERE idEjercicio = ?");
        $stmt->bindParam(1, $workId);
        $stmt->execute();
        if ($stmt->rowCount() == 0) {
            return ['error' => 'El ejercicio no existe'];
        }
        $rowCount = 0;
        foreach ($variable as $variableId => $variableValue) {
            $stmt1 = $conn->prepare("SELECT * FROM EjercicioVariable WHERE idEjercicio = :workId AND idVariable = :variableId");
            $stmt1->bindParam(':workId', $workId);
            $stmt1->bindParam(':variableId', $variableId);
            $stmt1->execute();
            $stmt2 = $conn->prepare("UPDATE EjercicioVariable SET Valor = :variableValue WHERE idEjercicio = :workId AND idVariable = :variableId");
            $stmt2->bindParam(':variableValue', $variableValue);
            $stmt2->bindParam(':workId', $workId);
            $stmt2->bindParam(':variableId', $variableId);
            $stmt2->execute();
            $rowCount += $stmt2->rowCount();
        }
        if ($rowCount > 0) {
            return ['success' => true];
        } else {
            return ['error' => 'No se ha modificado ningún valor'];
        }
    }

    /**
     * Elimina un ejercicio con un ID específico.
     * @param int $idUser ID del usuario que realiza la operación.
     * @param int $workId ID del ejercicio a eliminar.
     * @return array Retorna un array asociativo con la clave 'success' y valor 'true' si se ha eliminado correctamente el ejercicio, o con la clave 'error' y un mensaje de error si ha ocurrido algún problema.
     */
    public function deleteWork($idUser, $workId)
    {
        if (empty($idUser)) {
            return ['error' => 'El id es obligatorio'];
        }
        if (empty($workId)) {
            return ['error' => 'El id del ejercicio es obligatorio'];
        }
        $conn = connect();
        $stmt = $conn->prepare("SELECT idPersona FROM Administrador WHERE idPersona = :idUser");
        $stmt->bindParam(':idUser', $idUser);
        $stmt->execute();
        $row = $stmt->fetch();
        if ($row === null) {
            return ['error' => 'El usuario no es un administrador y no tiene permiso para eliminar el ejercicio'];
        }
        $stmt = $conn->prepare("SELECT * FROM Ejercicio WHERE idEjercicio = :workId");
        $stmt->bindParam(':workId', $workId);
        $stmt->execute();
        $row = $stmt->fetch();
        if (!$row) {
            return ['error' => 'El ejercicio no existe'];
        }
        $stmt = $conn->prepare("DELETE FROM Ejercicio WHERE idEjercicio = :workId");
        $stmt->bindParam(':workId', $workId);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            return ['success' => true];
        } else {
            return ['error' => 'No se ha podido borrar el ejercicio'];
        }
    }
}
