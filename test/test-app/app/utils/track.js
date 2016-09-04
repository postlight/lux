import Action from 'app/models/action';

export default async function track(trackable) {
  if (trackable) {
    const {
      id: trackableId,
      constructor: {
        name: trackableType
      }
    } = trackable;

    return await Action.create({
      trackableType,
      trackableId
    });
  }
}
