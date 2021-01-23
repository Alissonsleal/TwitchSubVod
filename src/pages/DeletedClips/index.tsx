import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import axios from 'axios';
import ReactPlayer from 'react-player';

import { FiSearch } from 'react-icons/fi';

import { Container, AnimationContainer } from './styles';
import LinkBox from '../../components/LinkBox';
import InfoModal from '../../components/InfoModal';
import Footer from '../../components/Footer';
import ErrorModal from '../../components/ErrorModal';
import LoadingModal from '../../components/LoadingModal';

const DeletedClips: React.FC = () => {
  useEffect(() => {
    ReactGA.initialize(`${process.env.REACT_APP_GOOGLE_TRACKING}`, {
      testMode: process.env.NODE_ENV === 'test',
    });
    ReactGA.pageview('/DeletedClips');
  }, []);

  const [vodId, setVodId] = useState('');
  const [data, setData] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [startingPointH, setStartingPointH] = useState('');
  const [startingPointM, setStartingPointM] = useState('');
  const [startingPointS, setStartingPointS] = useState('');
  const [endingPointH, setEndingPointH] = useState('');
  const [endingPointM, setEndingPointM] = useState('');
  const [endingPointS, setEndingPointS] = useState('');

  const hmsToSeconds = (h: any, m: any, s: any) => {
    return +h * 3600 + +m * 60 + +s;
  };

  // little hack here
  // todo: find a way to check if any request is being processed
  if (loading) {
    setTimeout(() => {
      setLoading(false);
      data[0] === '' && setNoData(true);
    }, 3000);
  }

  const handleSubmit = async () => {
    try {
      const startingSeconds = hmsToSeconds(
        startingPointH,
        startingPointM,
        startingPointS,
      );
      const endingSeconds = hmsToSeconds(
        endingPointH,
        endingPointM,
        endingPointS,
      );

      if (
        vodId.length === 11 &&
        endingSeconds - startingSeconds <= 300 &&
        endingSeconds - startingSeconds > 0
      ) {
        setLoading(true);
        for (let i = startingSeconds; i < endingSeconds; i++) {
          // there must be a lighter way to do this (instead of looping through every second)
          let url = `${process.env.REACT_APP_CORS_WORKER}https://clips-media-assets2.twitch.tv/${vodId}-offset-${i}.mp4`;
          axios
            .head(`${url}`)
            .then(() => {
              setData((data) => [
                ...data,
                `https://clips-media-assets2.twitch.tv/${vodId}-offset-${i}.mp4`,
              ]);
            })
            .catch(() => {
              return;
            });
        }
      } else {
        throw new Error(
          'Search time is longer than 5 minutes or Vod Id is Invalid',
        );
      }

      ReactGA.event({
        category: 'SearchedDeletedClip',
        action: `${vodId}`,
      });
    } catch (err) {
      alert(
        'Search time is longer than 5 minutes or Vod Id is Invalid or Search time is invalid',
      );
    }
  };

  return (
    <Container>
      <AnimationContainer>
        <h1>Deleted Twitch Clips</h1>

        <form
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div className="input-box">
            <input
              type="number"
              name="vodId"
              onChange={(event) => setVodId(event.target.value)}
              value={vodId}
              placeholder="Vod ID"
            />
            <InfoModal />
          </div>
          <div className="time-container">
            <div className="starting-time">
              <input
                type="number"
                name="Starting Point H"
                onChange={(event) => setStartingPointH(event.target.value)}
                value={startingPointH}
                placeholder="h"
                min="0"
              />
              <input
                type="number"
                name="Starting Point M"
                onChange={(event) => setStartingPointM(event.target.value)}
                value={startingPointM}
                placeholder="m"
                aria-label="startingM"
                min="0"
                max="59"
              />

              <input
                type="number"
                name="Starting Point S"
                onChange={(event) => setStartingPointS(event.target.value)}
                value={startingPointS}
                placeholder="s"
                min="0"
                max="59"
              />
            </div>
            <p>to</p>
            <div className="ending-time">
              <input
                type="number"
                name="Ending Point H"
                onChange={(event) => setEndingPointH(event.target.value)}
                value={endingPointH}
                placeholder="h"
                min="0"
              />
              <input
                type="number"
                name="Ending Point M"
                onChange={(event) => setEndingPointM(event.target.value)}
                value={endingPointM}
                placeholder="m"
                aria-label="endingM"
                min="0"
                max="59"
              />
              <input
                type="number"
                name="Ending Point S"
                onChange={(event) => setEndingPointS(event.target.value)}
                value={endingPointS}
                placeholder="s"
                min="0"
                max="59"
              />
            </div>
          </div>

          <button type="submit" onClick={handleSubmit} aria-label="submit">
            <FiSearch size={14} />
            Search
          </button>
        </form>

        <LinkBox home />

        {loading && <LoadingModal />}

        {data && (
          <>
            {data.map((item) => (
              <div className="video-container" key={item}>
                <ReactPlayer
                  key={item}
                  url={item}
                  controls
                  width="100%"
                  height="100%"
                />
              </div>
            ))}
          </>
        )}

        {noData && (
          <ErrorModal message="There are no clips in the specified time" />
        )}
        {data && console.log(data)}
      </AnimationContainer>
      <Footer />
    </Container>
  );
};

export default DeletedClips;
