import { useEffect, useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import axios from "axios";

const VideoSection = () => {
  const [videoSection, setVideoSection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoSection = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/video-section`
        );

        if (response.data.success) {
          setVideoSection(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch video section:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoSection();
  }, []);

  // Don't render anything while loading
  if (loading) {
    return null;
  }

  // Don't show the section if there is no active content
  if (!videoSection || !videoSection.isActive) {
    return null;
  }

  const {
    title,
    description,
    videoUrl,
    buttonText,
    buttonLink,
  } = videoSection;

  // Check whether the URL is from YouTube
  const isYouTube =
    videoUrl.includes("youtube.com") ||
    videoUrl.includes("youtu.be");

  // Convert YouTube URL into an embed URL
  const getYouTubeEmbedUrl = (url) => {
    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.hostname.includes("youtu.be")) {
        return `https://www.youtube.com/embed/${parsedUrl.pathname.slice(1)}`;
      }

      const videoId = parsedUrl.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      return url;
    } catch (error) {
      return url;
    }
  };

  return (
    <section className="w-full bg-[#F7F8F5] py-14 sm:py-20 md:py-24 lg:py-28 font-['Helvetica',_Arial,_sans-serif]">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-8 lg:px-12">

        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">

          {/* VIDEO */}
          <div className="relative">

            {/* Decorative green shape */}
            <div className="absolute -bottom-3 -left-3 h-16 w-16 rounded-2xl bg-[#EAF6D8] sm:-bottom-7 sm:-left-7 sm:h-32 sm:w-32" />

            {/* Video wrapper */}
            <div className="relative z-10 aspect-[16/10] w-full overflow-hidden bg-black shadow-[0_25px_70px_rgba(0,0,0,0.12)]">

              {isYouTube ? (
                <iframe
                  src={getYouTubeEmbedUrl(videoUrl)}
                  title={title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  src={videoUrl}
                  className="h-full w-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                />
              )}

            </div>

            {/* Small green accent */}
            <div className="absolute -right-2 -top-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#00e603] text-white shadow-lg sm:-right-5 sm:-top-5 sm:h-16 sm:w-16">
              <Play
                size={18}
                fill="currentColor"
                strokeWidth={1.5}
              />
            </div>

          </div>

          {/* CONTENT */}
          <div className="relative z-10 max-w-[560px]">


            {/* Heading */}
            <h2 className="max-w-[520px] text-3xl font-bold leading-[1.1] tracking-[-1px] text-[#171717] sm:text-5xl lg:text-[58px]">
              {title}
            </h2>

            {/* Description */}
            <p className="mt-4 max-w-[500px] text-sm leading-6 text-[#666666] sm:mt-6 sm:text-lg sm:leading-8">
              {description}
            </p>

            {/* Button */}
            <a
              href={buttonLink}
              className="group mt-6 inline-flex items-center gap-2.5 rounded-full bg-[#00ff03] px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-[#00e603] hover:shadow-[0_12px_30px_rgba(114,197,0,0.25)] sm:mt-9 sm:gap-3 sm:px-7 sm:py-4 sm:text-base"
            >
              <span>{buttonText}</span>

              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-1">
                <ArrowUpRight
                  size={17}
                  strokeWidth={2.2}
                />
              </span>
            </a>


          </div>

        </div>

      </div>
    </section>
  );
};

export default VideoSection;
