
<?php
require_once __DIR__ . '/../models/ConstantsModel.php';
/**
 * Clase controladora para la gestión de las constantes.
 */
class ConstantsController
{
    /**
     * Modelo para la gestión de las constantes.
     * @var ConstantsModel
     */
    private $constantsModel;

    /**
     * Constructor de la clase.
     * Inicializa el modelo de la gestión de constantes.
     */
    public function __construct()
    {
        $this->constantsModel = new ConstantsModel();
    }

    /**
     * Obtiene las constantes para la página de ayuda según el rol especificado.
     * @param string $rol Rol del usuario que accede a las constantes.
     * @return array Un array con las constantes según el rol especificado.
     */
    public function help()
    {
        $rol = $_GET['rol'] ?? '';
        $constants = [
            'ADMIN_TITLE' => $this->constantsModel::ADMIN_TITLE,
            'ADMIN_MESSAGE' => $this->constantsModel::ADMIN_MESSAGE,
            'TUTOR_TITLE' => $this->constantsModel::TUTOR_TITLE,
            'TUTOR_MESSAGE' => $this->constantsModel::TUTOR_MESSAGE,
            'STUDENT_TITLE' => $this->constantsModel::STUDENT_TITLE,
            'STUDENT_MESSAGE' => $this->constantsModel::STUDENT_MESSAGE,
            'VISITOR_TITLE' => $this->constantsModel::VISITOR_TITLE,
            'VISITOR_MESSAGE' => $this->constantsModel::VISITOR_MESSAGE,
        ];
        header('Content-Type: application/json');
        echo json_encode(['title' => $constants[$rol . '_TITLE'], 'message' => $constants[$rol . '_MESSAGE']]);
    }

    /**
     * Obtiene las constantes para la página de contacto.
     * @return array Un array con las constantes para la página de contacto.
     */
    public function contact()
    {
        $constants = [
            'CONTACT_TITLE' => $this->constantsModel::CONTACT_TITLE,
            'CONTACT_MESSAGE' => $this->constantsModel::CONTACT_MESSAGE,
        ];
        header('Content-Type: application/json');
        echo json_encode(['title' => $constants['CONTACT_TITLE'], 'message' => $constants['CONTACT_MESSAGE']]);
    }

    /**
     * Obtiene las constantes para la página sobre Matemágicas.
     * @return array Un array con las constantes para la página sobre Matemágicas.
     */
    public function about()
    {
        $constants = [
            'ABOUT_TITLE' => $this->constantsModel::ABOUT_TITLE,
            'ABOUT_MESSAGE' => $this->constantsModel::ABOUT_MESSAGE,
        ];
        header('Content-Type: application/json');
        echo json_encode(['title' => $constants['ABOUT_TITLE'], 'message' => $constants['ABOUT_MESSAGE']]);
    }

    /**
     * Obtiene las constantes para la página sobre la privacidad.
     * @return array Un array con las constantes para la página sobre la privacidad.
     */
    public function privacy()
    {
        $constants = [
            'PRIVACY_TITLE' => $this->constantsModel::PRIVACY_TITLE,
            'PRIVACY_MESSAGE' => $this->constantsModel::PRIVACY_MESSAGE,
        ];
        header('Content-Type: application/json');
        echo json_encode(['title' => $constants['PRIVACY_TITLE'], 'message' => $constants['PRIVACY_MESSAGE']]);
    }

    /**
     * Obtiene las constantes para la página sobre los términos de uso.
     * @return array Un array con las constantes para la página sobre los términos de uso.
     */
    public function terms()
    {
        $constants = [
            'TERMS_TITLE' => $this->constantsModel::TERMS_TITLE,
            'TERMS_MESSAGE' => $this->constantsModel::TERMS_MESSAGE,
        ];
        header('Content-Type: application/json');
        echo json_encode(['title' => $constants['TERMS_TITLE'], 'message' => $constants['TERMS_MESSAGE']]);
    }

    /**
     * Obtiene las constantes para la página de las cookies.
     * @return array Un array con las constantes para la página de las cookies.
     */
    public function cookies()
    {
        $constants = [
            'COOKIES_TITLE' => $this->constantsModel::COOKIES_TITLE,
            'COOKIES_MESSAGE' => $this->constantsModel::COOKIES_MESSAGE,
        ];
        header('Content-Type: application/json');
        echo json_encode(['title' => $constants['COOKIES_TITLE'], 'message' => $constants['COOKIES_MESSAGE']]);
    }
}
?>