import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Swiper, SwiperSlide } from 'swiper/react';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Chip, Divider, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import CircularRate from '../components/common/CircularRate';
import Container from '../components/common/Container';
import ImageHeader from '../components/common/ImageHeader';

import uiConfigs from '../configs/ui.configs';
import tmdbConfigs, { fetchSeasonEpisodes } from '../api/configs/tmdb.configs';
import mediaApi from '../api/modules/media.api';
import favoriteApi from '../api/modules/favorite.api';

import { setGlobalLoading } from '../redux/features/globalLoadingSlice';
import { setAuthModalOpen } from '../redux/features/authModalSlice';
import { addFavorite, removeFavorite } from '../redux/features/userSlice';

import CastSlide from '../components/common/CastSlide';
import MediaVideosSlide from '../components/common/MediaVideosSlide';
import BackdropSlide from '../components/common/BackdropSlide';
import PosterSlide from '../components/common/PosterSlide';
import RecommendSlide from '../components/common/RecommendSlide';
import MediaSlide from '../components/common/MediaSlide';
import MediaReview from '../components/common/MediaReview';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import MediaVideo from '../components/common/MediaVideosSlide';
// import { Swiper } from 'swiper';

const MediaDetail = () => {
  const { mediaType, mediaId } = useParams();
  // const dataState = { ep_num: 1, season: 1 };

  const [currentEp, setCurrentEp] = useState([]);
  const [episode, setEpisode] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSeason, setCurrentSeason] = useState(1);
  const { user, listFavorites } = useSelector(state => state.user);
  const [showSeasons, setShowSeasons] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const [media, setMedia] = useState();
  const [isFavorite, setIsFavorite] = useState(false);
  const [onRequest, setOnRequest] = useState(false);
  const [genres, setGenres] = useState([]);

  const dispatch = useDispatch();
  const [isTVShow, setIsTVShow] = useState(false);


  function timeConvert(n) {
    var num = n;
    var hours = num / 60;
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + 'giờ  ' + rminutes + 'phút.';
  }
  // Hàm xử lý khi dữ liệu được tải về
  const handleDataLoad = async media => {
    if (media?.seasons && media.seasons.length >= 1) {
      // Đây là phim bộ
      setIsTVShow(true);
      setCurrentSeason(media.seasons[0]?.season_number || 1);
      console.log('currentSs', currentSeason);
      try {
        const episodes = await fetchSeasonEpisodes(media.id, currentSeason);
        setCurrentEp(episodes);
      } catch (err) {
        setError('Vui lòng chọn lại mùa');
      } finally {
        setLoading(false);
      } // Giá trị mặc định của currentSeason
      setEpisode(1);
    } else {
      // Đây không phải phim bộ
      setIsTVShow(false);
      setCurrentSeason(null);
      setEpisode(null);
    }
  };

  const videoRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const getMedia = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = await mediaApi.getDetail({ mediaType, mediaId });
      dispatch(setGlobalLoading(false));

      if (response) {
        setMedia(response);
        setIsFavorite(response.isFavorite);
        setGenres(response.genres.splice(0, 2));
        handleDataLoad(response);
      }

      if (err) toast.error(err.message);
    };

    getMedia();
  }, [mediaType, mediaId, dispatch]);

  const handleSeasonClick = async season => {
    // console.log('ssss', season);
    // console.log('media.id:', media.id);

    setCurrentSeason(season.season_number);
    setLoading(true);
    setError(null);
    setEpisode(1);

    try {
      const episodes = await fetchSeasonEpisodes(media.id, season.season_number);
      setCurrentEp(episodes);
    } catch (err) {
      setError('Đã xảy ra lỗi không mong muốn!!');
    } finally {
      setLoading(false);
    }
  };

  const onFavoriteClick = async () => {
    if (!user) return dispatch(setAuthModalOpen(true));

    if (onRequest) return;

    if (isFavorite) {
      onRemoveFavorite();
      return;
    }

    setOnRequest(true);

    const body = {
      mediaId: media.id,
      mediaTitle: media.title || media.name,
      mediaType: mediaType,
      mediaPoster: media.poster_path,
      mediaRate: media.vote_average,
    };

    const { response, err } = await favoriteApi.add(body);

    setOnRequest(false);

    if (err) toast.error(err.message);
    if (response) {
      dispatch(addFavorite(response));
      setIsFavorite(true);
      toast.success('Thêm vào thành công');
    }
  };
  const handleEpisodeClick = async (e, currentSeason) => {
    setCurrentSeason(currentSeason);
    // console.log('ep:',ep)
    setEpisode(e);
    if (videoRef.current) {
      videoRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    // Fetch video liên quan đến tập phim đã chọn

    // console.log('---->ep', episode);
    // console.log('---->ss', currentSeason);
  };

  const onRemoveFavorite = async () => {
    if (onRequest) return;
    setOnRequest(true);

    const favorite = listFavorites.find(e => e.mediaId.toString() === media.id.toString());

    const { response, err } = await favoriteApi.remove({ favoriteId: favorite.id });

    setOnRequest(false);

    if (err) toast.error(err.message);
    if (response) {
      dispatch(removeFavorite(favorite));
      setIsFavorite(false);
      toast.success('Loại bỏ thành công!');
    }
  };
  // {console.log("season",currentSeason)}
  // {console.log('media:',media)}

  return media ? (
    <>
      {/* {console.log('-> media:', media)} */}
      <ImageHeader imgPath={tmdbConfigs.backdropPath(media.backdrop_path || media.poster_path)} />
      <Box
        sx={{
          color: 'primary.contrastText',
          ...uiConfigs.style.mainContent,
        }}
      >
        {/* media content */}
        <Box
          sx={{
            marginTop: { xs: '-10rem', md: '-15rem', lg: '-20rem' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { md: 'row', xs: 'column' },
            }}
          >
            {/* poster */}
            <Box
              sx={{
                width: { xs: '80%', sm: '60%', md: '40%' },
                margin: { xs: '0 auto 2rem', md: '0 2rem 0 0' },
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  // width: '100%',
                }}
              >
                <img
                  src={tmdbConfigs.posterPath(media.poster_path || media.backdrop_path)}
                  alt="Media"
                  style={{
                    width: '70%',
                    // height: '70%',
                    objectFit: 'cover', // Hoặc 'contain' tùy thuộc vào nhu cầu
                  }}
                />
              </Box>
            </Box>
            {/* poster */}

            {/* media info */}
            <Box
              sx={{
                width: { xs: '100%', md: '60%' },
                color: 'text.primary',
              }}
            >
              <Stack spacing={5}>
                {/* title */}
                <Typography
                  variant="h4"
                  fontSize={{ xs: '2rem', md: '2rem', lg: '4rem' }}
                  fontWeight="700"
                  sx={{ ...uiConfigs.style.typoLines(2, 'left') }}
                >
                  {`${media.title || media.name} 
                
                  `}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                  {/* rate */}
                  <CircularRate value={media.vote_average} />
                  {/* rate */}
                  <Divider orientation="vertical" />
                  {/* genres */}
                  {genres.map((genre, index) => (
                    <Chip label={genre.name} variant="filled" color="primary" key={index} />
                  ))}
                  {/* genres */}
                </Stack>
                {/* rate and genres */}

                {/* overview */}
                <Typography  sx={{ display:'flex',gap:'0.2rem'}}>
                  <Typography sx={{  fontWeight: 'bold', color: '#E0E0E0' }}>Thời lượng : </Typography>{' '}
                  <Typography sx={{ font: 'light', fontStyle: 'italic' }}>
                     {timeConvert(media?.runtime || media?.episode_run_time || '?')}
                  </Typography>
                </Typography>
                <Typography variant="body1" sx={{ display:'flex',gap:'0.2rem',marginTop:'0.85rem !important'}}>
                  <Typography sx={{  fontWeight: 'bold', color: '#E0E0E0' }}>Phát hành: </Typography>{' '}
                  <Typography sx={{ font: 'light', fontStyle: 'italic' }}>
                     {media?.first_air_date || media?.release_date}
                  </Typography>
                </Typography>
                <Typography  sx={{ display:'flex',gap:'0.2rem',marginTop:'0.85rem !important'}}>
                  <Typography sx={{  fontWeight: 'bold', color: '#E0E0E0' }}>Quốc gia : </Typography>{' '}
                  <Typography sx={{display:'flex', font: 'light', fontStyle: 'italic' }}>
                  {media?.production_countries?.map((g, i) => (
                    <Typography key={i}>
                      {(i ? ', ' : '') + g.name}
                    </Typography>
                  ))}
                  </Typography>
                </Typography>
                <Typography variant="body1" sx={{ ...uiConfigs.style.typoLines(5) }}>
                  {media.overview}
                </Typography>
                {/* overview */}

                {/* buttons */}
                <Stack direction="row" spacing={1}>
                  <LoadingButton
                    variant="text"
                    sx={{
                      width: 'max-content',
                      '& .MuiButon-starIcon': { marginRight: '0' },
                    }}
                    size="large"
                    startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
                    loadingPosition="start"
                    loading={onRequest}
                    onClick={onFavoriteClick}
                  />
                  <Button
                    variant="contained"
                    sx={{ width: 'max-content' }}
                    size="large"
                    startIcon={<PlayArrowIcon />}
                    onClick={() => videoRef.current.scrollIntoView()}
                  >
                    Xem ngay
                  </Button>
                </Stack>
                {/* buttons */}

                {/* cast */}
                <Container header="Diễn viên">
                  <CastSlide casts={media.credits.cast} />
                </Container>
                {/* cast */}
              </Stack>
            </Box>
            {/* media info */}
          </Box>
        </Box>
        {/* media content */}


        {/* media videos */}
        <div ref={videoRef} >
          <Container header="Phim">
            {/* {console.log('-->', media)} */}
            <MediaVideo video={media.videos} season={currentSeason} episode={episode} />
          </Container>
        </div>
        {isTVShow && (
          <div style={{ paddingTop: '2rem' }}>
            <Typography
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                // console.log('--.show:', showSeasons);
                setShowSeasons(!showSeasons);
                setIsOpen(!isOpen);
              }}
              fontWeight="700"
              variant="h5"
              component="h1"
              gutterBottom
            >
              Mùa Phim {showSeasons ? <ArrowDropUpIcon></ArrowDropUpIcon> : <ArrowDropDownIcon></ArrowDropDownIcon>}
            </Typography>

            {showSeasons && (
              <Box
                sx={{
                  '& .swiper-slide': {
                    width: { xs: '25%', md: '20%', lg: '12.5%' },
                    color: 'primary.contrastText',
                  },
                }}
              >
                <Swiper
                  spaceBetween={10}
                  slidesPerView={'auto'}
                  grabCursor={true}
                  style={{ width: '100%', height: 'max-content' }}
                >
                  {media?.seasons
                    ?.filter(f => f.name !== 'Specials')
                    .map((s, index) => {
                      return (
                        <SwiperSlide key={index}>
                          {/* <Link to={routesGen.person(cast.id)}> */}
                          <Box
                            onClick={() => handleSeasonClick(s)}
                            sx={{
                              paddingTop: '140%',
                              color: 'text.primary',

                              ...uiConfigs.style.backgroundImage(tmdbConfigs.posterPath(s?.poster_path)),
                            }}
                          >
                            <Box
                              sx={{
                                position: 'absolute',
                                width: '100%',
                                height: 'max-content',
                                bottom: 0,
                                // backgroundColor: episode === ep.episode_number ? 'primary.light' : 'transparent',

                                padding: '10px 0 10px 0',
                                backgroundColor: currentSeason === s.season_number ? 'primary.light' : 'rgba(0,0,0,0.6)',
                              }}
                            >
                              <Typography sx={{ ...uiConfigs.style.typoLines(1, 'center') }}>
                                {s.name} { s?.air_date && `(${s.air_date.split('-')[0]})` }
                              </Typography>
                            </Box>
                          </Box>
                          {/* </Link> */}
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </Box>
            )}
            {/* {loading && <Typography>Loading...</Typography>} */}
            {error && <Typography color="error">{error}</Typography>}

            {currentSeason && !loading && (
              <Box sx={{ paddingTop: '50px' }}>
                <Typography fontWeight="700" variant="h5" component="h5" gutterBottom>
                  Các Tập Phim
                </Typography>
                <Grid container spacing={2}>
                  {currentEp?.map(ep => (
                    <Grid item xs={12} sm={6} md={4} lg={2} key={ep.episode_number}>
                      <Box
                        onClick={() => handleEpisodeClick(ep.episode_number, currentSeason)}
                        sx={{
                          padding: '4px', // Giảm padding để làm khung nhỏ hơn
                          border: '1px solid',
                          borderColor: 'transparent',
                          borderRadius: '4px', // Giảm border-radius để làm khung nhỏ hơn
                          cursor: 'pointer',
                          backgroundColor: episode === ep.episode_number ? 'primary.light' : 'rgb(23, 23, 23 ,1)',
                          '&:hover': {
                            backgroundColor: 'primary.light',
                          },
                          fontSize: '0.85rem', // Giảm kích thước font
                        }}
                      >
                        <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
                          Tập {ep.episode_number}:
                          <Typography sx={{ font: 'light', color: 'gray', fontStyle: 'italic', fontSize: '0.85rem' }}>
                            {ep.name}
                          </Typography>
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                          {' '}
                          {/* Giảm kích thước font */}
                          {ep.episode_title}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </div>
        )}
        {/* media videos */}

        {/* media backdrop */}
        {media.images.backdrops.length > 0 && (
          <Container header="backdrops">
            <BackdropSlide backdrops={media.images.backdrops} />
          </Container>
        )}
        {/* media backdrop */}

        {/* media posters */}
        {media.images.posters.length > 0 && (
          <Container header="posters">
            <PosterSlide posters={media.images.posters} />
          </Container>
        )}
        {/* media posters */}

        {/* media reviews */}
        <MediaReview reviews={media.reviews} media={media} mediaType={mediaType} />
        {/* media reviews */}

        {/* media recommendation */}
        <Container header="Có thể bạn sẽ thích">
          {media.recommend.length > 0 && <RecommendSlide medias={media.recommend} mediaType={mediaType} />}
          {media.recommend.length === 0 && (
            <MediaSlide mediaType={mediaType} mediaCategory={tmdbConfigs.mediaCategory.top_rated} />
          )}
        </Container>
        {/* media recommendation */}
      </Box>
    </>
  ) : null;
};

export default MediaDetail;
