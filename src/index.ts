
// const fetch = require('node-fetch');
const convert = require('xml-js');
const get = require('lodash.get');
const BeachConstants = require('../beachConstants');

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function getAllBeachesAllTime() {
  return getFromApi('beaches/history/all.xml?v=1.0');
}

function getAllBeachesLatest() {
  return getFromApi('beaches.xml?v=1.0');
}

function getAllBeachesForRange(startDate, endDate) {
  if (!startDate || !endDate) {
    throw 'Both a start date and end date are required.';
  }

  if (!DATE_REGEX.test(startDate) || !DATE_REGEX.test(endDate)) {
    throw 'Dates must be formatted YYYY-MM-DD';
  }

  return getFromApi(`beaches/history.xml?v=1.0&from=${startDate}&to=${endDate}`);
}

function getSpecificBeachForRange(beachID, startDate, endDate) {
  if (!beachID || !startDate || !endDate) {
    throw 'The beach ID, start date, and end date are all required.';
  }

  if (!DATE_REGEX.test(startDate) || !DATE_REGEX.test(endDate)) {
    throw 'Dates must be formatted YYYY-MM-DD';
  }

  return getFromApi(`beach/${beachID}/history.xml?v=1.0&from=${startDate}&to=${endDate}`);
}

function getSpecificBeachAllTime(beachID) {
  if (!beachID) {
    throw 'The beach ID is required.';
  }

  return getFromApi(`beach/${beachID}/history/all.xml?v=1.0`);
}

async function getFromApi(path: string) {
  try {
    const res = await fetch(`http://app.toronto.ca/tpha/ws/${path}`);
    const response = await res.text();
    const beachData = formatBeachData(response);
    return beachData;
  } catch (err) {
    console.error({ err });
  }
}

/*
// example usage, commented out so we don't fetch it when this module is included
const test = getSpecificBeachForRange(1, '2019-02-01', '2019-09-31').then(res => {
  // console.log({ res });

  res.forEach(item => {
    // console.log({ item });
  });
});
*/

const formatBeachData = (rawData) => {
  const data = JSON.parse(
    convert.xml2json(rawData, {
      compact: false,
      spaces: 4
    })
  );

  const beaches = get(data, ['elements', 0, 'elements', 1, 'elements']);

  return beaches
    .map(beach => {
      const beachData = get(beach, ['elements']);
      const beachID = get(beach, ['attributes', 'beachId']);
      return {
        beachID: Number.parseInt(beachID),
        name: get(BeachConstants, [beachID, 'name']),
        map: get(BeachConstants, [beachID, 'map']),
        sampleDate: get(beachData, [0, 'elements', 0, 'text']),
        publishDate: get(beachData, [1, 'elements', 0, 'text']),
        eColiCount: Number.parseInt(get(beachData, [2, 'elements', 0, 'text'])),
        beachAdvisory: get(beachData, [3, 'elements', 0, 'text']),
        beachState: get(beachData, [4, 'elements', 0, 'text'])
      };
    })
    .filter(element => {
      if (get(element, ['name'])) {
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
