import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const SwiperTest = () => {
  return (
    <div style={{ width: "500px", margin: "50px auto" }}>

      <Swiper
        modules={[Navigation]}
        slidesPerView={1}
        navigation
        onSwiper={(swiper) => {
          console.log("SWIPER CREATED");
          console.log(swiper);
        }}
        onSlideChange={(swiper) => {
          console.log("CURRENT SLIDE:", swiper.activeIndex);
        }}
      >

        <SwiperSlide>
          <div style={{
            height: "300px",
            background: "orange",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px"
          }}>
            SLIDE 1
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div style={{
            height: "300px",
            background: "red",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px"
          }}>
            SLIDE 2
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div style={{
            height: "300px",
            background: "blue",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px"
          }}>
            SLIDE 3
          </div>
        </SwiperSlide>

      </Swiper>

    </div>
  );
};

export default SwiperTest;