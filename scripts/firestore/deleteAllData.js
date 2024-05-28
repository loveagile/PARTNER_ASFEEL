const client = require('firebase-tools');

const collectionPathList = [
  'eventProjects',
  'leadersWantedProjects',
  'messageRoomProjects',
  'messageRoomUsers',
  'messageRooms',
  'privateUsers'
]

const main = () => {
  collectionPathList.forEach(async collectionPath => {
    await client.firestore
      .delete(collectionPath, {
        project: 'www-asfeel',
        recursive: true,
        yes: true
      });
  });
}

main()