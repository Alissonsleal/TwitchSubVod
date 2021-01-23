import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import ErrorModal from '../ErrorModal';

import VodModal from '../VodModal';

import { Container, Image } from './styles';

interface ResultProps {
  _id: string;
  animated_preview_url: string;
  preview: {
    large: string;
  };
  broadcast_id: number;
  title: string;
  views: number;
  url: string;
  length: number; //in seconds
  game: string;
  channel: {
    display_name: string;
  };
}

export const formatNumber = (num: number) => {
  if (num > 1000 && num < 1000000) {
    return (num / 1000).toString().slice(0, 3) + 'K';
  } else if (num > 1000000) {
    return (num / 1000000).toString().slice(0, 3) + 'M';
  } else {
    return num;
  }
};

const VodGallery = ({ data, quality }: any) => {
  console.log(data[0].channel.display_name);
  useEffect(() => {
    ReactGA.initialize(`${process.env.REACT_APP_GOOGLE_TRACKING}`, {
      testMode: process.env.NODE_ENV === 'test',
    });
  }, []);

  const [vodUrl, setVodUrl] = useState(''); //use useContext later to clear this when we search again
  const [error, setError] = useState(false);

  const handleVideo = async (result: any) => {
    const splitString = result.preview.large.split('/')[5];
    let dataUrl = `https://twitch-cors.herokuapp.com/https://vod-secure.twitch.tv/${splitString}/${quality}/index-dvr.m3u8`;

    try {
      const checkIfVideoExists = await axios.head(`${dataUrl}`);
      console.log(checkIfVideoExists);
      if (checkIfVideoExists.status !== 403) {
        setVodUrl(result.broadcast_id !== 1 ? dataUrl : result.url);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }

    window.scrollTo({ behavior: 'smooth', top: 300 });

    ReactGA.event({
      category: 'SearchedUserForDeletedVod',
      action: `${splitString}`,
    });
  };

  const timeToHMS = (s: number) => {
    const h = Math.floor(s / 3600);
    s -= h * 3600;
    const m = Math.floor(s / 60);
    s -= m * 60;

    return `${h}:${m > 10 ? m : '0' + m}:${s > 10 ? s : '0' + s}`;
  };

  return (
    <>
      {data && <h1>Streamer: {data[0].channel.display_name}</h1>}
      {vodUrl && <VodModal videoUrl={vodUrl} />}
      {error && !vodUrl && <ErrorModal message="Couldn't find this video" />}

      <Container>
        {data.map((result: ResultProps) => {
          return (
            <div key={result._id}>
              <button type="button" onClick={() => handleVideo(result)}>
                <div>
                  <Image
                    url={result.preview.large}
                    animated={result.animated_preview_url}
                  >
                    <span>{timeToHMS(result.length)}</span>
                  </Image>
                </div>
                <strong>{result.title}</strong>
                <p>Views: {formatNumber(result.views)}</p>
              </button>
            </div>
          );
        })}
      </Container>
    </>
  );
};

export default VodGallery;
