import { Controller } from 'lux-framework'

class CustomController extends Controller {
  query = [
    'userId'
  ];

  index() {
    return 204
  }
}

export default CustomController
