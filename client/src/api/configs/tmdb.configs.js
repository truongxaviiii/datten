import axios from 'axios';

const mediaType = {
  movie: 'movie',
  tv: 'tv',
};

const mediaCategory = {
  popular: 'popular',
  top_rated: 'top_rated',
};
// const dataState = { ep_num: 1, season: 1 };
// const [currentSeason, setCurrentSeason] = useState(1);
// CurrentState?.filter((item) => {
//   if (item.id == id) {
//     dataState['ep_num'] = item.episode_number;
//     dataState['season'] = item.season_number;
//     dataState['ep_name'] = item.episode_name;
//     dataState['episode_image'] = item.episode_image;
//   }
// });

// console.log(currentEpisode);
// useEffect(() => {
//   const ce = setCurrentSeason(dataState.season);

//   return ce;
// }, []);
// api/tmdb.js

const API_KEY = 'a854eeb0e1a12d715135e057ef46b394';
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchSeasonEpisodes = async (showId, seasonNumber) => {
  try {
    const response = await axios.get(`${BASE_URL}/tv/${showId}/season/${seasonNumber}?language=vi-VN&api_key=${API_KEY}`);
    return response.data.episodes;
  } catch (error) {
    // console.log(`${BASE_URL}/tv/${showId}/season/${seasonNumber}?language=vi-VN&${API_KEY}`);

    // console.error('Error fetching season episodes:', error);
    throw error;
  }
};

const backdropPath = imgEndpoint => `https://image.tmdb.org/t/p/original${imgEndpoint}&language=vi-VN`;

const posterPath = imgEndpoint => `https://image.tmdb.org/t/p/w500${imgEndpoint}&language=vi-VN`;

// const youtubePath = (videoId) => `https://www.youtube.com/embed/${videoId}?controls=0`;
const youtubePath = (videoId, currentSeason, episode) => {
  // console.log('------>sea',currentSeason)
  // Base URL for movies
  const baseMovieUrl = `https://vidsrc.cc/embed/movie/${videoId}`;
  const baseTvUrl = `https://vidsrc.cc/embed/tv/${videoId}/${currentSeason}/${episode}`;
  // const baseMovieUrl = `https://vidsrc.pro/embed/movie/${videoId}`;

  // Base URL for TV shows
  // const baseTvUrl = `https://vidsrc.pro/embed/tv/${videoId}/${currentSeason}/${episode}`;

  // Determine URL based on the presence of `episode`
  const url = currentSeason ? baseTvUrl : baseMovieUrl;

  // console.log(url)
  return url;
};

<iframe
  src="https://vidsrc.io/embed/movie?tmdb=385687"
  style="width: 100%; height: 100%;"
  frameborder="0"
  referrerpolicy="origin"
  allowfullscreen
></iframe>;
const tmdbConfigs = {
  mediaType,
  mediaCategory,
  backdropPath,
  posterPath,
  youtubePath,
};

export default tmdbConfigs;
