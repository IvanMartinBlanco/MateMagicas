<?php
require_once __DIR__ . '/../../tools/Connection.php';
/**
 * Esta clase maneja las operaciones sobre los usuarios del sistema.
 */
class UserManagementModel
{
    /**
     * Crea un nuevo usuario en la base de datos.
     * @param string $userName Nombre del usuario.
     * @param string $surnames Apellidos del usuario.
     * @param int $age Edad del usuario.
     * @param string $email Correo electrónico del usuario.
     * @param string $emailRepeat Correo electrónico del usuario (repetido para confirmación).
     * @param string $password Contraseña del usuario.
     * @param string $passwordRepeat Contraseña del usuario (repetida para confirmación).
     * @param string $rol Rol del usuario (alumno, tutor, administrador).
     * @param int|null $idTutor ID del tutor (solo para tutores y alumnos).
     * @param string|null $course Curso del usuario (solo para tutores y alumnos).
     * @return array Retorna un array asociativo con la clave 'success' y valor 'true' si se ha creado correctamente el usuario, o con la clave 'error' y un mensaje de error si ha ocurrido algún problema.
     */
    public function createUser($userName, $surnames, $age, $email, $emailRepeat, $password, $passwordRepeat, $rol, $idTutor = null, $course = null)
    {
        if (empty($userName)) {
            return ['error' => 'El campo de nombre de usuario es obligatorio'];
        }
        if (empty($surnames)) {
            return ['error' => 'El campo de apellidos es obligatorio'];
        }
        if (empty($age) || !is_numeric($age)) {
            return ['error' => 'El campo de edad es obligatorio y debe ser un número'];
        }
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['error' => 'El campo de email es obligatorio y debe ser una dirección de email válida'];
        }
        if (empty($emailRepeat) || $email !== $emailRepeat) {
            return ['error' => 'El campo de email es obligatorio y debe ser una dirección de email válida'];
        }
        if (empty($password)) {
            return ['error' => 'El campo de contraseña es obligatorio'];
        }
        if (empty($passwordRepeat) || $password !== $passwordRepeat) {
            return ['error' => 'Las contraseñas no coinciden'];
        }
        $allowedRoles = ['alumno', 'tutor', 'administrador'];
        if (empty($rol) || !in_array($rol, $allowedRoles)) {
            return ['error' => 'El campo de rol es obligatorio y debe ser uno de los siguientes valores: alumno, tutor, administrador'];
        }
        if ($rol !== 'alumno') {
            if ($rol === 'tutor' && !empty($idTutor)) {
                return ['error' => 'El tutor no puede elegir un código de tutor.'];
            }
            if ($rol === 'administrador' && (!empty($idTutor) || !empty($course))) {
                return ['error' => 'El administrador no puede elegir un código de tutor ni un curso.'];
            }
        }
        $conn = connect();
        $stmt = $conn->prepare("SELECT IdPersona FROM Persona WHERE CorreoElectronico = ?");
        $stmt->bindParam(1, $email);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            return ['error' => 'El correo electrónico ya está en uso'];
        }
        if ($idTutor != null) {
            $stmt = $conn->prepare("SELECT COUNT(*) FROM Tutor WHERE IdTutor = ?");
            $stmt->bindParam(1, $idTutor);
            $stmt->execute();
            $result = $stmt->fetchColumn();
            if ($result == 0) {
                return ['error' => " El tutor especificado no existe."];
            }
        }
        $stmt = $conn->prepare("INSERT INTO Persona (Nombre, Apellidos, Edad, CorreoElectronico, `Password`) VALUES (?, ?, ?, ?, ?)");
        $stmt->bindParam(1, $userName);
        $stmt->bindParam(2, $surnames);
        $stmt->bindParam(3, $age);
        $stmt->bindParam(4, $email);
        $stmt->bindParam(5, $password);
        $stmt->execute();
        $idPersona = $conn->lastInsertId();
        if ($rol == 'alumno') {
            $stmt = $conn->prepare("INSERT INTO Alumno (Curso, IdTutor, IdPersona) VALUES (?, ?, ?)");
            $stmt->bindParam(1, $course);
            $stmt->bindParam(2, $idTutor);
            $stmt->bindParam(3, $idPersona);
            $stmt->execute();
        } elseif ($rol == 'tutor') {
            $stmt = $conn->prepare("INSERT INTO Tutor (Curso, IdPersona) VALUES (?, ?)");
            $stmt->bindParam(1, $course);
            $stmt->bindParam(2, $idPersona);
            $stmt->execute();
        } elseif ($rol == 'administrador') {
            $stmt = $conn->prepare("INSERT INTO Administrador (IdPersona) VALUES (?)");
            $stmt->bindParam(1, $idPersona);
            $stmt->execute();
        }
        $result = $stmt->rowCount() > 0 ? true : false;
        return ['success' => $result];
    }

    /**
     * Elimina un usuario de la base de datos.
     * @param int $idPersona El ID de la persona que se desea eliminar.
     * @param string $email El correo electrónico de la persona que se desea eliminar.
     * @return array Retorna un array asociativo con la clave 'success' y valor 'true' si se ha borrado correctamente el usuario, o con la clave 'error' y un mensaje de error si ha ocurrido algún problema.
     */
    public function deleteUser($idPersona, $email)
    {
        if (empty($idPersona)) {
            return ['error' => 'El id es obligatorio'];
        }
        if (empty($email)) {
            return ['error' => 'El email es obligatorio'];
        }
        $conn = connect();
        $stmt = $conn->prepare("SELECT CorreoElectronico FROM Persona WHERE IdPersona = ?");
        $stmt->bindParam(1, $idPersona);
        $stmt->execute();
        $row = $stmt->fetch();
        if ($row['CorreoElectronico'] != $email) {
            return ['error' => 'El correo electrónico no es el del usuario'];
        }
        $stmt = $conn->prepare("DELETE FROM Persona WHERE IdPersona = ?");
        $stmt->bindParam(1, $idPersona);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            return ['success' => true];
        } else {
            return ['error' => 'No se ha podido eliminar el usuario'];
        }
    }

    /**
     * Elimina un usuario del sistema siempre y cuando el usuario que lo solicita tenga permisos para hacerlo.
     * @param int $idPersona El id del usuario a eliminar.
     * @param string $email El correo electrónico del usuario a eliminar.
     * @return array Retorna un array asociativo con la clave 'success' y valor 'true' si se ha borrado correctamente el usuario, o con la clave 'error' y un mensaje de error si ha ocurrido algún problema.
     */
    public function deleteAnotherUser($idPersona, $email)
    {
        if (empty($idPersona)) {
            return ['error' => 'El id es obligatorio'];
        }
        if (empty($email)) {
            return ['error' => 'El email es obligatorio'];
        }
        $conn = connect();
        $stmt = $conn->prepare("SELECT IdPersona FROM Administrador WHERE IdPersona = ?");
        $stmt->bindParam(1, $idPersona);
        $stmt->execute();
        $isAdmin = ($stmt->rowCount() === 1);
        $stmt = $conn->prepare("SELECT IdPersona FROM Tutor WHERE IdPersona = ?");
        $stmt->bindParam(1, $idPersona);
        $stmt->execute();
        $isTutor = ($stmt->rowCount() === 1);
        if (!$isAdmin && !$isTutor) {
            return ['error' => 'El usuario no tiene permisos para borrar a otro usuario.'];
        }
        if ($isTutor) {
            $stmt = $conn->prepare("SELECT IdAlumno FROM Alumno WHERE IdTutor = (SELECT IdTutor FROM Tutor WHERE IdPersona = ?) AND IdPersona = (SELECT IdPersona FROM Persona WHERE CorreoElectronico = ?)");
            $stmt->bindParam(1, $idPersona);
            $stmt->bindParam(2, $email);
            $stmt->execute();
            if ($stmt->rowCount() !== 1) {
                return ['error' => 'El usuario no es uno de los alumnos del tutor que realiza la acción.'];
            }
        }
        if ($isAdmin) {
            $stmt = $conn->prepare("SELECT IdPersona FROM Administrador WHERE IdPersona = (SELECT IdPersona FROM Persona WHERE CorreoElectronico = ?)");
            $stmt->bindParam(1, $email);
            $stmt->execute();
            if ($stmt->rowCount() === 1) {
                return ['error' => 'El administrador no tiene permisos para borrar a otro administrador.'];
            }
        }
        $stmt = $conn->prepare("DELETE FROM Persona WHERE CorreoElectronico = ?");
        $stmt->bindParam(1, $email);
        $stmt->execute();
        return ['success' => 'Usuario borrado correctamente.'];
    }

    /**
     * Edita un usuario alumno en la base de datos.
     * @param int $idPersona El id del usuario a editar.
     * @param string $userName El nombre del usuario.
     * @param string $surnames Los apellidos del usuario.
     * @param int $age La edad del usuario.
     * @param string $email El email del usuario.
     * @param string $password La contraseña del usuario.
     * @param string $passwordRepeat Contraseña del usuario (repetida para confirmación).
     * @param int|null $tutor El id del tutor asignado al usuario.
     * @param string|null $course El curso del usuario.
     * @return array Retorna un array asociativo con la clave 'success' y valor 'true' si se ha modificado correctamente el usuario, o con la clave 'error' y un mensaje de error si ha ocurrido algún problema.
     */
    public function editUser($idPersona, $userName, $surnames, $age, $email, $password, $passwordRepeat, $tutor, $course)
    {
        if (empty($idPersona)) {
            return ['error' => 'El id es obligatorio'];
        }
        if (empty($email)) {
            return ['error' => 'El email es obligatorio'];
        }
        $conn = connect();
        $stmt = $conn->prepare("SELECT IdAlumno FROM Alumno WHERE IdPersona = ?");
        $stmt->bindParam(1, $idPersona);
        $stmt->execute();
        if ($stmt->rowCount() == 0) {
            return ['error' => 'El usuario no es un alumno'];
        }
        $stmt = $conn->prepare("SELECT CorreoElectronico FROM Persona WHERE IdPersona = ?");
        $stmt->bindParam(1, $idPersona);
        $stmt->execute();
        $row = $stmt->fetch();
        if ($row['CorreoElectronico'] != $email) {
            return ['error' => 'Se está intentando modificar un usuario diferente.'];
        }
        if ($password != $passwordRepeat) {
            return ['error' => 'Las contraseñas no coinciden'];
        }
        if ($tutor != null) {
            $stmt = $conn->prepare("SELECT IdTutor FROM Tutor WHERE IdTutor = ?");
            $stmt->bindParam(1, $tutor);
            $stmt->execute();
            if ($stmt->rowCount() == 0) {
                return ['error' => 'El tutor no existe'];
            }
        }
        $stmt = $conn->prepare("UPDATE Persona
            INNER JOIN Alumno ON Persona.IdPersona = Alumno.IdPersona
            SET Persona.Nombre = ?,
                Persona.Apellidos = ?,
                Persona.Edad = ?,
                Persona.Password = ?,
                Alumno.IdTutor = ?,
                Alumno.Curso = ?
            WHERE Persona.IdPersona = ?;");
        $stmt->bindParam(1, $userName);
        $stmt->bindParam(2, $surnames);
        $stmt->bindParam(3, $age);
        $stmt->bindParam(4, $password);
        $stmt->bindParam(5, $tutor);
        $stmt->bindParam(6, $course);
        $stmt->bindParam(7, $idPersona);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            return ['success' => true];
        } else {
            return ['error' => 'No se ha podido editar el usuario'];
        }
    }

    /**
     * Actualiza el resultado de un ejercicio realizado por un alumno.
     * @param int $idPersona El ID de la persona cuyo resultado se va a actualizar.
     * @param bool $success El resultado del ejercicio.
     * @param int $idEjercicio El ID del ejercicio cuyo resultado se va a actualizar.
     * @return array Retorna un array asociativo con la clave 'success' y valor 'true' si se ha modificado correctamente el resultado, o con la clave 'error' y un mensaje de error si ha ocurrido algún problema.
     */
    public function editResult($idPersona, $success, $idEjercicio)
    {
        if (empty($idPersona)) {
            return ['error' => 'El id es obligatorio'];
        }
        if (!isset($success)) {
            return ['error' => 'El resultado es obligatorio'];
        }
        if (empty($idEjercicio)) {
            return ['error' => 'El id del ejercicio es obligatorio'];
        }
        $conn = connect();
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $query = "SELECT IdAlumno FROM Alumno WHERE IdPersona = :idPersona";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':idPersona', $idPersona);
        $stmt->execute();
        $idAlumno = $stmt->fetchColumn();
        if ($stmt->rowCount() == 0) {
            return ['unauthorized' => 'Este tipo de usuario no guarda sus resultados'];
        }
        $query = "SELECT * FROM EjercicioRealizado WHERE IdAlumno = :idAlumno AND IdEjercicio = :idEjercicio";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':idAlumno', $idAlumno);
        $stmt->bindParam(':idEjercicio', $idEjercicio);
        $stmt->execute();
        if ($stmt->rowCount() == 0) {
            $query = "INSERT INTO EjercicioRealizado (Exito, IdAlumno, IdEjercicio) VALUES (:success, :idAlumno, :idEjercicio)";
        } else {
            $query = "UPDATE EjercicioRealizado SET Exito = :success WHERE IdAlumno = :idAlumno AND IdEjercicio = :idEjercicio";
        }
        $success_bool = ($success == 1) ? true : false;
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':success', $success_bool, PDO::PARAM_BOOL);
        $stmt->bindParam(':idAlumno', $idAlumno);
        $stmt->bindParam(':idEjercicio', $idEjercicio);
        $stmt->execute();
        return ['success' => true];
    }

    /**
     * Actualiza los datos de un tutor en la base de datos.
     * @param int $idPersona El ID de la persona a actualizar.
     * @param string $userName El nombre del tutor.
     * @param string $surnames Los apellidos del tutor.
     * @param int $age La edad del tutor.
     * @param string $email El correo electrónico del tutor.
     * @param string $password La contraseña del tutor.
     * @param string $passwordRepeat Contraseña del tutor (repetida para confirmación).
     * @param int|null $tutor El ID del tutor.
     * @param string|null $course El nombre del curso que imparte el tutor, o null para no cambiarlo.
     * @return array Retorna un array asociativo con la clave 'success' y valor 'true' si se ha modificado correctamente el tutor, o con la clave 'error' y un mensaje de error si ha ocurrido algún problema.
     */
    public function editTutor($idPersona, $userName, $surnames, $age, $email, $password, $passwordRepeat, $tutor, $course)
    {
        if (empty($idPersona)) {
            return ['error' => 'El id es obligatorio'];
        }
        if (empty($email)) {
            return ['error' => 'El email es obligatorio'];
        }
        $conn = connect();
        $stmt = $conn->prepare("SELECT IdTutor FROM Tutor WHERE IdPersona = ?");
        $stmt->bindParam(1, $idPersona);
        $stmt->execute();
        if ($stmt->rowCount() == 0) {
            return ['error' => 'El usuario no es un tutor'];
        }
        $stmt = $conn->prepare("SELECT CorreoElectronico FROM Persona WHERE IdPersona = ?");
        $stmt->bindParam(1, $idPersona);
        $stmt->execute();
        $row = $stmt->fetch();
        if ($row['CorreoElectronico'] != $email) {
            return ['error' => 'Se está intentando modificar un usuario diferente.'];
        }
        if ($password != $passwordRepeat) {
            return ['error' => 'Las contraseñas no coinciden'];
        }
        if ($tutor != null) {
            $stmt = $conn->prepare("SELECT IdTutor FROM Tutor WHERE IdTutor = ?");
            $stmt->bindParam(1, $tutor);
            $stmt->execute();
            if ($stmt->rowCount() == 0) {
                return ['error' => 'El tutor no existe'];
            }
        }
        $stmt = $conn->prepare("UPDATE Persona
        INNER JOIN Tutor ON Persona.IdPersona = Tutor.IdPersona
        SET Persona.Nombre = ?,
            Persona.Apellidos = ?,
            Persona.Edad = ?,
            Persona.Password = ?,
            Tutor.IdTutor = ?,
            Tutor.Curso = ?
        WHERE Persona.IdPersona = ?;");
        $stmt->bindParam(1, $userName);
        $stmt->bindParam(2, $surnames);
        $stmt->bindParam(3, $age);
        $stmt->bindParam(4, $password);
        $stmt->bindParam(5, $tutor);
        $stmt->bindParam(6, $course);
        $stmt->bindParam(7, $idPersona);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            return ['success' => true];
        } else {
            return ['error' => 'No se ha podido editar el tutor'];
        }
    }

    /**
     * Devuelve un array con los datos del usuario identificado por su ID.
     * @param int $userId El ID del usuario.
     * @return array|false Un array asociativo con los datos del usuario, o false si no se encuentra el usuario.
     */
    public static function getUserById($userId)
    {
        $conn = connect();
        $query = "
            SELECT p.*, a.IdTutor, a.Curso
            FROM PERSONA p
            LEFT JOIN ALUMNO a ON p.IdPersona = a.IdPersona
            WHERE p.IdPersona = :userId";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!empty($user['IdTutor'])) {
            return array(
                'IdPersona' => $user['IdPersona'],
                'Nombre' => $user['Nombre'],
                'Apellidos' => $user['Apellidos'],
                'Edad' => $user['Edad'],
                'CorreoElectronico' => $user['CorreoElectronico'],
                'Contrasena' => $user['Password'],
                'Rol' => 'alumno',
                'IdTutor' => $user['IdTutor'],
                'Curso' => $user['Curso'],
            );
        } else {
            $query = "
            SELECT p.*, t.IdTutor, t.Curso
            FROM PERSONA p
            LEFT JOIN TUTOR t ON p.IdPersona = t.IdPersona
            WHERE p.IdPersona = :userId";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':userId', $userId);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            return array(
                'IdPersona' => $user['IdPersona'],
                'Nombre' => $user['Nombre'],
                'Apellidos' => $user['Apellidos'],
                'Edad' => $user['Edad'],
                'CorreoElectronico' => $user['CorreoElectronico'],
                'Contrasena' => $user['Password'],
                'Rol' => 'tutor',
                'IdTutor' => $user['IdTutor'],
                'Curso' => $user['Curso'],
            );
        }
    }

    /**
     * Obtiene los resultados de un alumno por su dirección de correo electrónico.
     * @param string $email Dirección de correo electrónico del alumno.
     * @return array Un array asociativo con los resultados del usuario, o con la clave 'error' y un mensaje de error si ha ocurrido algún problema.
     */
    public static function getStudentByEmail($email)
    {
        $conn = connect();
        $query = "SELECT a.idAlumno FROM ALUMNO a INNER JOIN PERSONA p ON a.IdPersona = p.IdPersona WHERE p.correoelectronico = :email";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $idAlumno = $stmt->fetch(PDO::FETCH_COLUMN);
        if (!$idAlumno) {
            return ['error' => 'No se encuentra el alumno.'];
        }
        $query = "SELECT * FROM EJERCICIOREALIZADO WHERE idAlumno = :idAlumno";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':idAlumno', $idAlumno);
        $stmt->execute();
        $ejercicios = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $query = "SELECT p.Nombre, p.Apellidos FROM PERSONA p INNER JOIN ALUMNO a ON p.idPersona = a.idPersona WHERE p.correoelectronico = :email";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $user['Ejercicios'] = $ejercicios;
        return $user;
    }

    /**
     * Busca si un correo electrónico pertenece a un alumno del tutor con el ID de persona proporcionado.
     * @param string $email Correo electrónico del alumno a buscar.
     * @param int $idPersona ID de persona del tutor.
     * @return array Un array asociativo con true si es un alumno del profesor, o con la clave 'error' y un mensaje de error si ha ocurrido algún problema.
     */
    public function searchStudent($email, $idPersona)
    {
        $conn = connect();
        $query = "
        SELECT IdTutor FROM Tutor WHERE IdPersona = :idPersona;";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':idPersona', $idPersona);
        $stmt->execute();
        $tutorData = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$tutorData) {
            return ['error' => 'El tutor no existe.'];
        }
        $idTutor = $tutorData['IdTutor'];
        $query = "
        SELECT Persona.Nombre, Persona.Apellidos, Persona.Edad, Persona.CorreoElectronico, Alumno.Curso, Alumno.IdTutor
        FROM Persona
        INNER JOIN Alumno ON Persona.IdPersona = Alumno.IdPersona
        WHERE Persona.CorreoElectronico = :email;";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$userData) {
            return ['error' => 'El correo electrónico proporcionado no pertenece a un alumno.'];
        }
        if ($userData['IdTutor'] != $idTutor) {
            return ['error' => 'No es alumno de este tutor.'];
        }
        return ['success' => true];
    }
}
