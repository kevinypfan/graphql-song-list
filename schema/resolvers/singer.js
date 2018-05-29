const { find } = require('lodash');
const { songs, singers } = require('../data');


module.exports = {
  Query: {
    singer: (root, { id }) => {
      const singer = find(singers, { id });
      if (!singer) throw new Error(`系統內無此歌手，ID: ${id}`);
      return singer;
    },
    singers: () => singers,
  }
}