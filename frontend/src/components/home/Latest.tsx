import { useEffect, useState } from "react";
import { COMMON_URL } from "../../api";
import type { Anime } from "../../types";
import AnimeCard from "../anime/AnimeCard";

const Latest = () => {

  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageData, setPageData] = useState<{ max: number, current: number }>();

  async function getPopular(pageNumber: number) {
    const res = await COMMON_URL.get(`/anime/latest/${pageNumber}`);
    const { data, metadata }: { data: Anime[], metadata: { page: { max: number, current: number } } } = res.data;
    // console.log(data);
    // console.log(metadata.page);
    setAnimeList(data);
    setPageData(metadata.page);
  }

  useEffect(() => {
    getPopular(pageNumber);
    // console.log("FUCK YOU TEST", pageNumber);
  }, [pageNumber]);

  return <>
    <div className="px-[100px] py-16 bg-[#242031] min-h-screen text-white">
      <h1 className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
        Latest Shows
      </h1>
      <div className="grid grid-cols-5 gap-10">
        {animeList.map((anime) => (
          <>
            <AnimeCard
              key={Math.random()}
              imgUrl={anime.thumbnailUrl}
              title={anime.title}
            />
          </>
        ))}
      </div>

      {/* <div className="flex justify-center gap-10">
        <button onClick={() => {
          setPageNumber(prev => {
            if (prev - 1 > 0) return prev - 1
            return prev
          })
        }}>back</button>
        {
          pageData &&
          new Array(10).fill(0).map((ele, index) => {
            console.log(pageData.current, "ligma");
            return <div key={index} onClick={() => setPageNumber(index + 1)}>
              {index + 1}
            </div>
          }).slice(Math.min(pageData.current - 1, pageData.max-1-3), Math.min(pageData.current - 1, pageData.max-1-3) + 3)
        }
        {
          pageData && pageData.current + 3 < pageData?.max ? <>
            ...
            <div onClick={() => setPageNumber(pageData?.max)}>
              {pageData?.max}
            </div>
          </>
            :
            <div onClick={() => setPageNumber((prev) => {
              if (pageData) return pageData.max
              return prev
            })}>
              {pageData?.max}
            </div>
        }
        <button onClick={() => {
          setPageNumber(prev => {
            if (pageData && prev + 3 < pageData?.max) return prev + 1
            return prev
          })
        }}>forward</button>
      </div> */}

      <div className="flex justify-center items-center gap-6 mt-10 text-gray-300 select-none">
        {/* Back button */}
        <button
          onClick={() => {
            setPageNumber((prev) => {
              if (prev - 1 > 0) return prev - 1;
              return prev;
            });
          }}
          className="px-4 py-2 rounded-md bg-[#1a172b]/70 hover:bg-[#28243a]/70 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={pageData?.current === 1}
        >
          ← Back
        </button>

        {/* Page numbers */}
        {pageData &&
          new Array(10)
            .fill(0)
            .map((_, index) => {
              return (
                <div
                  key={index}
                  onClick={() => setPageNumber(index + 1)}
                  className={`px-3 py-1 rounded-md cursor-pointer text-sm transition ${pageData.current === index + 1
                      ? "bg-gradient-to-r from-pink-400 to-amber-300 text-white shadow-md"
                      : "hover:bg-[#28243a]/70 text-gray-400"
                    }`}
                >
                  {index + 1}
                </div>
              );
            })
            .slice(
              Math.min(pageData.current - 1, pageData.max - 1 - 3),
              Math.min(pageData.current - 1, pageData.max - 1 - 3) + 3
            )}

        {/* Ellipsis + last page */}
        {pageData && pageData.current + 3 < pageData?.max ? (
          <>
            <span className="text-gray-500 mx-1">...</span>
            <div
              onClick={() => setPageNumber(pageData?.max)}
              className="px-3 py-1 rounded-md cursor-pointer text-sm hover:bg-[#28243a]/70 text-gray-400 transition"
            >
              {pageData?.max}
            </div>
          </>
        ) : (
          <div
            onClick={() =>
              setPageNumber((prev) => {
                if (pageData) return pageData.max;
                return prev;
              })
            }
            className={`px-3 py-1 rounded-md cursor-pointer text-sm transition ${pageData?.current === pageData?.max
                ? "bg-gradient-to-r from-pink-400 to-amber-300 text-white shadow-md"
                : "hover:bg-[#28243a]/70 text-gray-400"
              }`}
          >
            {pageData?.max}
          </div>
        )}

        {/* Forward button */}
        <button
          onClick={() => {
            setPageNumber((prev) => {
              if (pageData && prev + 1 > pageData?.max) return prev
              return prev + 1;
            });
          }}
          className="px-4 py-2 rounded-md bg-[#1a172b]/70 hover:bg-[#28243a]/70 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={pageData?.current === pageData?.max}
        >
          Forward →
        </button>
      </div>

    </div>
  </>
}

export default Latest;
