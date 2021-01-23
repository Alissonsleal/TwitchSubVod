import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';

import { FiSearch } from 'react-icons/fi';

import api from '../../services/api';

import { Container, AnimationContainer } from './styles';
import VodGallery from '../../components/VodGallery';
import LinkBox from '../../components/LinkBox';
import Footer from '../../components/Footer';
import QualitySelection from '../../components/QualitySelection';
import ErrorModal from '../../components/ErrorModal';
import LoadingModal from '../../components/LoadingModal';

interface TwitchVideoProps {
  videos: Array<{
    broadcast_id: number;
    channel: {
      display_name: string;
      description: string;
      followers: number;
      logo: string;
      video_banner: string;
    };
    thumbnails: {
      large: Array<{ url: string }>;
    };
  }>;
}

const Home: React.FC = () => {
  useEffect(() => {
    ReactGA.initialize(`${process.env.REACT_APP_GOOGLE_TRACKING}`, {
      testMode: process.env.NODE_ENV === 'test',
    });
    ReactGA.pageview('/');
  }, []);

  const [username, setUsername] = useState('');
  const [twitchData, setTwitchData] = useState<TwitchVideoProps>();
  const [quality, setQuality] = useState('chunked');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    try {
      setError('');
      api.get(`users?login=${username}`).then((response) => {
        try {
          api
            .get(`channels/${response.data.users[0]._id}/videos?limit=100`)
            .then((response: any) => {
              setTwitchData(response.data);
              setLoading(false);
              console.log(response.data._total);
              if (response.data._total === 0) {
                setError('This streamer does not have any available streams');
                setLoading(false);
              }
            });

          ReactGA.event({
            category: 'SearchedUserForDeletedVod',
            action: `${username}`,
          });
        } catch (err) {
          setError('This user does not exist or is unavailable');
          setLoading(false);
        }
      });
    } catch (err) {
      console.log(err);
      setLoading(false);
    }

    (quality || twitchData) && console.log(quality, twitchData);
  };

  return (
    <Container>
      <AnimationContainer>
        <h1>Twitch Sub Vod</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <input
            type="text"
            name="username"
            aria-label="username"
            onChange={(event) => setUsername(event.target.value)}
            value={username}
            placeholder="Streamer Username"
          />
          <QualitySelection
            onChange={(event: any) => setQuality(event.target.value)}
          />
          <button type="submit" aria-label="submit" onClick={handleSubmit}>
            <FiSearch size={14} />
            Search
          </button>
        </form>

        {error && <ErrorModal message={error} />}

        <LinkBox clips />
        <LinkBox vods />
        <LinkBox download />

        {loading && <LoadingModal />}

        {twitchData && (
          <>
            <VodGallery
              data={twitchData.videos}
              quality={quality === 'Source' ? 'chunked' : quality}
            />
          </>
        )}
      </AnimationContainer>
      <Footer />
    </Container>
  );
};

export default Home;
