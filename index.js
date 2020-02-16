
const fetch = require('node-fetch');
const convert = require('xml-js');
const moment = require('moment');
let fs = require('fs');
const _ = require('lodash');
const BeachConstants = require('./beachConstants')

function getAllBeachesAllTime() {
  return getFromApi('http://app.toronto.ca/tpha/ws/beaches/history/all.xml?v=1.0');
}

function getAllBeachesLatest() {
  return getFromApi('http://app.toronto.ca/tpha/ws/beaches.xml?v=1.0');
}

function getAllBeachesForRange(start, endDate) {
  if (!start || !end) {
    throw 'Both a start date and end date are required. We also expect a date format of YYYY-MM-DD';
  }
  return getFromApi(`http://app.toronto.ca/tpha/ws/beaches/history.xml?v=1.0&from=${start}&to=${endDate}`);
}

function getSpecificBeachForRange(beachID, startDate, endDate) {
  if (!startDate || !endDate || !beachID) {
    throw 'Both a start date and end date are required. We also expect a date format of YYYY-MM-DD';
  }
  return getFromApi(`http://app.toronto.ca/tpha/ws/beach/${beachID}/history.xml?v=1.0&from=${startDate}&to=${endDate}`);
}

function getSpecificBeachAllTime(beachID) {
  if (!startDate || !endDate || !beachID) {
    throw 'Both a start date and end date are required. We also expect a date format of YYYY-MM-DD';
  }
  return getFromApi(`http://app.toronto.ca/tpha/ws/beach/${beachID}/history/all.xml?v=1.0`);
}

function getFromApi(url) {
  return fetch(url)
    .then(res => {
      return res.text();
    })
    .then(res => {
      const beachData = formatBeachData(res);
      return beachData;
    })
    .catch(err => {
      console.log({ err });
    });
}

const test = getSpecificBeachForRange(1, '2019-02-01', '2019-09-31').then(res => {
  // console.log({ res });

  res.forEach(item => {
    console.log({ item });
  });
});


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
  getAllBeachesAllTime,
  getAllBeachesLatest,
  getAllBeachesForRange,
  getSpecificBeachForRange,
  getSpecificBeachAllTime
};