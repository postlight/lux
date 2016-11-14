import Action from '../models/action';

export default async function track(trackable, transaction) {
  if (trackable) {
    const props = {
      trackableId: trackable.id,
      trackableType: trackable.constructor.name
    };

    return await Action.create(props, transaction);
  }
}
