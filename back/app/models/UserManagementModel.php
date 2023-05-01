<?php
// Importa el archivo de conexión a la base de datos
require_once __DIR__ . '/../../tools/Connection.php';

/**
 * Clase que maneja las operaciones de inicio y cierre de sesión de usuarios en el sistema.
 */
class UserManagementModel
{

    public function createUser($userName, $surnames, $age, $email, $emailRepeat, $password, $passwordRepeat, $rol, $idTutor = null, $course = null)
    {
        // Validar que el campo de nombre de usuario no esté vacío
        if (empty($userName)) {
            return ['error' => 'El campo de nombre de usuario es obligatorio'];
        }

        // Validar que el campo de apellidos no esté vacío
        if (empty($surnames)) {
            return ['error' => 'El campo de apellidos es obligatorio'];
        }

        // Validar que el campo de edad no esté vacío y sea un número
        if (empty($age) || !is_numeric($age)) {
            return ['error' => 'El campo de edad es obligatorio y debe ser un número'];
        }

        // Validar que el campo de email no esté vacío y sea una dirección de email válida
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['error' => 'El campo de email es obligatorio y debe ser una dirección de email válida'];
        }

        // Validar que el campo de email no esté vacío y sea una dirección de email válida
        if (empty($emailRepeat) || $email !== $emailRepeat) {
            return ['error' => 'El campo de email es obligatorio y debe ser una dirección de email válida'];
        }

        // Validar que los campos de contraseña y confirmación de contraseña no estén vacíos y sean iguales
        if (empty($password)) {
            return ['error' => 'El campo de contraseña es obligatorio'];
        }
        if (empty($passwordRepeat) || $password !== $passwordRepeat) {
            return ['error' => 'Las contraseñas no coinciden'];
        }

        // Validar que el campo de rol no esté vacío y sea uno de los roles permitidos
        $allowedRoles = ['alumno', 'tutor', 'administrador'];
        if (empty($rol) || !in_array($rol, $allowedRoles)) {
            return ['error' => 'El campo de rol es obligatorio y debe ser uno de los siguientes valores: alumno, tutor, administrador'];
        }

        // Validar que el campo de email no esté vacío y sea una dirección de email válida
        if ($rol !== 'alumno') {
            if ($rol === 'tutor' && !empty($idTutor)) {
                return ['error' => 'El tutor no puede elegir un código de tutor.'];
            }
            if ($rol === 'administrador' && (!empty($idTutor) || !empty($course))) {
                return ['error' => 'El administrador no puede elegir un código de tutor ni un curso.'];
            }
        }
        // Conéctate a la base de datos utilizando la función definida en el archivo de conexión
        $conn = connect();

        // Comprobar si el correo electrónico ya está en uso
        $stmt = $conn->prepare("SELECT IdPersona FROM Persona WHERE CorreoElectronico = ?");
        $stmt->bindParam(1, $email);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            // El correo electrónico ya está en uso
            return ['error' => 'El correo electrónico ya está en uso'];
        }

        if($idTutor!=null){
        // Primero, prepara una consulta a la tabla Tutor para verificar si existe un registro con el ID especificado
        $stmt = $conn->prepare("SELECT COUNT(*) FROM Tutor WHERE IdTutor = ?");
        $stmt->bindParam(1, $idTutor);
        $stmt->execute();

        // Luego, obtén el resultado de la consulta y verifica si hay algún registro
        $result = $stmt->fetchColumn();
        if ($result == 0) {
            // Si no hay ningún registro con ese ID, muestra un mensaje de error y detén la ejecución del código
            return ['error' => " El tutor especificado no existe."];
        }
    }
        // Insertar el nuevo usuario en la tabla Persona
        $stmt = $conn->prepare("INSERT INTO Persona (Nombre, Apellidos, Edad, CorreoElectronico, `Password`) VALUES (?, ?, ?, ?, ?)");
        $stmt->bindParam(1, $userName);
        $stmt->bindParam(2, $surnames);
        $stmt->bindParam(3, $age);
        $stmt->bindParam(4, $email);
        $stmt->bindParam(5, $password);
        $stmt->execute();
        // Obtener el IdPersona del usuario recién insertado
        $idPersona = $conn->lastInsertId();
        // Insertar el nuevo usuario en la tabla correspondiente
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
        // Devolver el resultado de la operación
        $result =  $stmt->rowCount() > 0 ? true : false;
        return ['success' => $result];
    }

    public function deleteUser($idPersona, $email)
    {
        // Validar que el campo de idPersona no esté vacío
        if (empty($idPersona)) {
            return ['error' => 'El id es obligatorio'];
        }
        if (empty($email)) {
            return ['error' => 'El email es obligatorio'];
        }
        // Conectar a la base de datos
        $conn = connect();

        // Verificar que el correo electrónico es correcto
        $stmt = $conn->prepare("SELECT CorreoElectronico FROM Persona WHERE IdPersona = ?");
        $stmt->bindParam(1, $idPersona);
        $stmt->execute();
        $row = $stmt->fetch();
        if ($row['CorreoElectronico'] != $email) {
            // El correo electrónico no es correcto
            return ['error' => 'El correo electrónico no es el del usuario'];
        }

        // Eliminar el usuario
        $stmt = $conn->prepare("DELETE FROM Persona WHERE IdPersona = ?");
        $stmt->bindParam(1, $idPersona);
        $stmt->execute();

        // Verificar si se ha eliminado el registro en la tabla Persona
        if ($stmt->rowCount() > 0) {
            // El usuario se ha eliminado correctamente
            return ['success' => true];
        } else {
            // No se ha eliminado ningún registro
            return ['error' => 'No se ha podido eliminar el usuario'];
        }
    }

    function deleteAnotherUser($idPersona, $email)
    {
        // Validar que el campo de idPersona no esté vacío
        if (empty($idPersona)) {
            return ['error' => 'El id es obligatorio'];
        }
        if (empty($email)) {
            return ['error' => 'El email es obligatorio'];
        }
        // Conectar a la base de datos
        $conn = connect();

        // Comprobar si el usuario que pide la eliminación es administrador o tutor
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

        // Si es tutor, comprobar que la persona a borrar es uno de sus alumnos
        if ($isTutor) {
            $stmt = $conn->prepare("SELECT IdAlumno FROM Alumno WHERE IdTutor = (SELECT IdTutor FROM Tutor WHERE IdPersona = ?) AND IdPersona = (SELECT IdPersona FROM Persona WHERE CorreoElectronico = ?)");
            $stmt->bindParam(1, $idPersona);
            $stmt->bindParam(2, $email);
            $stmt->execute();
            if ($stmt->rowCount() !== 1) {
                return ['error' => 'El usuario no es uno de los alumnos del tutor que realiza la acción.'];
            }
        }

        // Si es administrador, comprobar que la persona a borrar es tutor o alumno, pero no otro administrador
        if ($isAdmin) {
            $stmt = $conn->prepare("SELECT IdPersona FROM Administrador WHERE IdPersona = (SELECT IdPersona FROM Persona WHERE CorreoElectronico = ?)");
            $stmt->bindParam(1, $email);
            $stmt->execute();
            if ($stmt->rowCount() === 1) {
                return ['error' => 'El administrador no tiene permisos para borrar a otro administrador.'];
            }
        }

        // Borrar el usuario
        $stmt = $conn->prepare("DELETE FROM Persona WHERE CorreoElectronico = ?");
        $stmt->bindParam(1, $email);
        $stmt->execute();

        return ['success' => 'Usuario borrado correctamente.'];
    }


    public function editUser($idPersona, $userName, $surnames, $age, $email, $password, $passwordRepeat, $tutor, $course)
    {
        // Validar que los campos obligatorios no estén vacíos
        if (empty($idPersona)) {
            return ['error' => 'El id es obligatorio'];
        }
        if (empty($email)) {
            return ['error' => 'El email es obligatorio'];
        }

        $conn = connect();

        // Verificar si el usuario es un alumno
        $stmt = $conn->prepare("SELECT IdAlumno FROM Alumno WHERE IdPersona = ?");
        $stmt->bindParam(1, $idPersona);
        $stmt->execute();
        if ($stmt->rowCount() == 0) {
            // El usuario no es un alumno 
            return ['error' => 'El usuario no es un alumno'];
        }

        // Verificar que el correo electrónico es correcto
        $stmt = $conn->prepare("SELECT CorreoElectronico FROM Persona WHERE IdPersona = ?");
        $stmt->bindParam(1, $idPersona);
        $stmt->execute();
        $row = $stmt->fetch();
        if ($row['CorreoElectronico'] != $email) {
            // El correo electrónico no es correcto
            return ['error' => 'Se está intentando modificar un usuario diferente.'];
        }

        // Comprobar que las contraseñas son iguales
        if ($password != $passwordRepeat) {
            return ['error' => 'Las contraseñas no coinciden'];
        }

        if ($tutor != null) {
            $stmt = $conn->prepare("SELECT IdTutor FROM Tutor WHERE IdTutor = ?");
            $stmt->bindParam(1, $tutor);
            $stmt->execute();
            if ($stmt->rowCount() == 0) {
                // El tutor no existe
                return ['error' => 'El tutor no existe'];
            }
        }

        // Actualizar los datos del usuario
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
        $stmt->bindParam(4, $password); // Hash de la contraseña
        $stmt->bindParam(5, $tutor);
        $stmt->bindParam(6, $course);
        $stmt->bindParam(7, $idPersona);
        $stmt->execute();

        // Verificar si se han actualizado los datos en la tabla Persona
        if ($stmt->rowCount() > 0) {
            // Los datos se han actualizado correctamente
            return ['success' => true];
        } else {
            // No se ha actualizado ningún registro
            return ['error' => 'No se ha podido editar el usuario'];
        }
    }


    public function editResult($idPersona, $success, $idEjercicio)
    {
        // Validar que los campos obligatorios no estén vacíos
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
    
        // Verificar si la persona es un alumno
        $query = "SELECT IdAlumno FROM Alumno WHERE IdPersona = :idPersona";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':idPersona', $idPersona);
        $stmt->execute();
        $idAlumno = $stmt->fetchColumn();
    
        if ($stmt->rowCount() == 0) {
            // Si la persona no es un alumno, devolver un error
            return ['unauthorized' => 'Este tipo de usuario no guarda sus resultados'];
        }
    
        // Comprobar si el resultado ya existe
        $query = "SELECT * FROM EjercicioRealizado WHERE IdAlumno = :idAlumno AND IdEjercicio = :idEjercicio";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':idAlumno', $idAlumno);
        $stmt->bindParam(':idEjercicio', $idEjercicio);
        $stmt->execute();
    
        if ($stmt->rowCount() == 0) {
            // Si no existe, insertar un nuevo resultado
            $query = "INSERT INTO EjercicioRealizado (Exito, IdAlumno, IdEjercicio) VALUES (:success, :idAlumno, :idEjercicio)";
        } else {
            // Si ya existe, actualizar el resultado existente
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


    public function editTutor($idPersona, $userName, $surnames, $age, $email, $password, $passwordRepeat, $tutor, $course)
    {
        // Validar que los campos obligatorios no estén vacíos
        if (empty($idPersona)) {
            return ['error' => 'El id es obligatorio'];
        }
        if (empty($email)) {
            return ['error' => 'El email es obligatorio'];
        }

        $conn = connect();

        // Verificar si el usuario es un alumno
        $stmt = $conn->prepare("SELECT IdTutor FROM Tutor WHERE IdPersona = ?");
        $stmt->bindParam(1, $idPersona);
        $stmt->execute();
        if ($stmt->rowCount() == 0) {
            // El usuario no es un alumno 
            return ['error' => 'El usuario no es un tutor'];
        }
        // Verificar que el correo electrónico es correcto
        $stmt = $conn->prepare("SELECT CorreoElectronico FROM Persona WHERE IdPersona = ?");
        $stmt->bindParam(1, $idPersona);
        $stmt->execute();
        $row = $stmt->fetch();
        if ($row['CorreoElectronico'] != $email) {
            // El correo electrónico no es correcto
            return ['error' => 'Se está intentando modificar un usuario diferente.'];
        }

        // Comprobar que las contraseñas son iguales
        if ($password != $passwordRepeat) {
            return ['error' => 'Las contraseñas no coinciden'];
        }

        if ($tutor != null) {
            $stmt = $conn->prepare("SELECT IdTutor FROM Tutor WHERE IdTutor = ?");
            $stmt->bindParam(1, $tutor);
            $stmt->execute();
            if ($stmt->rowCount() == 0) {
                // El tutor no existe
                return ['error' => 'El tutor no existe'];
            }
        }

        // Actualizar los datos del usuario
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
        $stmt->bindParam(4, $password); // Hash de la contraseña
        $stmt->bindParam(5, $tutor);
        $stmt->bindParam(6, $course);
        $stmt->bindParam(7, $idPersona);
        $stmt->execute();

        // Verificar si se han actualizado los datos en la tabla Persona
        if ($stmt->rowCount() > 0) {
            // Los datos se han actualizado correctamente
            return ['success' => true];
        } else {
            // No se ha actualizado ningún registro
            return ['error' => 'No se ha podido editar el tutor'];
        }
    }

    public static function getUserById($userId)
{
    $conn = connect();
    $query = "
        SELECT p.*, a.IdTutor, a.Curso
        FROM PERSONA p
        LEFT JOIN ALUMNO a ON p.IdPersona = a.IdPersona
        WHERE p.IdPersona = :userId
    ";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':userId', $userId);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!empty($user['IdTutor'])) {
        // El usuario es alumno, devolver los campos de la tabla ALUMNO
        return array(
            'IdPersona' => $user['IdPersona'],
            'Nombre' => $user['Nombre'],
            'Apellidos' => $user['Apellidos'],
            'Edad' => $user['Edad'],
            'CorreoElectronico' => $user['CorreoElectronico'],
            'Contrasena' => $user['Password'],
            'Rol' => 'alumno',
            'IdTutor' => $user['IdTutor'],
            'Curso' => $user['Curso']
        );
    } else {
        // El usuario es tutor, devolver los campos de la tabla TUTOR
        $query = "
            SELECT p.*, t.IdTutor, t.Curso
            FROM PERSONA p
            LEFT JOIN TUTOR t ON p.IdPersona = t.IdPersona
            WHERE p.IdPersona = :userId
        ";
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
            'Curso' => $user['Curso']
        );
    }
}

    public static function getStudentByEmail($email)
    {
        $conn = connect();

        // Consulta SQL para obtener el id del alumno a partir del correo electrónico
        $query = "SELECT a.idAlumno FROM ALUMNO a INNER JOIN PERSONA p ON a.IdPersona = p.IdPersona WHERE p.correoelectronico = :email";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $idAlumno = $stmt->fetch(PDO::FETCH_COLUMN);

        if (!$idAlumno) {
            return ['error' => 'No se encuentra el alumno.'];
        }

        // Consulta SQL para obtener todos los registros de ejercicio realizado correspondientes al id de alumno obtenido anteriormente
        $query = "SELECT * FROM EJERCICIOREALIZADO WHERE idAlumno = :idAlumno";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':idAlumno', $idAlumno);
        $stmt->execute();
        $ejercicios = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Consulta SQL para obtener los datos de persona y alumno correspondientes al correo electrónico especificado
        $query = "SELECT p.Nombre, p.Apellidos FROM PERSONA p INNER JOIN ALUMNO a ON p.idPersona = a.idPersona WHERE p.correoelectronico = :email";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        $user['Ejercicios'] = $ejercicios; // Añadir los datos de ejercicio realizado al arreglo $user

        return $user; // Retorna el alumno encontrado con sus datos de persona y ejercicio realizado
    }


    public function searchStudent($email, $idPersona)
    {
        // Conexión a la base de datos
        $conn = connect();
        $query = "
        SELECT IdTutor FROM Tutor WHERE IdPersona = :idPersona;
        ";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':idPersona', $idPersona);
        $stmt->execute();
        $tutorData = $stmt->fetch(PDO::FETCH_ASSOC);

        // Verificar si el tutor existe
        if (!$tutorData) {
            // Retornar un mensaje de error
            return ['error' => 'El tutor no existe.'];
        }

        // Obtener el código del tutor
        $idTutor = $tutorData['IdTutor'];

        // Consulta SQL para obtener los datos del alumno con el correo electrónico proporcionado que está asignado al tutor con el ID proporcionado
        $query = "
        SELECT Persona.Nombre, Persona.Apellidos, Persona.Edad, Persona.CorreoElectronico, Alumno.Curso, Alumno.IdTutor
        FROM Persona
        INNER JOIN Alumno ON Persona.IdPersona = Alumno.IdPersona
        WHERE Persona.CorreoElectronico = :email;
        ";

        $stmt = $conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);

        // Verificar si el usuario encontrado es un alumno
        if (!$userData) {
            // Retornar un mensaje de error
            return ['error' => 'El correo electrónico proporcionado no pertenece a un alumno.'];
        }

        // Verificar si el alumno encontrado está asignado al tutor con el ID proporcionado
        if ($userData['IdTutor'] != $idTutor) {
            // Retornar un mensaje de error
            return ['error' => 'No es alumno de este tutor.'];
        }

        // Los datos se han actualizado correctamente
        return ['success' => true];
    }
}
