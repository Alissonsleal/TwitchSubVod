import React, { useRef, useState } from 'react';
import ReactGA from 'react-ga';
import { FiSearch } from 'react-icons/fi';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '@/utils/services/api';
import { useGlobal } from '@/stores/GlobalContext';
import { Container } from './styles';
import QualitySelection from '../QualitySelection';
import ErrorModal from '../ErrorModal';
import LoadingModal from '../LoadingModal';

const SearchInput = (): any => {
  const router = useRouter();
  const linkRef = useRef(null);
  const { setVideoQuality, error, setError } = useGlobal();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (username) {
      setLoading(true);
      try {
        setError('');
        api.get(`users?login=${username}`).then((response) => {
          try {
            api
              .get(`channels/${response.data.users[0]._id}/videos?limit=1`)
              .then((channelResponse: any) => {
                channelResponse.data.videos.length !== 0 &&
                  router.push(`/videos/${username}`);
                if (channelResponse.data._total === 0) {
                  setError(`${username} does not have any available streams`);
                }
              });

            ReactGA.event({
              category: 'SearchedUserForDeletedVod',
              action: `${username}`,
            });
          } catch (err) {
            setError('This user does not exist or is unavailable');
          } finally {
            setLoading(false);
          }
        });
      } catch (err) {
        console.warn(err);
        setLoading(false);
        setError('Something went wrong');
      }
    } else {
      setError('Enter a streamer username');
    }
  };

  return (
    <Container
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
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
        onChange={(event: any) => setVideoQuality(event.target.value)}
      />
      <button ref={linkRef} type="submit" aria-label="submit">
        <FiSearch size={14} />
        Search
      </button>
      {loading && <LoadingModal />}
      {error && <ErrorModal message={error} />}
    </Container>
  );
};

export default SearchInput;