import { Controller } from 'LUX_LOCAL';

class CustomController extends Controller {
  query = [
    'userId'
  ];

  index({
    params: {
      userId
    }
  }) {
    return 204;
  };
}

export default CustomController;
