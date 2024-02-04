import ScoreOverwrite from '../types/ScoreOverwrite.js';

import { env } from '../env.js';

import { join, dirname } from 'path';
import parser, { Options } from 'csv-parser'
import { createReadStream } from 'fs'

async function load_score_overwrites() {
  const score_overwrites: Array<ScoreOverwrite> = [];

  return new Promise((
    resolve: (args: Array<ScoreOverwrite>) => void,
    reject: (args: Array<ScoreOverwrite>) => void
  ) => {
    const input_data_path = join(dirname(process.argv[1]), 'data/' + env.SCORE_OVERWRITES_FILE_NAME);
    createReadStream(input_data_path)
      .pipe(parser({ delimiter: ",", from_line: 2 } as Options))
      .on("data", function (row) {
        const score_overwrite: ScoreOverwrite = {
          contestant_id: row.contestant_id,
          oj: row.oj,
          contest_id: row.contest_id,
          score: {
            points: parseFloat(row.points),
            penalty: parseInt(row.penalty),
          }
        };
        score_overwrites.push(score_overwrite);
      })
      .on("end", function () {
        resolve(score_overwrites);
      })
      .on("error", function (error) {
        console.log(error.message);
        reject([]);
      });
  })
}

export default load_score_overwrites;
