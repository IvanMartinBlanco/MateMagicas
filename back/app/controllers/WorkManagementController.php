<?php
require_once __DIR__ . '/../models/WorkManagementModel.php';
/**
 * Clase controladora para la gestión de ejercicios.
 */
class WorkManagementController
{
    /**
     * @var WorkManagementModel Modelo para la gestión de ejercicios.
     */
    private $workManagement;

    /**
     * Constructor de la clase.
     * Inicializa el modelo de la gestión de ejercicios.
     */
    public function __construct()
    {
        $this->workManagement = new WorkManagementModel();
    }

    /**
     * Crea un nuevo ejercicio.
     * @param array $data Los datos del ejercicio.
     * @return void Retorna un objeto JSON con la respuesta sobre si se ha creado el ejercicio.
     */
    public function createWork()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $this->workManagement->createWork(
            $data['id'],
            $data['workId'],
            $data['stage'],
            $data['subject'],
            $data['name'],
            $data['level']
        );
        if (isset($result['success']) && $result['success']) {
            $response = [
                'success' => true,
                'message' => 'Ejercicio creado con éxito',
            ];
            header('Content-Type: application/json');
            http_response_code(201);
        } else {
            if (isset($result['error'])) {
                $mensaje = 'Error al añadir ejercicio: ' . $result['error'];
            } else {
                $mensaje = 'Error al añadir ejercicio: No se ha podido insertar el ejercicio en base de datos.';
            }
            $response = [
                'success' => false,
                'message' => $mensaje,
            ];
            header('Content-Type: application/json');
            http_response_code(400);
        }
        echo json_encode($response);
    }

    /**
     * Obtiene el número de variable de un ejercicio.
     * @param int $userId El ID del usuario.
     * @param int $workId El ID del ejercicio.
     * @return void Retorna un objeto JSON con el número de variables del ejercicio.
     */
    public function getNumberVariable()
    {
        $userId = $_GET['id'];
        $workId = $_GET['workId'];
        $workVariable = $this->workManagement->getNumberVariable(
            $userId,
            $workId
        );
        if (isset($workVariable['error'])) {
            header('Content-Type: application/json');
            http_response_code(400);
            echo json_encode(['error' => $workVariable['error']]);
            return;
        }
        $userObj = (object) $workVariable;
        header('Content-Type: application/json');
        http_response_code(200);
        echo json_encode($userObj);
    }

    /**
     * Obtiene el valor de una variable por su ID.
     * @param int $workId El ID del ejercicio.
     * @return void Retorna un objeto JSON con el valor de las variables del ejercicio.
     */
    public function getVariableValueById()
    {
        $workId = $_GET['id'];
        $workData = $this->workManagement->getVariableValueById($workId);
        $userObj = (object) $workData;
        header('Content-Type: application/json');
        http_response_code(201);
        echo json_encode($userObj);
    }

    /**
     * Obtiene los ejercicios según la etapa y la materia especificadas.
     * @param string $workStage La etapa de los ejercicios.
     * @param string $workSubject La materia de los ejercicios.
     * @return void Retorna un objeto JSON con los ejercicios de la materia.
     */
    public function getWorksBySubject()
    {
        $workStage = $_GET['stage'];
        $workSubject = $_GET['subject'];
        if ($workSubject == 'algebralineal') {
            $workSubject = 'algebra lineal';
        };
        $workData = $this->workManagement->getWorksBySubject($workStage, $workSubject);
        $result = [];
        foreach ($workData as $work) {
            $id = $work['idEjercicio'];
            $name = $work['nombre'];
            $level = $work['nivel'];
            if (!isset($result[$name])) {
                $result[$name] = [];
            }
            $result[$name][] = ['id' => $id, 'level' => $level, 'exerciseId' => $id];
        }
        header('Content-Type: application/json');
        http_response_code(201);
        echo json_encode($result);
    }

    /**
     * Edita las variables de un ejercicio.
     * @param array $data Los datos del ejercicio a modificar.
     * @param int $data['id'] El id del ejercicio a modificar.
     * @param array $data['data'] Las variables a modificar del ejercicio.
     * @return void Retorna un objeto JSON con el resultado de si se ha modificado o no las variables.
     */
    public function editVariable()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $variables = [];
        foreach ($data['data'] as $key => $value) {
            if ($key != 'id') {
                $variables[$key] = $value;
            }
        }
        $workId = $data['id'];
        $result = $this->workManagement->editVariable($variables, $workId);
        if (isset($result['success']) && $result['success']) {
            $response = [
                'success' => true,
                'message' => 'Variables modificadas con éxito',
            ];
            header('Content-Type: application/json');
            http_response_code(201);
        } else {
            if (isset($result['error'])) {
                $mensaje = 'Error al modificar variable: ' . $result['error'];
            } else {
                $mensaje = 'Error al modificar variable: No se ha podido editar la variable en base de datos.';
            }
            $response = [
                'success' => false,
                'message' => $mensaje,
            ];
            header('Content-Type: application/json');
            http_response_code(400);
        }
        echo json_encode($response);
    }

    /**
     * Elimina un ejercicio.
     * @param array $data Los datos del ejercicio a eliminar.
     * @param int $data['id'] El id del usuario que elimina.
     * @param array $data['workId'] El id del ejercicio a eliminar.
     * @return void Retorna un objeto JSON con el resultado de si se ha eliminado o no el ejercicio.
     */
    public function deleteWork()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $this->workManagement->deleteWork($data['id'], $data['workId']);
        if (isset($result['success']) && $result['success']) {
            $response = [
                'success' => true,
                'message' => 'Ejercicio eliminado con éxito',
            ];
            header('Content-Type: application/json');
            http_response_code(200);
        } else {
            if (isset($result['error'])) {
                $mensaje = 'Error al borrar ejercicio: ' . $result['error'];
            } else {
                $mensaje = 'Error al borrar ejercicio: No se ha podido borrar el ejercicio en base de datos.';
            }
            $response = [
                'success' => false,
                'message' => $mensaje,
            ];
            header('Content-Type: application/json');
            http_response_code(400);
        }
        echo json_encode($response);
    }
}
