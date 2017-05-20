import Action from '../models/action'

export default function track(trackable, trx) {
  if (trackable) {
    return Action
      .transacting(trx)
      .create({
        trackableId: trackable.id,
        trackableType: trackable.constructor.name
      })
  }

  return Promise.resolve()
}
