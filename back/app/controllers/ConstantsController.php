
<?php
require_once __DIR__ . '/../models/ConstantsModel.php';

class ConstantsController
{
  private $constantsModel;

  public function __construct()
  {
    // Inicializa el modelo de inicio y cierre de sesión
    $this->constantsModel = new ConstantsModel();
  }
  public function help()
  {
    $rol = $_GET['rol'] ?? '';
    $constants = [
      'ADMIN_TITLE' =>  $this->constantsModel::ADMIN_TITLE,
      'ADMIN_MESSAGE' =>  $this->constantsModel::ADMIN_MESSAGE,
      'TUTOR_TITLE' =>  $this->constantsModel::TUTOR_TITLE,
      'TUTOR_MESSAGE' =>  $this->constantsModel::TUTOR_MESSAGE,
      'STUDENT_TITLE' =>  $this->constantsModel::STUDENT_TITLE,
      'STUDENT_MESSAGE' =>  $this->constantsModel::STUDENT_MESSAGE,
      'VISITOR_TITLE' =>  $this->constantsModel::VISITOR_TITLE,
      'VISITOR_MESSAGE' =>  $this->constantsModel::VISITOR_MESSAGE,
    ];
    header('Content-Type: application/json');
    echo json_encode(['title' => $constants[$rol . '_TITLE'], 'message' => $constants[$rol . '_MESSAGE']]);
  }
  public function contact()
  {
    $constants = [
      'CONTACT_TITLE' =>  $this->constantsModel::CONTACT_TITLE,
      'CONTACT_MESSAGE' =>  $this->constantsModel::CONTACT_MESSAGE,
    ];
    header('Content-Type: application/json');
    echo json_encode(['title' => $constants['CONTACT_TITLE'], 'message' => $constants['CONTACT_MESSAGE']]);
  }
  public function about()
  {
    $constants = [
      'ABOUT_TITLE' =>  $this->constantsModel::ABOUT_TITLE,
      'ABOUT_MESSAGE' =>  $this->constantsModel::ABOUT_MESSAGE,
    ];
    header('Content-Type: application/json');
    echo json_encode(['title' => $constants['ABOUT_TITLE'], 'message' => $constants['ABOUT_MESSAGE']]);
  }
  public function privacy()
  {
    $constants = [
      'PRIVACY_TITLE' =>  $this->constantsModel::PRIVACY_TITLE,
      'PRIVACY_MESSAGE' =>  $this->constantsModel::PRIVACY_MESSAGE,
    ];
    header('Content-Type: application/json');
    echo json_encode(['title' => $constants['PRIVACY_TITLE'], 'message' => $constants['PRIVACY_MESSAGE']]);
  }
  public function terms()
  {
    $constants = [
      'TERMS_TITLE' =>  $this->constantsModel::TERMS_TITLE,
      'TERMS_MESSAGE' =>  $this->constantsModel::TERMS_MESSAGE,
    ];
    header('Content-Type: application/json');
    echo json_encode(['title' => $constants['TERMS_TITLE'], 'message' => $constants['TERMS_MESSAGE']]);
  }
  public function cookies()
  {
    $constants = [
      'COOKIES_TITLE' =>  $this->constantsModel::COOKIES_TITLE,
      'COOKIES_MESSAGE' =>  $this->constantsModel::COOKIES_MESSAGE,
    ];
    header('Content-Type: application/json');
    echo json_encode(['title' => $constants['COOKIES_TITLE'], 'message' => $constants['COOKIES_MESSAGE']]);
  }
}
?>