import { Controller } from 'lux-framework';

class FriendshipsController extends Controller {
  params = [
    'followee',
    'follower'
  ];
}

export default FriendshipsController;
