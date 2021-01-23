import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';

import { FiSearch, FiDownload } from 'react-icons/fi';

import api from '../../services/api';

import { Container, AnimationContainer, Thumbnail } from './styles';
import LinkBox from '../../components/LinkBox';
import Footer from '../../components/Footer';
import { formatNumber } from '../../components/VodGallery';
import LoadingModal from '../../components/LoadingModal';
import ErrorModal from '../../components/ErrorModal';

interface TwitchVideoProps {
  slug: string;
  tracking_id: string;
  title: string;
  thumbnails: {
    medium: string;
  };
  views: number;
}

const DownloadClip: React.FC = () => {
  useEffect(() => {
    ReactGA.initialize(`${process.env.REACT_APP_GOOGLE_TRACKING}`, {
      testMode: process.env.NODE_ENV === 'test',
    });
    ReactGA.pageview('/DownloadClip');
  }, []);

  const [clip, setClip] = useState('');
  const [twitchData, setTwitchData] = useState<TwitchVideoProps>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const clipSlug = (clipURL: string) => {
    let splittedClip = clipURL.split('/');
    return splittedClip[splittedClip.length - 1];
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get(`clips/${clipSlug(clip)}`);
      setTwitchData(data);
      setLoading(false);

      ReactGA.event({
        category: 'DownloadedClip',
        action: `https://clips.twitch.tv/${clipSlug}`,
      });
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError('Could not find the clip');
    }
  };

  return (
    <Container>
      <AnimationContainer>
        <h1>Twitch Clip Downloader</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <input
            type="text"
            name="clip"
            onChange={(event) => setClip(event.target.value)}
            value={clip}
            placeholder="https://clips.twitch.tv/CarefulNiceJaguarRickroll"
            aria-label="DownloadClipInput"
          />
          <button type="submit" onClick={handleSubmit} aria-label="submit">
            <FiSearch size={14} />
            Download Clip
          </button>
        </form>

        <LinkBox home />
        <LinkBox clips />
        <LinkBox vods />

        {loading && <LoadingModal />}
        {error && <ErrorModal message={error} />}

        {twitchData && (
          <Thumbnail>
            <img src={twitchData.thumbnails.medium} alt={twitchData.title} />

            <strong>{twitchData.title}</strong>
            <div>
              <p>Views: {formatNumber(twitchData.views)}</p>
              <a
                href={`https://clips-media-assets2.twitch.tv/AT-cm%7C${twitchData.tracking_id}.mp4`}
                rel="noopener noreferrer"
              >
                <FiDownload size={18} />
                Download
              </a>
            </div>
          </Thumbnail>
        )}
        {/* downloadlink = https://clips-media-assets2.twitch.tv/AT-cm%7C${tracking_id}.mp4 */}
      </AnimationContainer>
      <Footer />
    </Container>
  );
};

export default DownloadClip;
