const { find, filter } = require('lodash');
const { songs, singers } = require('../data');
const crypto = require('crypto');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

module.exports = {
  Subscription: {
    songAdded: {
      subscribe: () => {
        return pubsub.asyncIterator('songAdded')
      },
    },
  },
  Query: {
    song: (root, { id }) => {
      const song = find(songs, { id });
      if (!song) throw new Error(`找不到此歌曲，ID: ${id}`);
      return song;
    },
    songs: () => songs
  },
  Mutation: {
    upvoteSong: (root, { songId }) => {
      const song = find(songs, { id: songId });
      if (!song) throw new Error(`找不到此歌曲，ID: ${songId}`);
      song.votes += 1;
      return song;
    },
    addSong: (root, args) => {
      if (args.singerId === 'other') {
        const singerRandomId = crypto.randomBytes(3).toString('base64');
        const songRandomId = crypto.randomBytes(3).toString('base64');
        singers.push({
          id: singerRandomId,
          firstName: args.firstName,
          lastName: args.lastName
        })
        let song = {
          id: songRandomId,
          title: args.title,
          singerId: singerRandomId,
          votes: 0
        };

        songs.push(song)
        pubsub.publish('songAdded', {
          songAdded: {
            ...song
          },
        });

        return song;
      } else {
        const songRandomId = crypto.randomBytes(3).toString('base64');
        let singer = find(singers, { id: args.singerId });
        if (!singer) throw new Error(`沒有此歌手，ID: ${singerId}`)
        let song = {
          id: songRandomId,
          singerId: args.singerId,
          title: args.title,
          votes: 0
        }

        songs.push(song)
        pubsub.publish('songAdded', {
          songAdded: {
            ...song
          },
        });

        return song
      }
    }
  },
  Singer: {
    songs: (root) => filter(songs, { singerId: root.id })
  },
  Song: {
    singer: (root) => find(singers, { id: root.singerId })
  }
}