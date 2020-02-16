
const fetch = require('node-fetch');
const convert = require('xml-js');
const moment = require('moment');
let fs = require('fs');
const _ = require('lodash');
const BeachConstants = require('./beachConstants')

async function getAllBeachesForAllTime() {

  return await fetch(
    'http://app.toronto.ca/tpha/ws/beaches/history/all.xml?v=1.0'
  )
    .then(res => {
      return res.text();
    })
    .then(res => {
      const allTimeBeachData = formatBeachData(res);
      return allTimeBeachData;
    })
    .catch(err => {
      console.log({ err });
    });
}




function getAllBeachesLatest() {
  return fetch('http://app.toronto.ca/tpha/ws/beaches.xml?v=1.0')
    .then(res => {
      return res.text();
    })
    .then(res => {
      const allTimeBeachData = formatBeachData(res);
      return allTimeBeachData;
    })
    .catch(err => {
      console.log({ err });
    });
}




const test = getAllBeachesLatest()
  .then(res => {

    console.log({res});
  })


  const formatBeachData = (rawData) => {
    const data = JSON.parse(
      convert.xml2json(rawData, {
        compact: false,
        spaces: 4
      })
    );

    const beaches = _.get(data, ['elements', 0, 'elements', 1, 'elements']);

    return beaches
      .map(beach => {
        const beachData = _.get(beach, ['elements']);
        const beachID = _.get(beach, ['attributes', 'beachId']);
        return {
          beachID: Number(beachID),
          name: _.get(BeachConstants, [beachID, 'name']),
          map: _.get(BeachConstants, [beachID, 'map']),
          sampleDate: moment(
            _.get(beachData, [0, 'elements', 0, 'text']),
            'YYYY-MM-DD'
          ).format('YYYY-MM-DD'),
          publishDate: moment(
            _.get(beachData, [1, 'elements', 0, 'text']),
            'YYYY-MM-DD'
          ).format('YYYY-MM-DD'),
          eColiCount: Number(_.get(beachData, [2, 'elements', 0, 'text'])),
          beachAdvisory: _.get(beachData, [3, 'elements', 0, 'text']),
          beachState: _.get(beachData, [4, 'elements', 0, 'text'])
        };
      })
      .filter(element => {
        if (_.get(element, ['name'])) {
          return element;
        }
      });
  }




module.exports = {
  getAllBeachesForAllTime,
  getAllBeachesLatest,
};