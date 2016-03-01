import { Controller, action } from '../../index';

class ApplicationController extends Controller {
  beforeAction = [
    function (req, res) {
      const methods = [
        'GET',
        'POST',
        'PATCH',
        'PUT',
        'DELETE',
        'HEAD',
        'OPTIONS'
      ];

      const headers = [
        'Content-Type',
        'X-Requested-With'
      ];

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
      res.setHeader('Access-Control-Allow-Headers', headers.join(', '));
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
  ];
}

export default ApplicationController;
