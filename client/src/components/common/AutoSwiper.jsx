import { useRef, useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Swiper } from "swiper/react";
import "swiper/swiper.min.css";
import "swiper/css/navigation";
import { Navigation } from "swiper";

const AutoSwiper = ({ children }) => {
  const [showNav, setShowNav] = useState(true); // Tạm thời đặt thành true để kiểm tra
  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const updateNavigation = () => {
      if (swiperRef.current && swiperRef.current.swiper) {
        swiperRef.current.swiper.params.navigation.prevEl = prevRef.current;
        swiperRef.current.swiper.params.navigation.nextEl = nextRef.current;
        swiperRef.current.swiper.navigation.update();
      }
    };
    setTimeout(updateNavigation, 0);
  }, []);

  return (
    <Box sx={{ position: "relative" }}>
      <IconButton
        ref={prevRef}
        sx={{
          position: "absolute",
          top: "50%",
          left: "10px",
          zIndex: 10,
          transform: "translateY(-50%)",
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: showNav ? "flex" : "none",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
          "& .MuiSvgIcon-root": {
            fontSize: "2rem",
          },
        }}
      >
        <ArrowBackIosIcon />
      </IconButton>

      <IconButton
        ref={nextRef}
        sx={{
          position: "absolute",
          top: "50%",
          right: "10px",
          zIndex: 10,
          transform: "translateY(-50%)",
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: showNav ? "flex" : "none",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
          "& .MuiSvgIcon-root": {
            fontSize: "2rem",
          },
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>

      <Box
        sx={{
          "& .swiper-slide": {
            width: {
              xs: "50%",
              sm: "35%",
              md: "25%",
              lg: "20.5%",
            },
          },
        }}
      >
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView="auto"
          grabCursor={true}
          style={{ width: "100%", height: "max-content" }}
          spaceBetween={15}
        >
          {children}
        </Swiper>
      </Box>
    </Box>
  );
};

export default AutoSwiper;
